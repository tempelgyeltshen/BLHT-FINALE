import type { Express } from 'express';

export interface StoredUpload {
  key: string;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface UploadProvider {
  store(file: Express.Multer.File, folder: string): Promise<StoredUpload>;
  remove(publicId: string, resourceType?: 'image' | 'raw' | 'video'): Promise<void>;
}
