import type { Entity } from '../../../shared/types/entity.js';

export interface VideoItem extends Entity {
  title: string;
  description?: string;
  duration?: string;
  youtubeId?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  category?: string;
  featured?: boolean;
  public_id?: string;
}

export interface VideoItemCreateRequest {
  title: string;
  description?: string;
  duration?: string;
  youtubeId?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  category?: string;
  featured?: boolean;
}

export interface VideoItemUpdateRequest {
  title?: string;
  description?: string;
  duration?: string;
  youtubeId?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  category?: string;
  featured?: boolean;
}
