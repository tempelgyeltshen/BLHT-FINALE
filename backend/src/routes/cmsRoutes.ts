import { Router } from 'express';
import { z } from 'zod';
import { createResource, deleteResource, getResource, listResource, updateResource } from '../controllers/resourceController.js';
import { requireAdmin } from '../middleware/auth.js';
import { csrfProtection } from '../middleware/csrf.js';
import { validate } from '../middleware/validate.js';
import { 
  packageSchema, 
  hotelSchema, 
  festivalSchema, 
  brochureSchema, 
  galleryItemSchema, 
  videoItemSchema, 
  homepageConfigSchema 
} from '../validation/schemas.js';

export const cmsRouter = Router();

const allowed = ['packages','hotels','festivals','brochures','gallery','videos','homepage','settings','categories','feedback'];

// Resource-specific validation schemas
const resourceSchemas: Record<string, any> = {
  packages: packageSchema,
  hotels: hotelSchema,
  festivals: festivalSchema,
  brochures: brochureSchema,
  gallery: galleryItemSchema,
  videos: videoItemSchema,
  homepage: homepageConfigSchema
};

cmsRouter.param('resource', (req, res, next, resource) => {
  if (allowed.includes(resource)) {
    next();
  } else {
    res.status(404).json({ error: { message: 'Unknown resource.' } });
  }
});

// Public read endpoints (no CSRF protection)
cmsRouter.get('/:resource', listResource);
cmsRouter.get('/:resource/:id', getResource);

// Protected write endpoints (with CSRF protection)
cmsRouter.post('/:resource', requireAdmin, csrfProtection, (req, res, next) => {
  const schema = resourceSchemas[req.params.resource];
  if (schema) {
    return validate(schema)(req, res, next);
  }
  // For resources without specific schemas, use basic validation
  return validate(z.object({}).passthrough())(req, res, next);
}, createResource);

cmsRouter.patch('/:resource/:id', requireAdmin, csrfProtection, (req, res, next) => {
  const schema = resourceSchemas[req.params.resource];
  if (schema) {
    return validate(schema.partial())(req, res, next);
  }
  // For resources without specific schemas, use basic validation
  return validate(z.object({}).passthrough().partial())(req, res, next);
}, updateResource);

cmsRouter.delete('/:resource/:id', requireAdmin, csrfProtection, deleteResource);
