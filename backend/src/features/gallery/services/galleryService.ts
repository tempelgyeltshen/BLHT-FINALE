import { galleryRepository } from '../repositories/galleryRepository.js';
import type { GalleryItem, GalleryItemCreateRequest, GalleryItemUpdateRequest } from '../types/gallery.types.js';

export const galleryService = {
  list: async () => {
    return galleryRepository.list();
  },

  get: async (id: string) => {
    return galleryRepository.get(id);
  },

  getByCategory: async (category: string) => {
    const all = await galleryRepository.list();
    return all.filter(g => g.category === category);
  },

  create: async (data: GalleryItemCreateRequest) => {
    return galleryRepository.create(data);
  },

  update: async (id: string, data: GalleryItemUpdateRequest) => {
    return galleryRepository.update(id, data);
  },

  delete: async (id: string) => {
    return galleryRepository.delete(id);
  },
};
