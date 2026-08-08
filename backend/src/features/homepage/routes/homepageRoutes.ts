import { Router } from 'express';
import { getHomepageConfig, updateHomepageConfig } from '../controllers/homepageController.js';
import { requireAdmin } from '../../../core/middleware/auth.js';
import { csrfProtection } from '../../../core/middleware/csrf.js';
import { validate } from '../../../core/middleware/validate.js';
import { homepageConfigSchema } from '../validation/homepageSchemas.js';

export const homepageRouter = Router();

// Public read
homepageRouter.get('/', getHomepageConfig);

// Protected write
homepageRouter.patch('/', requireAdmin, csrfProtection, validate(homepageConfigSchema.partial()), updateHomepageConfig);
