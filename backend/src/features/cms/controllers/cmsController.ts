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

/**
 * Stream a brochure PDF to the client through Cloudinary's authenticated
 * download endpoint. Cloudinary's public raw delivery can be blocked by the
 * account's Delivery Access Control (ACL) rules (401 "deny or ACL failure"),
 * which makes public res.cloudinary.com raw URLs unusable for viewing or
 * downloading. The Admin API download endpoint is signed with the API secret
 * and is never subject to the delivery ACL, so proxying through it restores
 * reliable PDF viewing/downloading.
 *
 * GET /api/cms/brochures/:id/pdf?download=1  (download=1 → attachment)
 */
export const streamBrochurePdf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = getRepository('brochures');
    const brochure = await repository.get(req.params.id);
    if (!brochure || !brochure.pdf_public_id) {
      return res.status(404).json({ error: { message: 'Brochure PDF not found.' } });
    }

    const wantDownload = req.query.download === '1' || req.query.download === 'true';
    const publicId = brochure.pdf_public_id as string;
    const resourceType = (brochure.pdf_resource_type as string) || 'raw';

    if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
      return res.status(503).json({ error: { message: 'Cloudinary is not configured.' } });
    }

    // Signed, time-limited (1 hour) authenticated download URL. Credentials
    // are taken from the cloudinary instance configured above (env-based).
    const expiresAt = Math.floor(Date.now() / 1000) + 3600;
    const downloadUrl = cloudinary.utils.private_download_url(publicId, 'pdf', {
      resource_type: resourceType,
      type: 'upload',
      expires_at: expiresAt,
      attachment: false,
    });

    // Guard against a hung upstream request holding the connection open.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    // Use the global fetch Response type (the express `Response` import above
    // would otherwise shadow it and break the .ok/.body accessors below).
    let upstream: Awaited<ReturnType<typeof fetch>>;
    try {
      upstream = await fetch(downloadUrl, { redirect: 'follow', signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
    if (!upstream.ok || !upstream.body) {
      return res.status(502).json({ error: { message: 'Failed to retrieve the PDF from storage.' } });
    }

    const safeTitle = String(brochure.title || 'brochure').replace(/[^a-zA-Z0-9_\- ]/g, '').trim() || 'brochure';
    const filename = `${safeTitle}_BLHT.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', wantDownload
      ? `attachment; filename="${filename}"`
      : `inline; filename="${filename}"`);
    // Revalidate so an admin re-upload for the same brochure id never serves
    // a stale cached PDF to visitors.
    res.setHeader('Cache-Control', 'public, no-cache');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition, Content-Length');

    // Pipe the upstream PDF body straight through to the client.
    const { Readable } = await import('stream');
    const nodeStream = Readable.fromWeb(upstream.body as any);
    nodeStream.on('error', () => {
      if (!res.headersSent) {
        res.status(502).end();
      }
    });
    nodeStream.pipe(res);
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
