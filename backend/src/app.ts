import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';

import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { csrfProtection, csrfToken } from './middleware/csrf.js';

import { helmetMiddleware } from './middleware/helmet.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { hppMiddleware } from './middleware/hpp.js';
import { xssMiddleware } from './middleware/xss.js';
import { mongoSanitizeMiddleware } from './middleware/mongoSanitize.js';

import { inquiryRouter } from './routes/inquiryRoutes.js';
import { authRouter } from './routes/authRoutes.js';
import { cmsRouter } from './routes/cmsRoutes.js';
import { uploadRouter } from './routes/uploadRoutes.js';
import { publicRouter } from './routes/publicRoutes.js';
import { requireAdmin } from './middleware/auth.js';

export const app = express();

app.set(
 'trust proxy',
 1
);
/* =========================================================
   Security Middleware
========================================================= */

app.use(helmetMiddleware);

app.use(
  cors({
    origin: env.frontendOrigin,
    credentials: true,
  })
);

app.use(compression());

app.use(cookieParser());

app.use(apiLimiter);

/* =========================================================
   Body Parser
========================================================= */

app.use(
  express.json({
    limit: '20mb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '20mb',
  })
);

/* =========================================================
   Security Sanitization
========================================================= */

app.use(mongoSanitizeMiddleware);

app.use(xssMiddleware);

app.use(hppMiddleware);

/* =========================================================
   CSRF
========================================================= */

app.use(csrfToken);

/* =========================================================
   Health Endpoints
========================================================= */

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.nodeEnv,
  });
});

app.get('/api/ready', (_req, res) => {
  res.json({
    status: 'ready',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/metrics',requireAdmin,(_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    platform: process.platform,
    nodeVersion: process.version,
  });
});

app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({
    csrfToken: req.csrfToken?.(),
  });
});

/* =========================================================
   API Routes
========================================================= */

app.use('/api', inquiryRouter);

app.use('/api/auth', authRouter);

app.use('/api/cms', cmsRouter);

app.use('/api/uploads', uploadRouter);

app.use('/api', publicRouter);

/* =========================================================
   404 Handler
========================================================= */

app.use('*', (_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

/* =========================================================
   Global Error Handler
========================================================= */

app.use(errorHandler);