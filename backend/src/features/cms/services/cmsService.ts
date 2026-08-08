import { getCmsRepository } from '../repositories/cmsRepository.js';
import type { Entity } from '../../../shared/types/entity.js';

type Resource = Entity & { [key: string]: unknown };

export const cmsService = {
  list: async (resource: string) => {
    return getCmsRepository(resource).list();
  },

  get: async (resource: string, id: string) => {
    return getCmsRepository(resource).get(id);
  },

  create: async (resource: string, data: Resource) => {
    return getCmsRepository(resource).create(data);
  },

  update: async (resource: string, id: string, data: Resource) => {
    return getCmsRepository(resource).update(id, data);
  },

  delete: async (resource: string, id: string) => {
    return getCmsRepository(resource).delete(id);
  },
};
