import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PdfFullScreenView } from '../components/PdfFullScreenView';
import type { Brochure } from '../types';

// ---------------------------------------------------------------------------
// Mock the AppProvider so each test controls the brochure library directly.
// ---------------------------------------------------------------------------
const { mockUseApp } = vi.hoisted(() => ({
  mockUseApp: vi.fn(),
}));

vi.mock('../../../core/providers/AppProvider', () => ({
  useApp: () => mockUseApp(),
}));

// Realistic brochure fixtures matching the shipped seed documents.
const thangkaBrochure: Brochure = {
  id: 'brochure-1',
  title: 'Thangka Painting & Sacred Art Collection 2026',
  subtitle: 'Authentic traditional Bhutanese thangka masterpieces and sacred art heritage',
  category: 'Thangka Painting',
  fileSize: '17.6 MB',
  totalPages: 26,
  coverImage: 'https://example.com/thangka-cover.jpg',
  galleryImages: ['https://example.com/thangka-cover.jpg'],
  pdfUrl: '/api/uploads/brochures/thangka-painting-brochure.pdf',
  downloadCount: 1420,
  year: '2026',
  featured: true,
};

const carRentalBrochure: Brochure = {
  id: 'brochure-2',
  title: 'HQ Car Rental Pamphlet',
  subtitle: 'High Quality Car Rental - official fleet pamphlet with vehicle options and rates',
  category: 'Car Rental',
  fileSize: '1.0 MB',
  totalPages: 0,
  coverImage: 'https://example.com/car-rental-cover.jpg',
  galleryImages: ['https://example.com/car-rental-cover.jpg'],
  pdfUrl: '/api/uploads/brochures/car-rental-hq-pamphlet.pdf',
  downloadCount: 520,
  year: '2026',
  featured: false,
};

beforeEach(() => {
  // The viewer preflights non-blob PDF URLs with a HEAD request; resolve it
  // so the document is not flagged as failed.
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
  mockUseApp.mockReturnValue({
    activeBrochure: null,
    brochures: [thangkaBrochure, carRentalBrochure],
    setActiveBrochure: vi.fn(),
    navigate: vi.fn(),
    brochureReturnRoute: 'brochures',
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('PdfFullScreenView deep-link behavior', () => {
  it('deep link without a selected brochure falls back to the first brochure in the library', async () => {
    render(<PdfFullScreenView />);

    // No explicit selection: the viewer resolves brochures[0], exactly what a
    // visitor landing directly on /brochures/viewer sees.
    expect(await screen.findByTitle(thangkaBrochure.title)).toBeInTheDocument();
  });

  it('an explicitly selected brochure wins over the library fallback', async () => {
    mockUseApp.mockReturnValue({
      activeBrochure: carRentalBrochure,
      brochures: [thangkaBrochure, carRentalBrochure],
      setActiveBrochure: vi.fn(),
      navigate: vi.fn(),
      brochureReturnRoute: 'brochures',
    });

    render(<PdfFullScreenView />);

    expect(await screen.findByTitle(carRentalBrochure.title)).toBeInTheDocument();
    expect(screen.queryByTitle(thangkaBrochure.title)).not.toBeInTheDocument();
  });

  it('empty library shows the No Brochure Selected fallback and navigates to the directory', async () => {
    const navigate = vi.fn();
    mockUseApp.mockReturnValue({
      activeBrochure: null,
      brochures: [],
      setActiveBrochure: vi.fn(),
      navigate,
      brochureReturnRoute: 'brochures',
    });

    render(<PdfFullScreenView />);

    expect(await screen.findByText('No Brochure Selected')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /view brochure directory/i }));
    expect(navigate).toHaveBeenCalledWith('brochures');
  });

  it('failed PDF preflight shows the load-failed fallback', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    render(<PdfFullScreenView />);

    expect(await screen.findByText('The PDF could not be loaded.')).toBeInTheDocument();
  });

  it('back control clears the selection and returns to the brochure library', async () => {
    const setActiveBrochure = vi.fn();
    const navigate = vi.fn();
    mockUseApp.mockReturnValue({
      activeBrochure: thangkaBrochure,
      brochures: [thangkaBrochure],
      setActiveBrochure,
      navigate,
      brochureReturnRoute: 'brochures',
    });

    render(<PdfFullScreenView />);

    fireEvent.click(await screen.findByRole('button', { name: /back/i }));
    expect(setActiveBrochure).toHaveBeenCalledWith(null);
    expect(navigate).toHaveBeenCalledWith('brochures');
  });
});
