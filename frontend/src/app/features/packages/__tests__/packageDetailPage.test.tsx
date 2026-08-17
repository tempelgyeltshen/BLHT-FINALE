import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PackageDetailPage } from '../components/PackageDetailPage';
import type { TourPackage } from '../../../../types';

// ---------------------------------------------------------------------------
// Mock the hooks the page consumes so each test controls resolution directly.
// ---------------------------------------------------------------------------
const { mockUsePackages, mockUseApp } = vi.hoisted(() => ({
  mockUsePackages: vi.fn(),
  mockUseApp: vi.fn(),
}));

vi.mock('../hooks/usePackages', () => ({
  usePackages: () => mockUsePackages(),
}));

vi.mock('../../../core/providers/AppProvider', () => ({
  useApp: () => mockUseApp(),
}));

// jsdom lacks the browser observers used by motion's whileInView/useScroll.
class MockObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

beforeAll(() => {
  vi.stubGlobal('IntersectionObserver', MockObserver);
  vi.stubGlobal('ResizeObserver', MockObserver);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

// Realistic journey fixture (matches the seeded Kingdom in the Clouds).
const kingdomInTheClouds: TourPackage = {
  id: 'pkg-1',
  slug: 'kingdom-in-the-clouds-luxury',
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
      accommodation: 'Six Senses Thimphu',
      meals: 'Dinner included',
    },
  ],
};

function renderDetail(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/packages/:id" element={<PackageDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  window.scrollTo = vi.fn();
  mockUsePackages.mockReturnValue({
    packages: [],
    loading: false,
    getPackage: vi.fn().mockResolvedValue(null),
    fetchPackages: vi.fn(),
    fetchFeaturedPackages: vi.fn(),
    fetchPackagesByCategory: vi.fn(),
    createPackage: vi.fn(),
    updatePackage: vi.fn(),
    deletePackage: vi.fn(),
  });
  mockUseApp.mockReturnValue({
    packages: [kingdomInTheClouds],
    setActivePackage: vi.fn(),
    navigate: vi.fn(),
  });
});

describe('PackageDetailPage resolution', () => {
  it('resolves the journey from the loaded list by id without hitting the API', async () => {
    const getPackage = vi.fn().mockResolvedValue(null);
    mockUsePackages.mockReturnValue({
      packages: [],
      loading: false,
      getPackage,
      fetchPackages: vi.fn(),
      fetchFeaturedPackages: vi.fn(),
      fetchPackagesByCategory: vi.fn(),
      createPackage: vi.fn(),
      updatePackage: vi.fn(),
      deletePackage: vi.fn(),
    });

    renderDetail('/packages/pkg-1');

    expect(await screen.findByRole('heading', { name: kingdomInTheClouds.title })).toBeInTheDocument();
    expect(getPackage).not.toHaveBeenCalled();
  });

  it('resolves the journey from the loaded list by slug without hitting the API', async () => {
    const getPackage = vi.fn().mockResolvedValue(null);
    mockUsePackages.mockReturnValue({
      packages: [],
      loading: false,
      getPackage,
      fetchPackages: vi.fn(),
      fetchFeaturedPackages: vi.fn(),
      fetchPackagesByCategory: vi.fn(),
      createPackage: vi.fn(),
      updatePackage: vi.fn(),
      deletePackage: vi.fn(),
    });

    renderDetail('/packages/kingdom-in-the-clouds-luxury');

    expect(await screen.findByRole('heading', { name: kingdomInTheClouds.title })).toBeInTheDocument();
    expect(getPackage).not.toHaveBeenCalled();
  });

  it('falls back to the API for deep links not in the list, fetching exactly once', async () => {
    const getPackage = vi.fn().mockResolvedValue(kingdomInTheClouds);
    mockUsePackages.mockReturnValue({
      packages: [],
      loading: false,
      getPackage,
      fetchPackages: vi.fn(),
      fetchFeaturedPackages: vi.fn(),
      fetchPackagesByCategory: vi.fn(),
      createPackage: vi.fn(),
      updatePackage: vi.fn(),
      deletePackage: vi.fn(),
    });
    mockUseApp.mockReturnValue({
      packages: [],
      setActivePackage: vi.fn(),
      navigate: vi.fn(),
    });

    renderDetail('/packages/pkg-1');

    expect(await screen.findByRole('heading', { name: kingdomInTheClouds.title })).toBeInTheDocument();
    // Guard against a reload-loop regression: the API must be consulted once,
    // never re-fetched after the result settles.
    await waitFor(() => expect(getPackage).toHaveBeenCalledTimes(1));
  });

  it('shows the Journey Not Found fallback and Back to All Journeys navigates to luxury', async () => {
    const navigate = vi.fn();
    mockUsePackages.mockReturnValue({
      packages: [],
      loading: false,
      getPackage: vi.fn().mockRejectedValue(new Error('not found')),
      fetchPackages: vi.fn(),
      fetchFeaturedPackages: vi.fn(),
      fetchPackagesByCategory: vi.fn(),
      createPackage: vi.fn(),
      updatePackage: vi.fn(),
      deletePackage: vi.fn(),
    });
    mockUseApp.mockReturnValue({
      packages: [],
      setActivePackage: vi.fn(),
      navigate,
    });

    renderDetail('/packages/unknown-id');

    expect(await screen.findByText('Journey Not Found')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /back to all journeys/i }));
    expect(navigate).toHaveBeenCalledWith('luxury');
  });

  it('does not re-fetch when the journey is already in the loaded list (no reload loop)', async () => {
    const getPackage = vi.fn().mockResolvedValue(null);
    mockUsePackages.mockReturnValue({
      packages: [],
      loading: false,
      getPackage,
      fetchPackages: vi.fn(),
      fetchFeaturedPackages: vi.fn(),
      fetchPackagesByCategory: vi.fn(),
      createPackage: vi.fn(),
      updatePackage: vi.fn(),
      deletePackage: vi.fn(),
    });

    renderDetail('/packages/pkg-1');

    await screen.findByRole('heading', { name: kingdomInTheClouds.title });
    // Let any stray effects settle; the API must stay untouched.
    await waitFor(() => expect(getPackage).not.toHaveBeenCalled());
  });
});
