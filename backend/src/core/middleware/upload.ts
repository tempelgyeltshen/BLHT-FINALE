import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { UPLOAD } from '../config/constants.js';

const allowed = new Set<string>(UPLOAD.allowedMimeTypes);

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Use disk storage for large files (GB-sized files)
export const upload = multer({
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
