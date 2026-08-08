import { MongoRepository } from '../../../shared/repositories/MongoRepository.js';
import type { GalleryItem } from '../types/gallery.types.js';

export const galleryRepository = new MongoRepository<GalleryItem>('gallery');
