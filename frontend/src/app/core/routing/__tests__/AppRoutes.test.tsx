import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { AppRoutes } from '../AppRoutes';
import { AuthProvider } from '../../providers/AuthProvider';
import { AppProvider } from '../../providers/AppProvider';
import type { Hotel } from '../../../features/hotels/types/hotel.types';

// ---------------------------------------------------------------------------
// Mock the API client + hotel service so the providers never hit the network.
// Empty data keeps the localStorage/initialData fallbacks in place, which is
// exactly what the routes render from during tests.
// ---------------------------------------------------------------------------
const { mockCmsList, mockHotelList, mockApiGet } = vi.hoisted(() => ({
  mockCmsList: vi.fn(),
  mockHotelList: vi.fn(),
  mockApiGet: vi.fn(),
}));

vi.mock('../../../../lib/api/client', () => ({
  api: {
    get: mockApiGet,
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    me: vi.fn(),
    getCsrfToken: vi.fn(),
    submitInquiry: vi.fn(),
    cmsList: mockCmsList,
    cmsGet: vi.fn(),
    cmsCreate: vi.fn(),
    cmsUpdate: vi.fn(),
    cmsDelete: vi.fn(),
  },
  setCsrfToken: vi.fn(),
}));

vi.mock('../../../features/hotels/services/hotelService', () => ({
  hotelService: {
    list: mockHotelList,
    get: mockApiGet,
    getBySlug: mockApiGet,
    getByRegion: vi.fn().mockResolvedValue([]),
    getFeatured: vi.fn().mockResolvedValue([]),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../../../../lib/services/analytics.service', () => ({
  analyticsService: { trackPageView: vi.fn(), trackEvent: vi.fn() },
}));

// motion's useScroll keeps a frame loop alive on unmount in jsdom, which fires
// unhandled "ref not hydrated" errors after navigation tests unmount the view.
// Stub the scroll hooks to inert values — the same spirit as the observer
// stubs above — while keeping the rest of motion intact.
vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>();
  return {
    ...actual,
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useTransform: () => ({ get: () => 0 }),
  };
});

// ---------------------------------------------------------------------------
// jsdom lacks the browser observers used by motion's whileInView/useScroll.
// ---------------------------------------------------------------------------
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

beforeEach(() => {
  localStorage.clear();
  // jsdom does not implement scrollTo; navigation handlers call it, so stub it
  // to keep the test output clean (same as the hotel detail page tests).
  window.scrollTo = vi.fn();
  mockCmsList.mockReset().mockResolvedValue({ data: [] });
  mockHotelList.mockReset().mockResolvedValue([]);
  mockApiGet.mockReset().mockResolvedValue({ data: [] });
});

// ---------------------------------------------------------------------------
// Renders the real AppRoutes (with the real PublicRoutes/AdminRoutes route
// tables) inside the same provider tree the app uses, driven by MemoryRouter.
// ---------------------------------------------------------------------------
function renderAppRoutes(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

// Renders the real route tree plus a probe that reports the current URL, so
// navigation can be asserted end to end.
function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location-probe">{location.pathname}</div>;
}

