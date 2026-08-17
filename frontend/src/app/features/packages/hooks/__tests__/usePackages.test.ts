import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { usePackages } from '../usePackages';
import type { Package } from '../../types/package.types';

// ---------------------------------------------------------------------------
// Mock the package service so the hook never hits the network.
// ---------------------------------------------------------------------------
const { mockPackageService } = vi.hoisted(() => ({
  mockPackageService: {
    listPackages: vi.fn(),
    getPackage: vi.fn(),
    getFeaturedPackages: vi.fn(),
    getPackagesByCategory: vi.fn(),
    createPackage: vi.fn(),
    updatePackage: vi.fn(),
    deletePackage: vi.fn(),
  },
}));

vi.mock('../../services/packageService', () => ({
  packageService: mockPackageService,
}));

const kingdomInTheClouds: Package = {
  id: 'pkg-1',
  title: 'Kingdom in the Clouds: Ultra-Luxury Journey',
  subtitle: '7 Days / 6 Nights across Paro, Thimphu, and Punakha in 5-Star Luxury Lodges',
  category: 'luxury',
  durationDays: 7,
  priceUSD: 8950,
  rating: 4.98,
  reviewsCount: 42,
  featured: true,
  heroImage: 'https://example.com/hero.jpg',
  galleryImages: ['https://example.com/hero.jpg'],
  description: 'Immerse yourself in the world’s most serene Kingdom.',
  highlights: ['Private VIP arrival clearance at Paro International Airport'],
  included: ['5-Star Ultra-Luxury Accommodations'],
  excluded: ['International flights'],
  destinations: ['Paro', 'Thimphu', 'Punakha'],
  hotelCategory: '5-Star Luxury',
  itinerary: [
    {
      day: 1,
      title: 'Arrival in Paro & Drive to Thimphu Valley',
      location: 'Thimphu',
      description: 'Land in Paro where your personal host greets you.',
      highlights: ['Private arrival reception'],
    },
  ],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

beforeEach(() => {
  mockPackageService.listPackages.mockReset().mockResolvedValue({ data: [kingdomInTheClouds] });
  mockPackageService.getPackage.mockReset().mockResolvedValue({ data: kingdomInTheClouds });
  mockPackageService.getFeaturedPackages.mockReset().mockResolvedValue({ data: [kingdomInTheClouds] });
  mockPackageService.getPackagesByCategory.mockReset().mockResolvedValue({ data: [kingdomInTheClouds] });
  mockPackageService.createPackage.mockReset().mockResolvedValue({ data: kingdomInTheClouds });
  mockPackageService.updatePackage.mockReset().mockResolvedValue({ data: kingdomInTheClouds });
  mockPackageService.deletePackage.mockReset().mockResolvedValue(undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('usePackages', () => {
  it('fetches the package list once on mount', async () => {
    const { result } = renderHook(() => usePackages());

    await waitFor(() => expect(result.current.packages).toEqual([kingdomInTheClouds]));
    expect(mockPackageService.listPackages).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toBe(false);
  });

  it('exposes referentially stable functions across re-renders (no effect re-trigger)', async () => {
    const { result, rerender } = renderHook(() => usePackages());

    await waitFor(() => expect(result.current.packages).toEqual([kingdomInTheClouds]));

    const firstFetch = result.current.fetchPackages;
    const firstGet = result.current.getPackage;
    const firstByCategory = result.current.fetchPackagesByCategory;
    const firstFeatured = result.current.fetchFeaturedPackages;

    // Re-render (what happens on every AppProvider render) — the function
    // identities must not change, otherwise effects depending on them re-run
    // and the detail page falls into an infinite fetch loop.
    rerender();

    expect(result.current.fetchPackages).toBe(firstFetch);
    expect(result.current.getPackage).toBe(firstGet);
    expect(result.current.fetchPackagesByCategory).toBe(firstByCategory);
    expect(result.current.fetchFeaturedPackages).toBe(firstFeatured);
  });

  it('getPackage returns the package on success and throws on failure', async () => {
    const { result } = renderHook(() => usePackages());
    await waitFor(() => expect(result.current.packages).toEqual([kingdomInTheClouds]));

    await act(async () => {
      const pkg = await result.current.getPackage('pkg-1');
      expect(pkg).toEqual(kingdomInTheClouds);
    });

    mockPackageService.getPackage.mockRejectedValueOnce(new Error('boom'));
    await act(async () => {
      await expect(result.current.getPackage('missing')).rejects.toThrow('boom');
    });
    expect(result.current.error).toBe('Failed to fetch package');
  });

  it('createPackage appends the new package to the list', async () => {
    const { result } = renderHook(() => usePackages());
    await waitFor(() => expect(result.current.packages).toEqual([kingdomInTheClouds]));

    const newPackage: Package = {
      ...kingdomInTheClouds,
      id: 'pkg-2',
      title: 'Sacred Tshechu Festivals & Spiritual Odyssey',
      category: 'festival',
    };
    mockPackageService.createPackage.mockResolvedValueOnce({ data: newPackage });

    await act(async () => {
      const created = await result.current.createPackage({
        title: newPackage.title,
        category: 'festival',
        durationDays: 10,
        priceUSD: 7400,
        featured: true,
        heroImage: 'https://example.com/tshechu.jpg',
        description: 'Experience Bhutan’s grandest spiritual festivals.',
      });
      expect(created).toEqual(newPackage);
    });

    expect(result.current.packages[result.current.packages.length - 1]).toEqual(newPackage);
  });
});
