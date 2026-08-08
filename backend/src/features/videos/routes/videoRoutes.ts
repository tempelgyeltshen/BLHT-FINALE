import { Router } from 'express';
import {
  listVideos,
  getVideo,
  createVideo,
  updateVideo,
  deleteVideo
} from '../controllers/videoController.js';
import { requireAdmin } from '../../../core/middleware/auth.js';
import { csrfProtection } from '../../../core/middleware/csrf.js';
import { validate } from '../../../core/middleware/validate.js';
import { videoItemSchema } from '../validation/videoSchemas.js';

export const videoRouter = Router();

// Public read endpoints
videoRouter.get('/', listVideos);
videoRouter.get('/:id', getVideo);

// Protected write endpoints
videoRouter.post('/', requireAdmin, csrfProtection, validate(videoItemSchema), createVideo);
videoRouter.patch('/:id', requireAdmin, csrfProtection, validate(videoItemSchema.partial()), updateVideo);
videoRouter.delete('/:id', requireAdmin, csrfProtection, deleteVideo);