function renderAppRoutesWithProbe(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
          <LocationProbe />
        </AppProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

// Realistic lodge fixtures matching the seeded data.
const paroPineSanctuary: Hotel = {
  id: 'hotel-1',
  slug: 'paro-pine-sanctuary',
  name: 'BLHT Paro Pine Sanctuary',
  brand: 'BLHT Sanctuary',
  location: 'Balakha Village, Paro',
  region: 'Paro',
  starRating: 5,
  pricePerNightUSD: 2200,
  heroImage: 'https://example.com/paro.jpg',
  images: ['https://example.com/paro.jpg'],
  tagline: 'A sanctuary tucked inside a blue pine forest.',
  description: 'A serene lodge beneath the ruined Drukyel Dzong.',
  amenities: ['Spa & Steam Room', 'Private Yoga Pavilion'],
  featured: true,
};

const sixSensesThimphu: Hotel = {
  id: 'hotel-2',
  slug: 'six-senses-thimphu',
  name: 'Six Senses Thimphu (Palace in the Sky)',
  brand: 'Six Senses',
  location: 'Chungdue, Thimphu',
  region: 'Thimphu',
  starRating: 5,
  pricePerNightUSD: 1950,
  heroImage: 'https://example.com/six-senses.jpg',
  images: ['https://example.com/six-senses.jpg'],
  tagline: 'Perched high on the valley wall.',
  description: 'A sky palace above the capital valley.',
  amenities: ['Heated Indoor Infinity Pool', 'Six Senses Wellness Spa'],
  featured: true,
};

describe('AppRoutes', () => {
  it('renders the public homepage at / without React Router errors', async () => {
    renderAppRoutes('/');

    // Hero section content from the public route.
    expect(await screen.findByText(/TOUR OPERATOR LICENSE/i)).toBeInTheDocument();
    // Navbar (MainLayout) and Footer both render the brand name — the layout
    // route mounted successfully.
    expect(screen.getAllByText('BHUTAN LAND OF HAPPINESS').length).toBeGreaterThan(0);
  });

  it('renders the public About page at /about', async () => {
    renderAppRoutes('/about');

    expect(
      await screen.findByRole('heading', { name: /About Bhutan Land of Happiness/i })
    ).toBeInTheDocument();
  });

  it('renders the full-screen PDF viewer at /brochures/viewer without site chrome', async () => {
    // The viewer preflights the PDF URL with a HEAD request; resolve it so the
    // document is not flagged as failed.
    const originalFetch = globalThis.fetch;
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));

    renderAppRoutes('/brochures/viewer');

    try {
      // The shipped seed brochure is shown when none is explicitly selected.
      expect(
        await screen.findByTitle('Thangka Painting & Sacred Art Collection 2026')
      ).toBeInTheDocument();

      // Standalone page: the MainLayout (Navbar + Footer) must NOT render here —
      // the page shows nothing but the PDF.
      expect(screen.queryByText('BHUTAN LAND OF HAPPINESS')).not.toBeInTheDocument();
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('navigates from the lodges list to the detail page using the real slug', async () => {
    mockHotelList.mockResolvedValue([paroPineSanctuary]);

    renderAppRoutesWithProbe('/hotels');

    // Click the lodge card in the directory.
    fireEvent.click(await screen.findByRole('button', { name: /more details/i }));

    // One navigation to the lodge's real slug (not a name-derived slug), and
    // the detail page renders it.
    expect(await screen.findByRole('heading', { name: paroPineSanctuary.name })).toBeInTheDocument();
    expect(screen.getByTestId('location-probe').textContent).toBe('/hotels/paro-pine-sanctuary');
  });

  it('navigates from a lodge detail page to a related lodge using its real slug', async () => {
    mockHotelList.mockResolvedValue([paroPineSanctuary, sixSensesThimphu]);

    renderAppRoutesWithProbe('/hotels/paro-pine-sanctuary');

    // The related-lodges section lists the other lodge.
    const relatedCard = await screen.findByText(sixSensesThimphu.name);
    fireEvent.click(relatedCard);

    expect(
      await screen.findByRole('heading', { name: sixSensesThimphu.name })
    ).toBeInTheDocument();
    expect(screen.getByTestId('location-probe').textContent).toBe('/hotels/six-senses-thimphu');
  });

  it('deep link to a lodge slug renders the detail page from the loaded list', async () => {
    mockHotelList.mockResolvedValue([paroPineSanctuary]);

    renderAppRoutesWithProbe('/hotels/paro-pine-sanctuary');

    expect(
      await screen.findByRole('heading', { name: paroPineSanctuary.name })
    ).toBeInTheDocument();
    expect(screen.getByTestId('location-probe').textContent).toBe('/hotels/paro-pine-sanctuary');
  });

  it('redirects unauthenticated users from a protected admin route to the login page', async () => {
    renderAppRoutes('/admin/dashboard');

    // ProtectedRoute first shows a loading state, then <Navigate> bounces
    // unauthenticated visitors to /admin/login — the BLHT Administration card.
    expect(await screen.findByRole('heading', { name: /BLHT Administration/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/admin@blht\.bt/i)).toBeInTheDocument();
  });

  it('renders the admin login page directly at /admin/login', async () => {
    renderAppRoutes('/admin/login');

    expect(
      await screen.findByRole('heading', { name: /BLHT Administration/i })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/admin@blht\.bt/i)).toBeInTheDocument();
  });
});
