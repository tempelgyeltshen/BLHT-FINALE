import compression from 'compression';
import express from 'express';

import { env } from '../core/config/env.js';
import { corsMiddleware } from '../core/middleware/cors.js';
import { errorHandler } from '../core/middleware/errorHandler.js';
import { helmetMiddleware } from '../core/middleware/helmet.js';
import { apiLimiter } from '../core/middleware/rateLimit.js';
import { mongoSanitizeMiddleware } from '../core/middleware/mongoSanitize.js';
import { requireAdmin } from '../core/middleware/auth.js';

import { authRouter } from '../features/auth/routes/authRoutes.js';
import { cmsRouter } from '../features/cms/routes/cmsRoutes.js';
import { packageRouter } from '../features/packages/routes/packageRoutes.js';
import { hotelRouter } from '../features/hotels/routes/hotelRoutes.js';
import { festivalRouter } from '../features/festivals/routes/festivalRoutes.js';
import { brochureRouter } from '../features/brochures/routes/brochureRoutes.js';
import { galleryRouter } from '../features/gallery/routes/galleryRoutes.js';
import { videoRouter } from '../features/videos/routes/videoRoutes.js';
import { homepageRouter } from '../features/homepage/routes/homepageRoutes.js';
import { inquiryRouter } from '../features/inquiries/routes/inquiryRoutes.js';
import { uploadRouter } from '../features/uploads/routes/uploadRoutes.js';
import { cloudinaryRouter } from '../features/cloudinary/routes/cloudinaryRoutes.js';
import { searchRouter } from '../features/search/routes/searchRoutes.js';
import { publicRouter } from '../features/public/routes/publicRoutes.js';

export const app = express();

app.set('trust proxy', 1);

/* =========================================================
   Security Middleware
========================================================= */

app.use(helmetMiddleware);

app.use(corsMiddleware);

app.use(compression());

app.use(apiLimiter);

/* =========================================================
   Body Parser
========================================================= */

app.use(express.json({ limit: '20mb' }));

app.use(express.urlencoded({ extended: true, limit: '20mb' }));

/* =========================================================
   Security Sanitization
========================================================= */

app.use(mongoSanitizeMiddleware);

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

app.get('/api/metrics', requireAdmin, (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    platform: process.platform,
    nodeVersion: process.version,
  });
});

/* =========================================================
   API Routes
========================================================= */

app.use('/api', inquiryRouter);

app.use('/api/auth', authRouter);

app.use('/api/cms', cmsRouter);

app.use('/api/packages', packageRouter);

app.use('/api/hotels', hotelRouter);

app.use('/api/festivals', festivalRouter);

app.use('/api/brochures', brochureRouter);

app.use('/api/gallery', galleryRouter);

app.use('/api/videos', videoRouter);

app.use('/api/homepage', homepageRouter);

app.use('/api/uploads', uploadRouter);

app.use('/api/cloudinary', cloudinaryRouter);

app.use('/api/search', searchRouter);

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
