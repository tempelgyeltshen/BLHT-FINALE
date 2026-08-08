import { hotelRepository } from '../repositories/hotelRepository.js';
import type { Hotel, HotelCreateRequest, HotelUpdateRequest } from '../types/hotel.types.js';

export const hotelService = {
  list: async () => {
    return hotelRepository.list();
  },

  get: async (id: string) => {
    return hotelRepository.get(id);
  },

  getBySlug: async (slug: string) => {
    const allHotels = await hotelRepository.list();
    return allHotels.find(h => h.slug === slug) ?? null;
  },

  getByRegion: async (region: string) => {
    const allHotels = await hotelRepository.list();
    return allHotels.filter(h => h.region.toLowerCase() === region.toLowerCase());
  },

  getFeatured: async () => {
    const allHotels = await hotelRepository.list();
    return allHotels.filter(h => h.featured);
  },

  create: async (data: HotelCreateRequest) => {
    // Convert HotelCreateRequest to proper format for repository
    const createData: Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'> = {
      slug: data.slug || '',
      name: data.name,
      brand: data.brand,
      location: data.location,
      region: data.region,
      starRating: data.starRating,
      pricePerNightUSD: data.pricePerNightUSD,
      heroImage: data.heroImage,
      images: data.images || [],
      tagline: data.tagline,
      description: data.description,
      amenities: data.amenities,
      featured: data.featured,
    };
    return hotelRepository.create(createData);
  },

  update: async (id: string, data: HotelUpdateRequest) => {
    return hotelRepository.update(id, data);
  },

  delete: async (id: string) => {
    return hotelRepository.delete(id);
  },
};
