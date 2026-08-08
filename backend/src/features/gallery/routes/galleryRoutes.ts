import { Router } from 'express';
import {
  listGalleryItems,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
} from '../controllers/galleryController.js';
import { requireAdmin } from '../../../core/middleware/auth.js';
import { csrfProtection } from '../../../core/middleware/csrf.js';
import { validate } from '../../../core/middleware/validate.js';
import { galleryItemSchema } from '../validation/gallerySchemas.js';

export const galleryRouter = Router();

// Public read endpoints
galleryRouter.get('/', listGalleryItems);
galleryRouter.get('/:id', getGalleryItem);

// Protected write endpoints
galleryRouter.post('/', requireAdmin, csrfProtection, validate(galleryItemSchema), createGalleryItem);
galleryRouter.patch('/:id', requireAdmin, csrfProtection, validate(galleryItemSchema.partial()), updateGalleryItem);
galleryRouter.delete('/:id', requireAdmin, csrfProtection, deleteGalleryItem);
