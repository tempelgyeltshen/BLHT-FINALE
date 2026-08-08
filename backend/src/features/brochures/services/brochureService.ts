import { brochureRepository } from '../repositories/brochureRepository.js';
import type { Brochure, BrochureCreateRequest, BrochureUpdateRequest } from '../types/brochure.types.js';

export const brochureService = {
  list: async () => {
    return brochureRepository.list();
  },

  get: async (id: string) => {
    return brochureRepository.get(id);
  },

  getFeatured: async () => {
    const all = await brochureRepository.list();
    return all.filter(b => b.featured);
  },

  create: async (data: BrochureCreateRequest) => {
    return brochureRepository.create(data);
  },

  update: async (id: string, data: BrochureUpdateRequest) => {
    return brochureRepository.update(id, data);
  },

  delete: async (id: string) => {
    return brochureRepository.delete(id);
  },
};
