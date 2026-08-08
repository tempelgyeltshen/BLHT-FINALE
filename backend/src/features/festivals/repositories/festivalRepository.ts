import { MongoRepository } from '../../../shared/repositories/MongoRepository.js';
import type { Festival } from '../types/festival.types.js';

export const festivalRepository = new MongoRepository<Festival>('festivals');
