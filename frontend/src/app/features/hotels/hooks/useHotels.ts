import { useState, useEffect } from 'react';
import { hotelService } from '../services/hotelService';
import type { Hotel, HotelFormData } from '../types/hotel.types';

export function useHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await hotelService.list();
      setHotels(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hotels');
      console.error('Error fetching hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHotelById = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await hotelService.get(id);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hotel');
      console.error('Error fetching hotel:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchHotelBySlug = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await hotelService.getBySlug(slug);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hotel');
      console.error('Error fetching hotel by slug:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchHotelsByRegion = async (region: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await hotelService.getByRegion(region);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hotels by region');
      console.error('Error fetching hotels by region:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedHotels = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await hotelService.getFeatured();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch featured hotels');
      console.error('Error fetching featured hotels:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createHotel = async (data: HotelFormData) => {
    try {
      setError(null);
      const newHotel = await hotelService.create(data);
      setHotels(prev => [newHotel, ...prev]);
      return newHotel;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create hotel');
      console.error('Error creating hotel:', err);
      throw err;
    }
  };

  const updateHotel = async (id: string, data: Partial<HotelFormData>) => {
    try {
      setError(null);
      const updatedHotel = await hotelService.update(id, data);
      setHotels(prev => prev.map(h => h.id === id ? updatedHotel : h));
      return updatedHotel;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update hotel');
      console.error('Error updating hotel:', err);
      throw err;
    }
  };

  const deleteHotel = async (id: string) => {
    try {
      setError(null);
      await hotelService.delete(id);
      setHotels(prev => prev.filter(h => h.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete hotel');
      console.error('Error deleting hotel:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  return {
    hotels,
    loading,
    error,
    fetchHotels,
    fetchHotelById,
    fetchHotelBySlug,
    fetchHotelsByRegion,
    fetchFeaturedHotels,
    createHotel,
    updateHotel,
    deleteHotel,
  };
}
