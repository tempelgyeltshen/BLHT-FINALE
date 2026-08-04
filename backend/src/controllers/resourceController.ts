import type { NextFunction, Request, Response } from 'express';
import type { Entity } from '../repositories/fileRepository.js';
import { MongoRepository } from '../repositories/mongoRepository.js';
import { autoPopulateVideoMetadata, autoPopulateBrochureMetadata } from '../utils/autoCalculate.js';

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
      if (data.youtubeId && typeof data.youtubeId === 'string') {
        const videoMetadata = await autoPopulateVideoMetadata(data.youtubeId);
        return {
          ...data,
          duration: data.duration || videoMetadata.duration,
          thumbnailUrl: data.thumbnailUrl || videoMetadata.thumbnailUrl
        };
      }
      break;
      
    case 'brochures':
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

export const createResource = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const autoPopulatedData = await autoPopulateMetadata(req.params.resource, req.body);
    res.status(201).json({ data: await getRepository(req.params.resource).create(autoPopulatedData) });
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
    const deleted = await getRepository(req.params.resource).delete(req.params.id);
    res.status(deleted ? 204 : 404).end();
  } catch (e) {
    next(e);
  }
};
