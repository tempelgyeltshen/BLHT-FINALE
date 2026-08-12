import { Router } from 'express';
import { uploadFile } from '../controllers/uploadController.js';
import {
  uploadPdfToMongo,
  streamPdfFromMongo,
  deletePdfFromMongo,
} from '../controllers/mongoUploadController.js';
import { streamStaticBrochure } from '../controllers/staticBrochureController.js';
import { streamStaticImage } from '../controllers/staticImageController.js';
import { requireAdmin } from '../../../core/middleware/auth.js';
import { upload } from '../../../core/middleware/upload.js';

export const uploadRouter = Router();

// Cloudinary-backed upload (single request, up to Cloudinary's raw limit).
uploadRouter.post('/', requireAdmin, upload.single('file'), uploadFile);

// Static brochure PDFs shipped with the app (assets/brochures/). Public —
// brochures are public documents. Supports ?download=1 for attachment saves.
uploadRouter.get('/brochures/:filename', streamStaticBrochure);

// Static images shipped with the app (assets/images/), used as brochure cover
// art so public pages show real product photos instead of stock URLs. Public.
uploadRouter.get('/images/:filename', streamStaticImage);

// MongoDB GridFS-backed PDF storage for files too large for Cloudinary's
// raw limit. Upload/delete are admin-only; streaming is public because
// brochures are public documents.
uploadRouter.post('/mongo', requireAdmin, upload.single('file'), uploadPdfToMongo);
uploadRouter.get('/mongo/:id', streamPdfFromMongo);
uploadRouter.delete('/mongo/:id', requireAdmin, deletePdfFromMongo);
