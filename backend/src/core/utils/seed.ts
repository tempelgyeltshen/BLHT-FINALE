import mongoose from 'mongoose';
import { ContentModel } from '../../shared/models/Content.js';
import { logger } from '../config/logger.js';
import {
  seedPackages, seedHotels, seedFestivals,
  seedBrochures, seedGallery, seedVideos,
  seedHomepageConfig
} from './seedData.js';

interface SeedCollection {
  name: string;
  data: Record<string, unknown>[];
}

const collections: SeedCollection[] = [
  { name: 'packages', data: seedPackages },
  { name: 'hotels', data: seedHotels },
  { name: 'festivals', data: seedFestivals },
  { name: 'brochures', data: seedBrochures },
  { name: 'gallery', data: seedGallery },
  { name: 'videos', data: seedVideos },
  { name: 'homepage', data: [seedHomepageConfig] }
];

/**
 * Seed the database with initial data.
 * Idempotent: only inserts if each collection is empty.
 */
export async function seedDatabase(): Promise<void> {
  // Skip seeding if no database connection
  if (mongoose.connection.readyState !== 1) {
    logger.info('No active database connection, skipping seed');
    return;
  }

  logger.info('Checking database seed status...');

  let totalSeeded = 0;

  for (const collection of collections) {
    try {
      const count = await ContentModel.countDocuments({ collection: collection.name });

      if (count === 0 && collection.data.length > 0) {
        const docs = collection.data.map(item => ({
          collection: collection.name,
          data: item
        }));

        await ContentModel.insertMany(docs, { ordered: false });
        totalSeeded += docs.length;
        logger.info(`Seeded ${docs.length} documents into '${collection.name}'`);
      } else if (count > 0) {
        logger.debug(`Collection '${collection.name}' already has ${count} documents, skipping`);
      }
    } catch (error) {
      logger.error(`Failed to seed collection '${collection.name}'`, {
        error: error instanceof Error ? error.message : String(error)
      });
      // Continue seeding other collections even if one fails
    }
  }

  if (totalSeeded > 0) {
    logger.info(`Database seeding complete: ${totalSeeded} total documents inserted`);
  } else {
    logger.info('Database already seeded, no action needed');
  }
}
