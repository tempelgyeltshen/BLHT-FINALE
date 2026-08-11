import { Brochure } from '../../../types';
import { initialBrochures } from '../../../data/initialData';

/**
 * True when the brochure references one of the static PDFs shipped with the
 * app (backend/assets/brochures), which are the canonical documents.
 */
const hasUsableStaticPdf = (b: Brochure): boolean =>
  typeof b.pdfUrl === 'string' && b.pdfUrl.startsWith('/api/uploads/brochures/');

/**
 * Merges brochures loaded from localStorage with the shipped static brochure
 * PDFs. Stale caches (from the Cloudinary/GridFS era) may not carry a usable
 * pdfUrl, which would make the viewer/download silently break. Restore the
 * shipped static PDF (and its size/page metadata) for known brochures;
 * unmatched/admin-created records are left untouched.
 *
 * Malformed entries (e.g. null from a corrupt cache) are passed through
 * unchanged rather than throwing — deliberately different from a whole-list
 * fallback, so one bad record can't wipe the entire collection.
 */
export const mergeBrochuresWithShippedPdfs = (
  saved: Brochure[],
  fallback: Brochure[] = initialBrochures,
): Brochure[] => {
  if (!Array.isArray(saved) || saved.length === 0) return fallback;
  return saved.map((b) => {
    if (!b || typeof b !== 'object') return b;
    if (hasUsableStaticPdf(b)) return b;
    const match =
      fallback.find((s) => s.id === b.id) ||
      fallback.find((s) => s.title === b.title);
    return match
      ? { ...b, pdfUrl: match.pdfUrl, fileSize: match.fileSize, totalPages: match.totalPages }
      : b;
  });
};

/**
 * Loads brochures from localStorage, applying the static-PDF merge so the
 * uploaded documents are always used. Falls back to the shipped seed data
 * when nothing is stored or the stored value is corrupt.
 */
export const loadBrochuresFromStorage = (
  key: string,
  fallback: Brochure[] = initialBrochures,
): Brochure[] => {
  const saved = localStorage.getItem(key);
  if (!saved) return fallback;
  try {
    return mergeBrochuresWithShippedPdfs(JSON.parse(saved), fallback);
  } catch {
    return fallback;
  }
};
