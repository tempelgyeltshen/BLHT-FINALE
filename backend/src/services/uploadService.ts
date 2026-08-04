import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import type { Express } from 'express';
import { env } from '../config/env.js';
import { AppError } from '../errors/AppError.js';

export interface StoredUpload {
  key: string;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface UploadProvider {
  store(file: Express.Multer.File, folder: string): Promise<StoredUpload>;
  remove(publicId: string, resourceType?: 'image' | 'raw'): Promise<void>;
}

cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
  secure: true
});

export class CloudinaryUploadProvider implements UploadProvider {
  async store(file: Express.Multer.File, folder: string) {
    if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
      throw new AppError(503, 'Cloudinary is not configured.');
    }
    
    const resource_type = file.mimetype === 'application/pdf' ? 'raw' : 'image';
    
    const result = await new Promise<{ public_id: string; secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `blht/${folder}`,
          resource_type,
          public_id: undefined,
          use_filename: true,
          unique_filename: true,
          chunk_size: 6000000, // 6MB chunks for better handling of large files
          timeout: 600000, // 10 minute timeout for very large files
          eager: resource_type === 'image' ? [{ quality: 'auto', fetch_format: 'auto' }] : undefined
        },
        (error, upload) => {
          if (error || !upload) {
            reject(error ?? new Error('Upload failed.'));
          } else {
            resolve(upload);
          }
        }
      );
      
      // Read from disk file instead of memory buffer
      const fileStream = fs.createReadStream(file.path);
      fileStream.pipe(stream);
      
      fileStream.on('error', (error) => {
        reject(error);
      });
    });
    
    // Clean up temporary file after upload
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (error) {
      console.warn('Failed to clean up temporary file:', error);
    }
    
    return {
      key: result.public_id,
      url: result.secure_url,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size
    };
  }
  
  async remove(publicId: string, resourceType: 'image' | 'raw' = 'image') {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  }
}

export const uploadProvider: UploadProvider = new CloudinaryUploadProvider();
