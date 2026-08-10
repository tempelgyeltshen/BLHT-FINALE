import type { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Brochure PDFs shipped with the application (assets/brochures/). These are
 * static files (e.g. large car-rental pamphlets that would be impractical to
 * store in Cloudinary/GridFS), served with proper Content-Type and
 * Content-Disposition so they can be viewed inline or saved as attachments.
 *
 * GET /api/uploads/brochures/:filename        → inline (view)
 * GET /api/uploads/brochures/:filename?download=1 → attachment (save)
 */
const BROCHURES_DIR = path.resolve(__dirname, '../../../../assets/brochures');

export async function streamStaticBrochure(req: Request, res: Response, next: NextFunction) {
  try {
    // Prevent path traversal: only allow the exact basename of a real file.
    const requested = path.basename(String(req.params.filename || ''));
    const fullPath = path.join(BROCHURES_DIR, requested);

    if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
      return res.status(404).json({ error: { message: 'Brochure not found.' } });
    }

    const stats = fs.statSync(fullPath);
    const wantDownload = req.query.download === '1' || req.query.download === 'true';
    // Trusted filenames are alphanumeric + dashes; keep them safe for the
    // Content-Disposition header.
    const safeName = requested.replace(/[^\w.-]/g, '_') || 'brochure.pdf';

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', String(stats.size));
    res.setHeader(
      'Content-Disposition',
      wantDownload
        ? `attachment; filename="${safeName}"`
        : `inline; filename="${safeName}"`
    );
    res.setHeader('Cache-Control', 'public, max-age=3600');

    fs.createReadStream(fullPath).pipe(res);
  } catch (error) {
    next(error);
  }
}
