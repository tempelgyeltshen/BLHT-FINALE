import type { Entity } from '../../../shared/types/entity.js';

export interface Festival extends Entity {
  slug?: string;
  name: string;
  location: string;
  dzong?: string;
  dates2026?: string;
  dates2027?: string;
  month?: string;
  description: string;
  significance?: string;
  heroImage?: string;
  durationDays?: number;
  featured?: boolean;
  slNo?: number;
}

export interface FestivalCreateRequest {
  slug?: string;
  name: string;
  location: string;
  dzong?: string;
  dates2026?: string;
  dates2027?: string;
  month?: string;
  description: string;
  significance?: string;
  heroImage?: string;
  durationDays?: number;
  featured?: boolean;
  slNo?: number;
}

export interface FestivalUpdateRequest {
  slug?: string;
  name?: string;
  location?: string;
  dzong?: string;
  dates2026?: string;
  dates2027?: string;
  month?: string;
  description?: string;
  significance?: string;
  heroImage?: string;
  durationDays?: number;
  featured?: boolean;
  slNo?: number;
}
