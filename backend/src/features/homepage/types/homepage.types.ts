export interface HomepageStat {
  label: string;
  value: string;
  iconName: string;
}

import type { Entity } from '../../../shared/types/entity.js';

export interface HomepageConfig extends Entity {
  heroTitle?: string;
  heroSubtitle?: string;
  announcementText?: string;
  announcementLink?: string;
  heroImage?: string;
  heroVideoUrl?: string;
  featuredPackagesCount?: number;
  statsHeading?: string;
  stats?: HomepageStat[];
  featuredPackages?: string[];
  featuredHotels?: string[];
  featuredFestivals?: string[];
  featuredGallery?: string[];
  ceoSection?: {
    title?: string;
    description?: string;
    image?: string;
  };
}

export interface HomepageConfigUpdate {
  heroTitle?: string;
  heroSubtitle?: string;
  announcementText?: string;
  announcementLink?: string;
  heroImage?: string;
  heroVideoUrl?: string;
  featuredPackagesCount?: number;
  statsHeading?: string;
  stats?: HomepageStat[];
  featuredPackages?: string[];
  featuredHotels?: string[];
  featuredFestivals?: string[];
  featuredGallery?: string[];
  ceoSection?: {
    title?: string;
    description?: string;
    image?: string;
  };
}
