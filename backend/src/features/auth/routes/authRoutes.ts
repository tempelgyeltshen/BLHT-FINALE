import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { env } from '../../../core/config/env.js';
import { login, logout, me } from '../controllers/authController.js';
import { validate } from '../../../core/middleware/validate.js';
import { loginSchema } from '../validation/authSchemas.js';
import { generateCsrfTokenHandler } from '../../../core/middleware/csrf.js';

export const authRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  // Relax in test env so integration tests can log in repeatedly
  limit: env.nodeEnv === 'test' ? 1000 : 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Too many login attempts. Try again later.' } }
});

authRouter.post('/login', loginLimiter, validate(loginSchema), login);
authRouter.get('/me', me);
authRouter.post('/logout', logout);
authRouter.get('/csrf-token', generateCsrfTokenHandler);
