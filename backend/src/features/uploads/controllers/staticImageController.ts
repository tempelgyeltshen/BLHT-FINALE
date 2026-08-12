import type { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Images shipped with the application (assets/images/). Used as brochure
 * cover art so the public pages show real product photos instead of stock
 * internet URLs. Served with the correct Content-Type and caching headers.
 *
 * GET /api/uploads/images/:filename
 */
const IMAGES_DIR = path.resolve(__dirname, '../../../../assets/images');

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
};

export async function streamStaticImage(req: Request, res: Response, next: NextFunction) {
  try {
    // Prevent path traversal: only allow the exact basename of a real file.
    const requested = path.basename(String(req.params.filename || ''));
    const fullPath = path.join(IMAGES_DIR, requested);

    if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
      return res.status(404).json({ error: { message: 'Image not found.' } });
    }

    const stats = fs.statSync(fullPath);
    const ext = path.extname(requested).toLowerCase();

    res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
    res.setHeader('Content-Length', String(stats.size));
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    fs.createReadStream(fullPath).pipe(res);
  } catch (error) {
    next(error);
  }
}
