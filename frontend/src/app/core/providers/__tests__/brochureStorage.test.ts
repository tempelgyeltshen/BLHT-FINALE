import { beforeEach, describe, expect, it } from 'vitest';
import { initialBrochures } from '../../../../data/initialData';
import { Brochure } from '../../../../types';
import {
  loadBrochuresFromStorage,
  mergeBrochuresWithShippedPdfs,
} from '../brochureStorage';

const STORAGE_KEY = 'blht_test_brochures';

// A stale Cloudinary-era record: no usable static pdfUrl.
const staleRecord = (overrides: Partial<Brochure> = {}): Brochure => ({
  id: 'brochure-1',
  title: 'Thangka Painting & Sacred Art Collection 2026',
  category: 'Thangka Painting',
  subtitle: 'Old cached subtitle',
  fileSize: '0.0 MB',
  totalPages: 0,
  coverImage: 'https://example.com/cover.jpg',
  galleryImages: [],
  pdfUrl: 'https://res.cloudinary.com/x/raw/upload/v1/thangka-old.pdf',
  downloadCount: 0,
  year: '2025',
  featured: false,
  ...overrides,
});

beforeEach(() => {
  localStorage.clear();
});

describe('mergeBrochuresWithShippedPdfs', () => {
  it('returns the fallback list when the saved value is not an array', () => {
    expect(mergeBrochuresWithShippedPdfs(null as unknown as Brochure[])).toBe(initialBrochures);
  });

  it('returns the fallback list when the saved array is empty', () => {
    expect(mergeBrochuresWithShippedPdfs([])).toBe(initialBrochures);
  });

  it('keeps brochures whose pdfUrl already points at a shipped static PDF', () => {
    const result = mergeBrochuresWithShippedPdfs([initialBrochures[0]]);
    expect(result[0]).toEqual(initialBrochures[0]);
    expect(result[0].pdfUrl).toBe('/api/uploads/brochures/thangka-painting-brochure.pdf');
    expect(result[0].coverImage).toBe(initialBrochures[0].coverImage);
  });

  it('restores the shipped cover image for a stale record with an old/stock image URL', () => {
    const [restored] = mergeBrochuresWithShippedPdfs([
      staleRecord({ coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80' }),
    ]);
    expect(restored.coverImage).toBe(initialBrochures[0].coverImage);
    expect(restored.galleryImages).toEqual(initialBrochures[0].galleryImages);
    expect(restored.pdfUrl).toBe('/api/uploads/brochures/thangka-painting-brochure.pdf');
  });

  it('restores the shipped static PDF for a stale Cloudinary record matched by id', () => {
    const [restored] = mergeBrochuresWithShippedPdfs([staleRecord()]);
    expect(restored.pdfUrl).toBe('/api/uploads/brochures/thangka-painting-brochure.pdf');
    expect(restored.fileSize).toBe('17.6 MB');
    expect(restored.totalPages).toBe(26);
  });

  it('restores by title when the stored id does not match any shipped brochure', () => {
    const [restored] = mergeBrochuresWithShippedPdfs([
      staleRecord({ id: 'some-mongo-object-id', title: 'HQ Car Rental Pamphlet' }),
    ]);
    expect(restored.pdfUrl).toBe('/api/uploads/brochures/car-rental-hq-pamphlet.pdf');
    expect(restored.coverImage).toBe(initialBrochures[1].coverImage);
  });

  it('restores an empty/missing pdfUrl for a matched brochure', () => {
    const [restored] = mergeBrochuresWithShippedPdfs([staleRecord({ pdfUrl: '' })]);
    expect(restored.pdfUrl).toBe('/api/uploads/brochures/thangka-painting-brochure.pdf');
  });

  it('restores a stale GridFS (/api/mongo) pdfUrl for a matched brochure', () => {
    const [restored] = mergeBrochuresWithShippedPdfs([
      staleRecord({ pdfUrl: '/api/mongo/64f0abc123def456' }),
    ]);
    expect(restored.pdfUrl).toBe('/api/uploads/brochures/thangka-painting-brochure.pdf');
  });

  it('matches against a custom fallback list instead of the hard-coded seed', () => {
    const customFallback: Brochure[] = [
      {
        id: 'custom-1',
        title: 'Custom Brochure',
        category: 'Custom',
        subtitle: 'x',
        fileSize: '2.0 MB',
        totalPages: 12,
        coverImage: 'https://example.com/c.jpg',
        galleryImages: [],
        pdfUrl: '/api/uploads/brochures/custom-brochure.pdf',
        downloadCount: 0,
        year: '2026',
        featured: false,
      },
    ];
    const saved: Brochure = { ...staleRecord(), id: 'custom-1', title: 'Custom Brochure' };
    const [restored] = mergeBrochuresWithShippedPdfs([saved], customFallback);
    expect(restored.pdfUrl).toBe('/api/uploads/brochures/custom-brochure.pdf');
    expect(restored.fileSize).toBe('2.0 MB');
    expect(restored.totalPages).toBe(12);
  });

  it('preserves non-PDF saved fields (admin edits) on restored records', () => {
    const [restored] = mergeBrochuresWithShippedPdfs([
      staleRecord({ subtitle: 'Admin updated subtitle', featured: true }),
    ]);
    expect(restored.subtitle).toBe('Admin updated subtitle');
    expect(restored.featured).toBe(true);
    expect(restored.pdfUrl).toBe('/api/uploads/brochures/thangka-painting-brochure.pdf');
    expect(restored.coverImage).toBe(initialBrochures[0].coverImage);
  });

  it('leaves unmatched admin-created records untouched', () => {
    const custom: Brochure = {
      id: 'custom-1',
      title: 'Custom Winter Rates 2027',
      category: 'Car Rental',
      subtitle: 'Special seasonal offer',
      fileSize: '0.8 MB',
      totalPages: 0,
      coverImage: 'https://example.com/winter.jpg',
      galleryImages: [],
      pdfUrl: '/api/mongo/64f0abc123',
      downloadCount: 3,
      year: '2027',
      featured: false,
    };
    const result = mergeBrochuresWithShippedPdfs([custom]);
    expect(result[0]).toBe(custom);
    expect(result[0].pdfUrl).toBe('/api/mongo/64f0abc123');
  });

  it('does not throw on malformed entries and passes them through', () => {
    const result = mergeBrochuresWithShippedPdfs([null as unknown as Brochure]);
    expect(result).toHaveLength(1);
    expect(result[0]).toBeNull();
  });
});

describe('loadBrochuresFromStorage', () => {
  it('returns the shipped seed data when nothing is stored', () => {
    expect(loadBrochuresFromStorage(STORAGE_KEY)).toBe(initialBrochures);
  });

  it('returns the shipped seed data when the stored JSON is corrupt', () => {
    localStorage.setItem(STORAGE_KEY, '{not valid json');
    expect(loadBrochuresFromStorage(STORAGE_KEY)).toBe(initialBrochures);
  });

  it('returns the shipped seed data when the stored value is not an array', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ title: 'nope' }));
    expect(loadBrochuresFromStorage(STORAGE_KEY)).toBe(initialBrochures);
  });

  it('returns the shipped seed data when the stored array is empty', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    expect(loadBrochuresFromStorage(STORAGE_KEY)).toBe(initialBrochures);
  });

  it('loads stored brochures and restores the shipped static PDFs', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([staleRecord()]));
    const [loaded] = loadBrochuresFromStorage(STORAGE_KEY);
    expect(loaded.pdfUrl).toBe('/api/uploads/brochures/thangka-painting-brochure.pdf');
    expect(loaded.totalPages).toBe(26);
  });

  it('keeps stored brochures that already reference the shipped static PDFs', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialBrochures));
    const loaded = loadBrochuresFromStorage(STORAGE_KEY);
    expect(loaded).toHaveLength(initialBrochures.length);
    expect(loaded[0].pdfUrl).toBe('/api/uploads/brochures/thangka-painting-brochure.pdf');
    expect(loaded[3].pdfUrl).toBe('/api/uploads/brochures/car-rental-new-brochure.pdf');
  });
});
