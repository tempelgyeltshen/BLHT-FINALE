import mongoose from 'mongoose';
import fs from 'fs';
import type { Readable } from 'stream';
import { AppError } from '../../../core/errors/AppError.js';

/**
 * GridFS-backed storage for large PDFs (brochures) that exceed the
 * Cloudinary free-plan raw file limit (10 MB). GridFS splits files into
 * 255 KB chunks so they can exceed the 16 MB BSON document limit.
 *
 * Files are streamed from the multer temp file into GridFS on upload and
 * streamed back out to the client on request.
 */
const BUCKET_NAME = 'pdfs';

function getBucket() {
  if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
    throw new AppError(503, 'Database not connected.');
  }
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: BUCKET_NAME });
}

function toObjectId(fileId: string) {
  try {
    return new mongoose.Types.ObjectId(fileId);
  } catch {
    throw new AppError(400, 'Invalid PDF id.');
  }
}

export interface StoredPdf {
  fileId: string;
  size: number;
}

export interface PdfInfo {
  fileId: string;
  filename: string;
  length: number;
  contentType: string;
}

export const mongoUploadService = {
  /**
   * Stream a file from disk (multer temp file) into a GridFS document.
   * Returns the GridFS file id and stored size.
   */
  async storePdf(filePath: string, filename: string, mimeType: string): Promise<StoredPdf> {
    const bucket = getBucket();

    return new Promise<StoredPdf>((resolve, reject) => {
      const uploadStream = bucket.openUploadStream(filename, {
        contentType: mimeType || 'application/pdf',
        metadata: { uploadedAt: new Date() },
      });
      const fileStream = fs.createReadStream(filePath);

      fileStream.on('error', (error) => {
        uploadStream.destroy();
        reject(error);
      });
      uploadStream.on('error', reject);
      uploadStream.on('finish', () => {
        resolve({
          fileId: uploadStream.id.toString(),
          size: uploadStream.length,
        });
      });

      fileStream.pipe(uploadStream);
    });
  },

  /** Look up a stored PDF's metadata (null when not found). */
  async getPdfInfo(fileId: string): Promise<PdfInfo | null> {
    const bucket = getBucket();
    const files = await bucket.find({ _id: toObjectId(fileId) }).toArray();

    if (!files[0]) {
      return null;
    }

    return {
      fileId: files[0]._id.toString(),
      filename: files[0].filename,
      length: files[0].length,
      contentType: files[0].contentType || 'application/pdf',
    };
  },

  /** Open a readable stream for a stored PDF (throws 404 when missing). */
  async openDownloadStream(fileId: string): Promise<{ stream: Readable; info: PdfInfo }> {
    const bucket = getBucket();
    const info = await this.getPdfInfo(fileId);

    if (!info) {
      throw new AppError(404, 'PDF not found.');
    }

    return { stream: bucket.openDownloadStream(toObjectId(fileId)), info };
  },

  /** Delete a stored PDF (no-op when the id is not found). */
  async deletePdf(fileId: string): Promise<void> {
    const bucket = getBucket();
    try {
      await bucket.delete(toObjectId(fileId));
    } catch (error) {
      // GridFSBucket.delete throws a "File not found" error for missing ids.
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('not found') || message.includes('ENOENT')) {
        return;
      }
      throw error;
    }
  },
};
