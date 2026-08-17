import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { HotelDetailPage } from '../components/HotelDetailPage';
import type { Hotel } from '../types/hotel.types';

// ---------------------------------------------------------------------------
// Mock the hooks the page consumes so each test controls resolution directly.
// ---------------------------------------------------------------------------
const { mockUseHotels, mockUseApp } = vi.hoisted(() => ({
  mockUseHotels: vi.fn(),
  mockUseApp: vi.fn(),
}));

vi.mock('../hooks/useHotels', () => ({
  useHotels: () => mockUseHotels(),
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

// Realistic lodge fixture (matches the seeded Paro Pine Sanctuary).
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

function renderDetail(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/hotels/:slug" element={<HotelDetailPage />} />
        <Route path="/hotels/id/:id" element={<HotelDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  window.scrollTo = vi.fn();
  mockUseHotels.mockReturnValue({
    hotels: [paroHotel],
    loading: false,
    fetchHotels: vi.fn(),
    fetchHotelById: vi.fn().mockResolvedValue(null),
    fetchHotelBySlug: vi.fn().mockResolvedValue(null),
  });
  mockUseApp.mockReturnValue({
    setActiveHotel: vi.fn(),
    packages: [],
    setActivePackage: vi.fn(),
    navigate: vi.fn(),
  });
});

describe('HotelDetailPage resolution', () => {
  it('resolves the lodge from the loaded list by slug without hitting the API', async () => {
    const fetchHotelBySlug = vi.fn().mockResolvedValue(null);
    const fetchHotelById = vi.fn().mockResolvedValue(null);
    mockUseHotels.mockReturnValue({
      hotels: [paroHotel],
      loading: false,
      fetchHotels: vi.fn(),
      fetchHotelBySlug,
      fetchHotelById,
    });

    renderDetail('/hotels/paro-pine-sanctuary');

    expect(await screen.findByRole('heading', { name: paroHotel.name })).toBeInTheDocument();
    expect(fetchHotelBySlug).not.toHaveBeenCalled();
    expect(fetchHotelById).not.toHaveBeenCalled();
  });

  it('resolves the lodge from the loaded list by id without hitting the API', async () => {
    const fetchHotelBySlug = vi.fn().mockResolvedValue(null);
    const fetchHotelById = vi.fn().mockResolvedValue(null);
    mockUseHotels.mockReturnValue({
      hotels: [paroHotel],
      loading: false,
      fetchHotels: vi.fn(),
      fetchHotelBySlug,
      fetchHotelById,
    });

    renderDetail('/hotels/id/hotel-1');

    expect(await screen.findByRole('heading', { name: paroHotel.name })).toBeInTheDocument();
    expect(fetchHotelBySlug).not.toHaveBeenCalled();
    expect(fetchHotelById).not.toHaveBeenCalled();
  });

  it('falls back to the API by slug for deep links not in the list, fetching exactly once', async () => {
    const fetchHotelBySlug = vi.fn().mockResolvedValue(paroHotel);
    const fetchHotelById = vi.fn().mockResolvedValue(null);
    mockUseHotels.mockReturnValue({
      hotels: [],
      loading: false,
      fetchHotels: vi.fn(),
      fetchHotelBySlug,
      fetchHotelById,
    });

    renderDetail('/hotels/paro-pine-sanctuary');

    expect(await screen.findByRole('heading', { name: paroHotel.name })).toBeInTheDocument();
    // Guard against the reload-loop regression: the API must be consulted once,
    // never re-fetched after the result settles.
    await waitFor(() => expect(fetchHotelBySlug).toHaveBeenCalledTimes(1));
    expect(fetchHotelById).not.toHaveBeenCalled();
  });

  it('falls back to the API by id for 24-char hex deep links, fetching exactly once', async () => {
    const hexId = '507f1f77bcf86cd799439011';
    const fetchHotelBySlug = vi.fn().mockResolvedValue(null);
    const fetchHotelById = vi.fn().mockResolvedValue(paroHotel);
    mockUseHotels.mockReturnValue({
      hotels: [],
      loading: false,
      fetchHotels: vi.fn(),
      fetchHotelBySlug,
      fetchHotelById,
    });

    renderDetail(`/hotels/id/${hexId}`);

    expect(await screen.findByRole('heading', { name: paroHotel.name })).toBeInTheDocument();
    await waitFor(() => expect(fetchHotelById).toHaveBeenCalledTimes(1));
    expect(fetchHotelBySlug).not.toHaveBeenCalled();
  });

  it('shows the No Lodge fallback and View All Lodges navigates back to the list', async () => {
    const navigate = vi.fn();
    mockUseHotels.mockReturnValue({
      hotels: [],
      loading: false,
      fetchHotels: vi.fn(),
      fetchHotelBySlug: vi.fn().mockResolvedValue(null),
      fetchHotelById: vi.fn().mockResolvedValue(null),
    });
    mockUseApp.mockReturnValue({
      setActiveHotel: vi.fn(),
      packages: [],
      setActivePackage: vi.fn(),
      navigate,
    });

    renderDetail('/hotels/unknown-slug');

    expect(await screen.findByText('No Lodge Selected')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /view all lodges/i }));
    expect(navigate).toHaveBeenCalledWith('hotels');
  });

  it('does not re-fetch when the lodge is already in the loaded list (no reload loop)', async () => {
    const fetchHotelBySlug = vi.fn().mockResolvedValue(null);
    const fetchHotelById = vi.fn().mockResolvedValue(null);
    mockUseHotels.mockReturnValue({
      hotels: [paroHotel],
      loading: false,
      fetchHotels: vi.fn(),
      fetchHotelBySlug,
      fetchHotelById,
    });

    renderDetail('/hotels/paro-pine-sanctuary');

    await screen.findByRole('heading', { name: paroHotel.name });
    // Let any stray effects settle; the API must stay untouched.
    await waitFor(() => expect(fetchHotelBySlug).not.toHaveBeenCalled());
    await waitFor(() => expect(fetchHotelById).not.toHaveBeenCalled());
  });
});
