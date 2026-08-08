import { packageRepository } from '../repositories/packageRepository.js';
import type { Package, PackageCreateRequest, PackageUpdateRequest } from '../types/package.types.js';

export const packageService = {
  list: async () => {
    return packageRepository.list();
  },

  get: async (id: string) => {
    return packageRepository.get(id);
  },

  create: async (data: PackageCreateRequest) => {
    return packageRepository.create(data);
  },

  update: async (id: string, data: PackageUpdateRequest) => {
    return packageRepository.update(id, data);
  },

  delete: async (id: string) => {
    return packageRepository.delete(id);
  },

  getFeatured: async () => {
    const allPackages = await packageRepository.list();
    return allPackages.filter(pkg => pkg.featured);
  },

  getByCategory: async (category: string) => {
    const allPackages = await packageRepository.list();
    return allPackages.filter(pkg => pkg.category === category);
  },
};
