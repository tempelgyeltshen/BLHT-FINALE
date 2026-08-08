import { Router } from 'express';
import { getUploadSignature, deleteCloudinaryResource } from '../controllers/cloudinaryController.js';
import { requireAdmin } from '../../../core/middleware/auth.js';

export const cloudinaryRouter = Router();

// Get signed upload signature
cloudinaryRouter.post(
  '/signature',
  requireAdmin,
  getUploadSignature
);

// Delete Cloudinary resource
cloudinaryRouter.post(
  '/delete',
  requireAdmin,
  deleteCloudinaryResource
);
