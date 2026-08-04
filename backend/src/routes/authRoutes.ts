import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, logout, me, refresh } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../validation/schemas.js';

export const authRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Too many login attempts. Try again later.' } }
});

authRouter.post('/login', loginLimiter, validate(loginSchema), login);
authRouter.post('/refresh', refresh);
authRouter.get('/me', me);
authRouter.post('/logout', logout);
