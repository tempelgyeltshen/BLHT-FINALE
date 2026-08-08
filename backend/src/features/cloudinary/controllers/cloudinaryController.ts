import type { NextFunction, Request, Response } from 'express';
import { cloudinaryService } from '../services/cloudinaryService.js';

export async function getUploadSignature(req: Request, res: Response, next: NextFunction) {
  try {
    const { folder, resource_type = 'auto', public_id, eager } = req.body ?? {};
    const signature = cloudinaryService.getUploadSignature({
      folder,
      resource_type,
      public_id,
      eager,
    });
    res.json(signature);
  } catch (error) {
    next(error);
  }
}

export async function deleteCloudinaryResource(req: Request, res: Response, next: NextFunction) {
  try {
    const { public_id, resource_type = 'image' } = req.body ?? {};
    const result = await cloudinaryService.deleteResource({ public_id, resource_type });
    res.json(result);
  } catch (error) {
    next(error);
  }
}
