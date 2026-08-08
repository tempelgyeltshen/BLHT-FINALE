import { Router } from 'express';
import { dashboard } from '../controllers/publicController.js';
import { requireAdmin } from '../../../core/middleware/auth.js';

export const publicRouter = Router();

publicRouter.get('/dashboard', requireAdmin, dashboard);
