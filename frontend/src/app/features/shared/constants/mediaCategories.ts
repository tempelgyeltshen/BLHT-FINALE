/**
 * Canonical media categories shared across the admin forms and the public
 * gallery / videos / showcase views. Keeping them in one place guarantees the
 * categories an admin picks from are exactly the categories visitors can
 * filter by.
 */

export interface MediaCategory {
  id: string;
  label: string;
}

/** Photo gallery categories (matches the GalleryCategory union type). */
export const GALLERY_CATEGORIES: MediaCategory[] = [
  { id: 'monasteries', label: 'Sacred Monasteries' },
  { id: 'dzongs', label: 'Ancient Fortresses (Dzongs)' },
  { id: 'festivals', label: 'Mask Dance Festivals' },
  { id: 'luxury', label: 'BLHT & Six Senses Lodges' },
  { id: 'nature', label: 'Glacial Valleys & Nature' },
  { id: 'culture', label: 'Cultural & Local Life' },
];

/** Video showcase categories. */
export const VIDEO_CATEGORIES: MediaCategory[] = [
  { id: 'Documentary', label: 'Documentaries' },
  { id: 'Festivals & Culture', label: 'Festivals & Culture' },
  { id: 'Luxury Lodges', label: 'Luxury Lodges' },
  { id: 'Nature & Adventure', label: 'Nature & Adventure' },
  { id: 'Trekking & Trails', label: 'Trekking & Trails' },
  { id: 'Testimonials', label: 'Guest Testimonials' },
];

/** Resolve a category id to its display label (falls back to the raw id). */
export const categoryLabel = (
  id: string | undefined,
  categories: MediaCategory[],
): string => {
  if (!id) return '';
  return categories.find(c => c.id === id)?.label ?? id;
};
