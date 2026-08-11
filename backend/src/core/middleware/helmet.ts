import helmet from 'helmet';
import { env } from '../config/env.js';

export const helmetMiddleware = helmet({
  crossOriginResourcePolicy: {
    policy: 'cross-origin',
  },

  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      // Allow PDF embedding from frontend domain for brochure viewing
      frameSrc: ["'self'", env.frontendOrigin],
      upgradeInsecureRequests: [],
    },
  },
});
