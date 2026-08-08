import { Router } from 'express';
import {
  listFestivals,
  getFestival,
  getFestivalBySlug,
  createFestival,
  updateFestival,
  deleteFestival
} from '../controllers/festivalController.js';
import { requireAdmin } from '../../../core/middleware/auth.js';
import { csrfProtection } from '../../../core/middleware/csrf.js';
import { validate } from '../../../core/middleware/validate.js';
import { festivalSchema } from '../validation/festivalSchemas.js';

export const festivalRouter = Router();

// Public read endpoints
festivalRouter.get('/', listFestivals);
festivalRouter.get('/featured', listFestivals);
festivalRouter.get('/slug/:slug', getFestivalBySlug);
festivalRouter.get('/:id', getFestival);

// Protected write endpoints
festivalRouter.post('/', requireAdmin, csrfProtection, validate(festivalSchema), createFestival);
festivalRouter.patch('/:id', requireAdmin, csrfProtection, validate(festivalSchema.partial()), updateFestival);
festivalRouter.delete('/:id', requireAdmin, csrfProtection, deleteFestival);
