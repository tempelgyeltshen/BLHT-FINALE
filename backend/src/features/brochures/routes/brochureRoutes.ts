import { Router } from 'express';
import {
  listBrochures,
  getBrochure,
  createBrochure,
  updateBrochure,
  deleteBrochure
} from '../controllers/brochureController.js';
import { requireAdmin } from '../../../core/middleware/auth.js';
import { csrfProtection } from '../../../core/middleware/csrf.js';
import { validate } from '../../../core/middleware/validate.js';
import { brochureSchema } from '../validation/brochureSchemas.js';

export const brochureRouter = Router();

// Public read endpoints
brochureRouter.get('/', listBrochures);
brochureRouter.get('/:id', getBrochure);

// Protected write endpoints
brochureRouter.post('/', requireAdmin, csrfProtection, validate(brochureSchema), createBrochure);
brochureRouter.patch('/:id', requireAdmin, csrfProtection, validate(brochureSchema.partial()), updateBrochure);
brochureRouter.delete('/:id', requireAdmin, csrfProtection, deleteBrochure);
