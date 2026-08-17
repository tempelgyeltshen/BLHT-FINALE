import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../AppRoutes';
import { AuthProvider } from '../../providers/AuthProvider';
import { AppProvider } from '../../providers/AppProvider';

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
  hotelService: { list: mockHotelList },
}));

vi.mock('../../../../lib/services/analytics.service', () => ({
  analyticsService: { trackPageView: vi.fn(), trackEvent: vi.fn() },
}));

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
