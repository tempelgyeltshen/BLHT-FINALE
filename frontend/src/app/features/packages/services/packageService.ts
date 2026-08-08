import { api } from '../../../../lib/api/client';
import type { ApiListResponse, ApiResponse } from '../../../../types/api.types';
import type { Package, PackageFormData } from '../types/package.types';

export const packageService = {
  async listPackages() {
    return api.get<ApiListResponse<Package>>('/api/cms/packages');
  },

  async getPackage(id: string) {
    return api.get<ApiResponse<Package>>(`/api/cms/packages/${id}`);
  },

  async getFeaturedPackages() {
    const response = await api.get<ApiListResponse<Package>>('/api/cms/packages');
    return {
      data: response.data.filter((pkg: Package) => pkg.featured)
    };
  },

  async getPackagesByCategory(category: string) {
    const response = await api.get<ApiListResponse<Package>>('/api/cms/packages');
    return {
      data: response.data.filter((pkg: Package) => pkg.category === category)
    };
  },

  async createPackage(data: PackageFormData) {
    return api.post<ApiResponse<Package>>('/api/cms/packages', data);
  },

  async updatePackage(id: string, data: Partial<PackageFormData>) {
    return api.patch<ApiResponse<Package>>(`/api/cms/packages/${id}`, data);
  },

  async deletePackage(id: string) {
    return api.delete(`/api/cms/packages/${id}`);
  },
};
