import { MongoRepository } from '../../../shared/repositories/MongoRepository.js';
import type { Brochure } from '../types/brochure.types.js';

export const brochureRepository = new MongoRepository<Brochure>('brochures');
