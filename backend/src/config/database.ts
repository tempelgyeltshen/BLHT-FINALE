import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

export async function connectDatabase() {
  if (!env.mongodbUri) {
    logger.warn('MONGODB_URI not set - running without database persistence');
    return;
  }

  try {
    await mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 10_000,
      socketTimeoutMS: 45_000,
      maxPoolSize: 50,
      minPoolSize: 5,
      maxIdleTimeMS: 30_000,
      retryWrites: true,
      retryReads: true,
    });

    logger.info('MongoDB connected successfully');

    // Handle connection events
    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error', { error: error.message });
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
      console.error("========== MONGODB ERROR ==========");
      console.dir(error, { depth: null });
      console.error("===================================");

      logger.error("MongoDB connection failed", {
        error: error instanceof Error ? error.message : String(error),
      });

      if (env.nodeEnv !== "production") {
        logger.warn("Continuing without database connection in development mode");
        return;
      }

      process.exit(1);
    }
}