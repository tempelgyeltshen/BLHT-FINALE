import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { UPLOAD } from '../config/constants.js';

const allowed = new Set<string>(UPLOAD.allowedMimeTypes);

// Use memory storage for cloud deployments (Render, etc.)
// This avoids filesystem permission issues and is better for cloud environments
// For local development, you can set USE_DISK_STORAGE=true in .env
const useDiskStorage = process.env.USE_DISK_STORAGE === 'true';

let upload: multer.Multer;

if (useDiskStorage) {
  // Ensure uploads directory exists for local development
  const uploadsDir = path.join(process.cwd(), 'uploads');
  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  } catch (error) {
    console.log('Failed to create uploads directory, falling back to memory storage');
    // Fall through to memory storage
  }

  // Use disk storage for local development
  upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadsDir);
      },
      filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
      }
    }),
    limits: {
      fileSize: UPLOAD.maxFileSizeBytes, // 5GB - increased to handle very large files
      files: 1
    },
    fileFilter: (_req, file, callback) => {
      if (!allowed.has(file.mimetype)) {
        return callback(null, false);
      }
      return callback(null, true);
    }
  });
} else {
  // Use memory storage for cloud deployments
  upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: UPLOAD.maxFileSizeBytes, // 5GB - increased to handle very large files
      files: 1
    },
    fileFilter: (_req, file, callback) => {
      if (!allowed.has(file.mimetype)) {
        return callback(null, false);
      }
      return callback(null, true);
    }
  });
}

export { upload };
