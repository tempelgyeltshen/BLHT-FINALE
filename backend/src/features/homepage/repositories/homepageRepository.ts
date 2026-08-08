import { MongoRepository } from '../../../shared/repositories/MongoRepository.js';
import type { HomepageConfig } from '../types/homepage.types.js';

export const homepageRepository = new MongoRepository<HomepageConfig>('homepage');
