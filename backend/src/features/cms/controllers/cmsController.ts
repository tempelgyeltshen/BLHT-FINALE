import type { NextFunction, Request, Response } from 'express';
import type { Entity } from '../../../shared/types/entity.js';
import { MongoRepository } from '../../../shared/repositories/MongoRepository.js';
import { slugify } from '../../../core/utils/helpers.js';
import { autoPopulateVideoMetadata, autoPopulateBrochureMetadata } from '../../../core/utils/autoCalculate.js';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '../../../core/config/env.js';

cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
  secure: true
});

type Resource = Entity & { [key: string]: unknown };

const resources = new Map<string, MongoRepository<Resource>>();

const getRepository = (name: string) => {
  if (!resources.has(name)) {
    resources.set(name, new MongoRepository<Resource>(name));
  }
  return resources.get(name)!;
};

/**
 * Auto-populate metadata for specific resource types
 */
async function autoPopulateMetadata(resourceType: string, data: Resource): Promise<Resource> {
  switch (resourceType) {
    case 'videos':
      // Handle YouTube videos
      if (data.youtubeId && typeof data.youtubeId === 'string') {
        const videoMetadata = await autoPopulateVideoMetadata(data.youtubeId);
        return {
          ...data,
          duration: data.duration || videoMetadata.duration,
          thumbnailUrl: data.thumbnailUrl || videoMetadata.thumbnailUrl
        };
      }
      // Handle Cloudinary videos - duration should come from Cloudinary
      if (data.videoUrl && data.duration) {
        return data; // Cloudinary metadata already provided
      }
      break;
      
    case 'brochures':
      // Handle Cloudinary PDFs - metadata should come from Cloudinary
      if (data.pdfUrl && data.fileSize && data.pdf_bytes) {
        return {
          ...data,
          fileSize: data.fileSize,
          totalPages: data.totalPages || 0 // Cloudinary doesn't provide page count for PDFs
        };
      }
      // Fallback to old behavior for non-Cloudinary PDFs
      if (data.pdfUrl && data.fileSize) {
        const brochureMetadata = await autoPopulateBrochureMetadata(
          data.pdfUrl as string,
          typeof data.fileSize === 'string' ? 0 : (data.fileSize as number)
        );
        return {
          ...data,
          fileSize: data.fileSize || brochureMetadata.fileSize,
          totalPages: data.totalPages || brochureMetadata.totalPages
        };
      }
      break;
  }
  
  return data;
}

export const listResource = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ data: await getRepository(req.params.resource).list() });
  } catch (e) {
    next(e);
  }
};

export const getResource = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getRepository(req.params.resource).get(req.params.id);
    if (!data) {
      return res.status(404).json({ error: { message: 'Resource not found.' } });
    }
    res.json({ data });
  } catch (e) {
    next(e);
  }
};

const isDuplicateKeyError = (error: unknown): boolean =>
  error instanceof Error && 'code' in error && (error as { code?: number }).code === 11000;

/** Generate a unique slug by appending a counter when the desired slug exists. */
const uniqueSlug = async (repository: MongoRepository<Resource>, base: string): Promise<string> => {
  const existing = await repository.list();
  const used = new Set(existing.map((item) => item.slug).filter(Boolean));
  let slug = base;
  let i = 2;
  while (used.has(slug)) {
    slug = `${base}-${i++}`;
  }
  return slug;
};

export const createResource = async (req: Request, res: Response, next: NextFunction) => {
  const repository = getRepository(req.params.resource);

  try {
    const autoPopulatedData = await autoPopulateMetadata(req.params.resource, req.body);

    // Auto-generate slug from name/title if not provided
    if (!autoPopulatedData.slug) {
      const source = (autoPopulatedData as any).name || (autoPopulatedData as any).title;
      if (typeof source === 'string' && source.trim()) {
        autoPopulatedData.slug = await uniqueSlug(repository, slugify(source) || `${req.params.resource}-${Date.now()}`);
      }
    }

    try {
      res.status(201).json({ data: await repository.create(autoPopulatedData) });
    } catch (createError) {
      // Guard against a race where two identical titles are created concurrently
      // (unique index on data.slug). Retry once with a timestamped slug, keeping
      // the auto-populated metadata (fileSize/totalPages, YouTube info, etc.).
      if (!isDuplicateKeyError(createError)) {
        throw createError;
      }
      const data = { ...autoPopulatedData, slug: `${req.params.resource}-${Date.now()}` };
      res.status(201).json({ data: await repository.create(data) });
    }
  } catch (e) {
    next(e);
  }
};

export const updateResource = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const autoPopulatedData = await autoPopulateMetadata(req.params.resource, req.body);
    const data = await getRepository(req.params.resource).update(req.params.id, autoPopulatedData);
    if (!data) {
      return res.status(404).json({ error: { message: 'Resource not found.' } });
    }
    res.json({ data });
  } catch (e) {
    next(e);
  }
};

export const deleteResource = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getRepository(req.params.resource).get(req.params.id);
    if (!data) {
      return res.status(404).json({ error: { message: 'Resource not found.' } });
    }

    // Delete from Cloudinary if Cloudinary metadata exists
    if (data.public_id && data.resource_type) {
      try {
        await cloudinary.uploader.destroy(data.public_id as string, { 
          resource_type: data.resource_type as 'image' | 'video' | 'raw' 
        });
      } catch (cloudinaryError) {
        console.error('Failed to delete from Cloudinary:', cloudinaryError);
        // Continue with MongoDB deletion even if Cloudinary deletion fails
      }
    }

    // Handle PDF-specific Cloudinary deletion
    if (data.pdf_public_id && data.pdf_resource_type) {
      try {
        await cloudinary.uploader.destroy(data.pdf_public_id as string, { 
          resource_type: data.pdf_resource_type as 'image' | 'video' | 'raw' 
        });
      } catch (cloudinaryError) {
        console.error('Failed to delete PDF from Cloudinary:', cloudinaryError);
        // Continue with MongoDB deletion even if Cloudinary deletion fails
      }
    }

    const deleted = await getRepository(req.params.resource).delete(req.params.id);
    res.status(deleted ? 204 : 404).end();
  } catch (e) {
    next(e);
  }
};
