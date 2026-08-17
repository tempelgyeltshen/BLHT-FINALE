import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useHotels } from '../useHotels';
import type { Hotel } from '../../types/hotel.types';

// ---------------------------------------------------------------------------
// Mock the hotel service so the hook never hits the network.
// ---------------------------------------------------------------------------
const { mockHotelService } = vi.hoisted(() => ({
  mockHotelService: {
    list: vi.fn(),
    get: vi.fn(),
    getBySlug: vi.fn(),
    getByRegion: vi.fn(),
    getFeatured: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../../services/hotelService', () => ({
  hotelService: mockHotelService,
}));

const paroHotel: Hotel = {
  id: 'hotel-1',
  slug: 'paro-pine-sanctuary',
  name: 'BLHT Paro Pine Sanctuary',
  brand: 'BLHT Sanctuary',
  location: 'Balakha Village, Paro',
  region: 'Paro',
  starRating: 5,
  pricePerNightUSD: 2200,
  heroImage: 'https://example.com/hero.jpg',
  images: ['https://example.com/hero.jpg'],
  tagline: 'A sanctuary tucked inside a blue pine forest.',
  description: 'A serene lodge beneath the ruined Drukyel Dzong.',
  amenities: ['Spa & Steam Room', 'Private Yoga Pavilion'],
  featured: true,
};

beforeEach(() => {
  mockHotelService.list.mockReset().mockResolvedValue([paroHotel]);
  mockHotelService.get.mockReset().mockResolvedValue(paroHotel);
  mockHotelService.getBySlug.mockReset().mockResolvedValue(paroHotel);
  mockHotelService.getByRegion.mockReset().mockResolvedValue([paroHotel]);
  mockHotelService.getFeatured.mockReset().mockResolvedValue([paroHotel]);
  mockHotelService.create.mockReset().mockResolvedValue(paroHotel);
  mockHotelService.update.mockReset().mockResolvedValue(paroHotel);
  mockHotelService.delete.mockReset().mockResolvedValue(undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useHotels', () => {
  it('fetches the lodge list once on mount', async () => {
    const { result } = renderHook(() => useHotels());

    await waitFor(() => expect(result.current.hotels).toEqual([paroHotel]));
    expect(mockHotelService.list).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toBe(false);
  });

  it('exposes referentially stable functions across re-renders (no effect re-trigger)', async () => {
    const { result, rerender } = renderHook(() => useHotels());

    await waitFor(() => expect(result.current.hotels).toEqual([paroHotel]));

    const firstFetch = result.current.fetchHotels;
    const firstById = result.current.fetchHotelById;
    const firstBySlug = result.current.fetchHotelBySlug;
    const firstByRegion = result.current.fetchHotelsByRegion;
    const firstFeatured = result.current.fetchFeaturedHotels;

    // Re-render (what happens on every AppProvider render) — the function
    // identities must not change, otherwise effects depending on them re-run
    // and the detail page falls into an infinite fetch loop.
    rerender();

    expect(result.current.fetchHotels).toBe(firstFetch);
    expect(result.current.fetchHotelById).toBe(firstById);
    expect(result.current.fetchHotelBySlug).toBe(firstBySlug);
    expect(result.current.fetchHotelsByRegion).toBe(firstByRegion);
    expect(result.current.fetchFeaturedHotels).toBe(firstFeatured);
  });

  it('fetchHotelById returns the lodge on success and null on failure', async () => {
    const { result } = renderHook(() => useHotels());
    await waitFor(() => expect(result.current.hotels).toEqual([paroHotel]));

    await act(async () => {
      const hotel = await result.current.fetchHotelById('hotel-1');
      expect(hotel).toEqual(paroHotel);
    });

    mockHotelService.get.mockRejectedValueOnce(new Error('boom'));
    await act(async () => {
      const hotel = await result.current.fetchHotelById('missing');
      expect(hotel).toBeNull();
    });
    expect(result.current.error).toBe('boom');
  });

  it('fetchHotelBySlug returns the lodge on success and null on failure', async () => {
    const { result } = renderHook(() => useHotels());
    await waitFor(() => expect(result.current.hotels).toEqual([paroHotel]));

    await act(async () => {
      const hotel = await result.current.fetchHotelBySlug('paro-pine-sanctuary');
      expect(hotel).toEqual(paroHotel);
    });

    mockHotelService.getBySlug.mockRejectedValueOnce(new Error('nope'));
    await act(async () => {
      const hotel = await result.current.fetchHotelBySlug('unknown');
      expect(hotel).toBeNull();
    });
    expect(result.current.error).toBe('nope');
  });

  it('createHotel prepends the new lodge to the list', async () => {
    const { result } = renderHook(() => useHotels());
    await waitFor(() => expect(result.current.hotels).toEqual([paroHotel]));

    const newHotel: Hotel = {
      ...paroHotel,
      id: 'hotel-2',
      slug: 'amankora-paro',
      name: 'Amankora Paro',
    };
    mockHotelService.create.mockResolvedValueOnce(newHotel);

    await act(async () => {
      const created = await result.current.createHotel({
        name: newHotel.name,
        brand: 'Aman',
        location: 'Paro',
        region: 'Paro',
        starRating: 5,
        pricePerNightUSD: 3000,
        heroImage: 'https://example.com/aman.jpg',
        tagline: 'Serene',
        description: 'A peaceful retreat.',
        amenities: ['Spa'],
        featured: false,
      });
      expect(created).toEqual(newHotel);
    });

    expect(result.current.hotels[0]).toEqual(newHotel);
  });
});
