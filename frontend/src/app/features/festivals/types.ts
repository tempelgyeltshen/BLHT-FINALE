/**
 * Festival domain types for the public festival calendar & admin management.
 * `Festival` matches the app-wide data shape (see src/types).
 */

export interface Festival {
  id: string;
  slug: string;
  name: string;
  location: string;
  dzong: string;
  dates2026?: string;
  dates2027: string;
  month: string;
  description: string;
  significance: string;
  heroImage: string;
  durationDays: number;
  featured: boolean;
  slNo?: number;
}

/** Payload used when creating/updating a festival (id derived). */
export type FestivalFormData = Omit<Festival, 'id'>;
