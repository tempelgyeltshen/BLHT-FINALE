import { festivalRepository } from '../repositories/festivalRepository.js';
import type { Festival, FestivalCreateRequest, FestivalUpdateRequest } from '../types/festival.types.js';

export const festivalService = {
  list: async () => {
    return festivalRepository.list();
  },

  get: async (id: string) => {
    return festivalRepository.get(id);
  },

  getBySlug: async (slug: string) => {
    const all = await festivalRepository.list();
    return all.find(f => f.slug === slug) ?? null;
  },

  getFeatured: async () => {
    const all = await festivalRepository.list();
    return all.filter(f => f.featured);
  },

  create: async (data: FestivalCreateRequest) => {
    return festivalRepository.create(data);
  },

  update: async (id: string, data: FestivalUpdateRequest) => {
    return festivalRepository.update(id, data);
  },

  delete: async (id: string) => {
    return festivalRepository.delete(id);
  },
};
