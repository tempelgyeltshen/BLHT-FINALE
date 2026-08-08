import { MongoRepository } from '../../../shared/repositories/MongoRepository.js';
import type { Hotel } from '../types/hotel.types.js';

export const hotelRepository = new MongoRepository<Hotel>('hotels');
