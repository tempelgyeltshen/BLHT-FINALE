import { Router } from 'express';
import {
  listHotels,
  getHotel,
  getHotelBySlug,
  createHotel,
  updateHotel,
  deleteHotel
} from '../controllers/hotelController.js';
import { requireAdmin } from '../../../core/middleware/auth.js';
import { csrfProtection } from '../../../core/middleware/csrf.js';
import { hotelSchema } from '../validation/hotelSchemas.js';
import { validate } from '../../../core/middleware/validate.js';

export const hotelRouter = Router();

// Public read endpoints
hotelRouter.get('/', listHotels);
hotelRouter.get('/featured', listHotels); // Will be filtered by controller
hotelRouter.get('/region/:region', listHotels); // Will be filtered by controller
hotelRouter.get('/slug/:slug', getHotelBySlug);
hotelRouter.get('/:id', getHotel);

// Protected write endpoints
hotelRouter.post('/', requireAdmin, csrfProtection, validate(hotelSchema), createHotel);
hotelRouter.patch('/:id', requireAdmin, csrfProtection, validate(hotelSchema.partial()), updateHotel);
hotelRouter.delete('/:id', requireAdmin, csrfProtection, deleteHotel);
