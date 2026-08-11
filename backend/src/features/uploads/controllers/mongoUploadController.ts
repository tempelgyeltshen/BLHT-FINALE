import type { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import { mongoUploadService } from '../services/mongoUploadService.js';

/**
 * Store a PDF in MongoDB GridFS (used for files too large for Cloudinary's
 * 10 MB raw limit). Expects a multipart upload via the shared `upload` multer
 * middleware (field name "file").
 */
export async function uploadPdfToMongo(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: { message: 'A valid PDF file is required.' } });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: { message: 'Only PDF files are supported.' } });
    }

    // Handle both memory storage (buffer) and disk storage (file path)
    const fileData = req.file.buffer || req.file.path;

    const { fileId, size } = await mongoUploadService.storePdf(
      fileData,
      req.file.originalname,
      req.file.mimetype
    );

    res.status(201).json({
      data: {
        url: `/api/uploads/mongo/${fileId}`,
        fileId,
        size,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    // Always remove the multer temp file if using disk storage
    try {
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch {
      // ignore cleanup errors
    }
  }
}

/** Stream a stored PDF back to the client (public - brochures are public). */
export async function streamPdfFromMongo(req: Request, res: Response, next: NextFunction) {
  try {
    const { stream, info } = await mongoUploadService.openDownloadStream(req.params.id);

    const safeTitle = info.filename.replace(/[^a-zA-Z0-9_\- ]/g, '').trim() || 'brochure';
    // The sanitizer above strips dots, so restore a clean .pdf extension on
    // the saved file ("FINAL 26 Pagespdf" -> "FINAL 26 Pages.pdf").
    const downloadName = /\.pdf$/i.test(safeTitle)
      ? safeTitle
      : /pdf$/i.test(safeTitle)
        ? `${safeTitle.slice(0, -3)}.pdf`
        : `${safeTitle}.pdf`;
    const wantDownload = req.query.download === '1' || req.query.download === 'true';

    res.setHeader('Content-Type', info.contentType || 'application/pdf');
    res.setHeader('Content-Length', String(info.length));
    res.setHeader(
      'Content-Disposition',
      wantDownload
        ? `attachment; filename="${downloadName}"`
        : `inline; filename="${downloadName}"`
    );
    // Revalidate so a re-uploaded brochure never serves a stale cached PDF.
    res.setHeader('Cache-Control', 'public, no-cache');

    stream.on('error', () => {
      if (!res.headersSent) {
        res.status(502).end();
      }
    });
    stream.pipe(res);
  } catch (error) {
    next(error);
  }
}

/** Delete a stored PDF from GridFS (admin only). */
export async function deletePdfFromMongo(req: Request, res: Response, next: NextFunction) {
  try {
    await mongoUploadService.deletePdf(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

