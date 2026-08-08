import { api } from '../../../../lib/api/client';
import type { ApiListResponse, ApiResponse } from '../../../../types/api.types';
import type { Hotel, HotelFormData } from '../types/hotel.types';

export const hotelService = {
  list: async () => {
    const response = await api.get<ApiListResponse<Hotel>>('/api/hotels');
    return response.data;
  },

  get: async (id: string) => {
    const response = await api.get<ApiResponse<Hotel>>(`/api/hotels/${id}`);
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await api.get<ApiResponse<Hotel>>(`/api/hotels/slug/${slug}`);
    return response.data;
  },

  getByRegion: async (region: string) => {
    const response = await api.get<ApiListResponse<Hotel>>(`/api/hotels/region/${region}`);
    return response.data;
  },

  getFeatured: async () => {
    const response = await api.get<ApiListResponse<Hotel>>('/api/hotels/featured');
    return response.data;
  },

  create: async (data: HotelFormData) => {
    const response = await api.post<ApiResponse<Hotel>>('/api/hotels', data);
    return response.data;
  },

  update: async (id: string, data: Partial<HotelFormData>) => {
    const response = await api.patch<ApiResponse<Hotel>>(`/api/hotels/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/api/hotels/${id}`);
  },
};
