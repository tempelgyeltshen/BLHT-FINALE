import { Router } from 'express';
import {
  listPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage
} from '../controllers/packageController.js';
import { requireAdmin } from '../../../core/middleware/auth.js';
import { csrfProtection } from '../../../core/middleware/csrf.js';
import { validate } from '../../../core/middleware/validate.js';
import { packageSchema } from '../validation/packageSchemas.js';

export const packageRouter = Router();

// Public read endpoints
packageRouter.get('/', listPackages);
packageRouter.get('/:id', getPackage);

// Protected write endpoints
packageRouter.post('/', requireAdmin, csrfProtection, validate(packageSchema), createPackage);
packageRouter.patch('/:id', requireAdmin, csrfProtection, validate(packageSchema.partial()), updatePackage);
packageRouter.delete('/:id', requireAdmin, csrfProtection, deletePackage);
