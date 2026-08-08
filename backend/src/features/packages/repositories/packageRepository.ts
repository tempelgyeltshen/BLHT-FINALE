import { MongoRepository } from '../../../shared/repositories/MongoRepository.js';
import type { Package } from '../types/package.types.js';

export const packageRepository = new MongoRepository<Package>('packages');
