import { app } from './app.js';
import { env } from '../core/config/env.js';
import { connectDatabase } from '../core/config/database.js';
import { logger } from '../core/config/logger.js';
import { seedDatabase } from '../core/utils/seed.js';

function validateConfiguration() {
  const requiredEnvVars = [
    { name: 'JWT_ACCESS_SECRET', value: env.jwtAccessSecret },
  ];

  // Only require MongoDB URI in production
  if (env.nodeEnv === 'production') {
    requiredEnvVars.push({ name: 'MONGODB_URI', value: env.mongodbUri });
  }

  // Only require admin credentials in production
  if (env.nodeEnv === 'production') {
    requiredEnvVars.push(
      { name: 'ADMIN_EMAIL', value: env.adminEmail },
      { name: 'ADMIN_PASSWORD_HASH', value: env.adminPasswordHash }
    );
  }

  const missing = requiredEnvVars.filter(({ value }) => !value || value === '');

  if (missing.length > 0) {
    logger.error('Startup failed: Missing required environment variables', {
      missing: missing.map(({ name }) => name)
    });
    logger.error('Please set these environment variables in backend/.env or docker-compose.env');
    process.exit(1);
  }

  // Validate JWT secrets are sufficiently long (at least 32 bytes for HS256)
  if (env.jwtAccessSecret.length < 32) {
    logger.error('Startup failed: JWT_ACCESS_SECRET must be at least 32 characters');
    process.exit(1);
  }

  logger.info('Configuration validation passed');
}

validateConfiguration();
await connectDatabase();
await seedDatabase();

const server = app.listen(env.port, "0.0.0.0", () => {
  logger.info(`Backend API listening on port ${env.port}`);
});

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    logger.error(`Backend startup failed: port ${env.port} is already in use. Set a different PORT in backend/.env.`);
  } else {
    logger.error('Backend startup failed', { error: error.message });
  }
  process.exitCode = 1;
});
