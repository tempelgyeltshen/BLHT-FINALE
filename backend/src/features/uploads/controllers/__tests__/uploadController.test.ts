import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextFunction, Request, Response } from 'express';

// Mock the upload provider so the controller can be tested in isolation
vi.mock('../../services/uploadService.js', () => ({
  uploadProvider: {
    store: vi.fn(),
    remove: vi.fn(),
  },
}));

import { uploadFile } from '../uploadController.js';
import { uploadProvider } from '../../services/uploadService.js';
import { AppError } from '../../../../core/errors/AppError.js';

const mockStore = vi.mocked(uploadProvider.store);

const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB

function createRes() {
  const res: Record<string, any> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as unknown as Response;
}

function createReq(file?: Partial<Express.Multer.File>, body: Record<string, unknown> = {}) {
  return {
    file,
    body,
  } as unknown as Request;
}

describe('uploadController', () => {
  let res: ReturnType<typeof createRes>;
  let next: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    res = createRes();
    next = vi.fn();
  });

  describe('uploadFile', () => {
    it('should return 400 when no file is provided', async () => {
      await uploadFile(createReq(), res, next as unknown as NextFunction);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: { message: 'A valid file is required.' } });
      expect(mockStore).not.toHaveBeenCalled();
    });

    it('should return 413 when file exceeds the maximum allowed size', async () => {
      const req = createReq({ size: MAX_FILE_SIZE + 1 });

      await uploadFile(req, res, next as unknown as NextFunction);

      expect(res.status).toHaveBeenCalledWith(413);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            message: expect.stringContaining('exceeds maximum allowed size'),
          }),
        })
      );
      expect(mockStore).not.toHaveBeenCalled();
    });

    it('should return 201 with stored result and default folder when none is given', async () => {
      mockStore.mockResolvedValue({
        key: 'blht/misc/photo',
        url: 'https://res.cloudinary.com/test/image.jpg',
        originalName: 'photo.jpg',
        mimeType: 'image/jpeg',
        size: 2048,
      });
      const req = createReq({ size: 2048, originalname: 'photo.jpg', mimetype: 'image/jpeg' });

      await uploadFile(req, res, next as unknown as NextFunction);

      expect(mockStore).toHaveBeenCalledWith(req.file, 'misc');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            key: 'blht/misc/photo',
            url: 'https://res.cloudinary.com/test/image.jpg',
            fileSize: '2 KB',
            originalSize: 2048,
          }),
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should use the folder provided in the request body', async () => {
      mockStore.mockResolvedValue({
        key: 'blht/brochures/doc',
        url: 'https://res.cloudinary.com/test/doc.pdf',
        originalName: 'doc.pdf',
        mimeType: 'application/pdf',
        size: 5000,
      });
      const req = createReq({ size: 5000 }, { folder: 'brochures' });

      await uploadFile(req, res, next as unknown as NextFunction);

      expect(mockStore).toHaveBeenCalledWith(req.file, 'brochures');
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should forward a 408 AppError when the upload times out', async () => {
      mockStore.mockRejectedValue(new Error('socket hang up ETIMEDOUT'));
      const req = createReq({ size: 1024 });

      await uploadFile(req, res, next as unknown as NextFunction);

      expect(next).toHaveBeenCalledTimes(1);
      const err = next.mock.calls[0][0] as AppError;
      expect(err).toBeInstanceOf(AppError);
      expect(err.statusCode).toBe(408);
      expect(err.message).toContain('Upload timeout');
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should forward a 507 AppError when the server runs out of storage', async () => {
      mockStore.mockRejectedValue(new Error('ENOSPC: no space left on device'));
      const req = createReq({ size: 1024 });

      await uploadFile(req, res, next as unknown as NextFunction);

      expect(next).toHaveBeenCalledTimes(1);
      const err = next.mock.calls[0][0] as AppError;
      expect(err).toBeInstanceOf(AppError);
      expect(err.statusCode).toBe(507);
      expect(err.message).toContain('Server storage full');
    });

    it('should forward the original error to the error handler for other failures', async () => {
      const genericError = new Error('something went wrong');
      mockStore.mockRejectedValue(genericError);
      const req = createReq({ size: 1024 });

      await uploadFile(req, res, next as unknown as NextFunction);

      expect(next).toHaveBeenCalledWith(genericError);
    });
  });
});
