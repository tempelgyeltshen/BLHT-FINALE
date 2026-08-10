import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextFunction, Request, Response } from 'express';

vi.mock('../../services/mongoUploadService.js', () => ({
  mongoUploadService: {
    storePdf: vi.fn(),
    openDownloadStream: vi.fn(),
    getPdfInfo: vi.fn(),
    deletePdf: vi.fn(),
  },
}));

vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(() => true),
    unlinkSync: vi.fn(),
  },
}));

import fs from 'fs';
import { mongoUploadService } from '../../services/mongoUploadService.js';
import { uploadPdfToMongo, streamPdfFromMongo, deletePdfFromMongo } from '../mongoUploadController.js';

const mockUnlinkSync = vi.mocked(fs.unlinkSync);

const mockStorePdf = vi.mocked(mongoUploadService.storePdf);
const mockOpenDownloadStream = vi.mocked(mongoUploadService.openDownloadStream);
const mockDeletePdf = vi.mocked(mongoUploadService.deletePdf);

function createRes() {
  const res: Record<string, any> = {
    headersSent: false,
  };
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.setHeader = vi.fn().mockReturnValue(res);
  res.end = vi.fn().mockReturnValue(res);
  return res as unknown as Response;
}

function createReq(file?: Partial<Express.Multer.File>, params: Record<string, string> = {}) {
  return { file, params, query: {} } as unknown as Request;
}

describe('mongoUploadController', () => {
  let res: ReturnType<typeof createRes>;
  let next: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    res = createRes();
    next = vi.fn();
  });

  describe('uploadPdfToMongo', () => {
    it('should return 400 when no file is provided', async () => {
      await uploadPdfToMongo(createReq(), res, next as unknown as NextFunction);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: { message: 'A valid PDF file is required.' } });
      expect(mockStorePdf).not.toHaveBeenCalled();
    });

    it('should return 400 and clean up the temp file for a non-PDF', async () => {
      const req = createReq({ path: '/tmp/x.txt', mimetype: 'text/plain', originalname: 'x.txt' });

      await uploadPdfToMongo(req, res, next as unknown as NextFunction);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: { message: 'Only PDF files are supported.' } });
      expect(mockUnlinkSync).toHaveBeenCalledWith('/tmp/x.txt');
      expect(mockStorePdf).not.toHaveBeenCalled();
    });

    it('should store the PDF and return 201 with the stream URL', async () => {
      mockStorePdf.mockResolvedValue({ fileId: 'file-123', size: 46137344 });
      const req = createReq({
        path: '/tmp/guide.pdf',
        mimetype: 'application/pdf',
        originalname: 'guide.pdf',
      });

      await uploadPdfToMongo(req, res, next as unknown as NextFunction);

      expect(mockStorePdf).toHaveBeenCalledWith('/tmp/guide.pdf', 'guide.pdf', 'application/pdf');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            url: '/api/uploads/mongo/file-123',
            fileId: 'file-123',
            size: 46137344,
          }),
        })
      );
    });

    it('should forward errors to the error handler', async () => {
      mockStorePdf.mockRejectedValue(new Error('gridfs down'));
      const req = createReq({ path: '/tmp/guide.pdf', mimetype: 'application/pdf' });

      await uploadPdfToMongo(req, res, next as unknown as NextFunction);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('streamPdfFromMongo', () => {
    it('should set PDF headers and pipe the stream to the response', async () => {
      const mockStream = { on: vi.fn(), pipe: vi.fn() };
      mockOpenDownloadStream.mockResolvedValue({
        stream: mockStream as any,
        info: { fileId: 'file-123', filename: 'guide.pdf', length: 44, contentType: 'application/pdf' },
      });
      const req = createReq(undefined, { id: 'file-123' });

      await streamPdfFromMongo(req, res, next as unknown as NextFunction);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
      expect(res.setHeader).toHaveBeenCalledWith('Content-Length', '44');
      expect(res.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        expect.stringContaining('inline')
      );
      expect(mockStream.pipe).toHaveBeenCalledWith(res);
    });

    it('should respond 502 when the stream errors before headers are sent', async () => {
      let errorHandler: ((err: Error) => void) | undefined;
      const mockStream = {
        on: vi.fn((event: string, cb: (err: Error) => void) => {
          if (event === 'error') errorHandler = cb;
          return mockStream;
        }),
        pipe: vi.fn(),
      };
      mockOpenDownloadStream.mockResolvedValue({
        stream: mockStream as any,
        info: { fileId: 'file-123', filename: 'guide.pdf', length: 44, contentType: 'application/pdf' },
      });
      const req = createReq(undefined, { id: 'file-123' });

      await streamPdfFromMongo(req, res, next as unknown as NextFunction);
      errorHandler?.(new Error('stream broke'));

      expect(res.status).toHaveBeenCalledWith(502);
      expect(res.end).toHaveBeenCalled();
    });

    it('should forward errors from the service (e.g. 404)', async () => {
      mockOpenDownloadStream.mockRejectedValue(new Error('PDF not found.'));
      const req = createReq(undefined, { id: 'missing' });

      await streamPdfFromMongo(req, res, next as unknown as NextFunction);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('deletePdfFromMongo', () => {
    it('should delete the PDF and respond 204', async () => {
      mockDeletePdf.mockResolvedValue(undefined);
      const req = createReq(undefined, { id: 'file-123' });

      await deletePdfFromMongo(req, res, next as unknown as NextFunction);

      expect(mockDeletePdf).toHaveBeenCalledWith('file-123');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });

    it('should forward errors to the error handler', async () => {
      mockDeletePdf.mockRejectedValue(new Error('delete failed'));
      const req = createReq(undefined, { id: 'file-123' });

      await deletePdfFromMongo(req, res, next as unknown as NextFunction);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
