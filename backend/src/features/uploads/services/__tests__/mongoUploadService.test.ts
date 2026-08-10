import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('mongoose', () => {
  const mockBucket = {
    openUploadStream: vi.fn(),
    openDownloadStream: vi.fn(),
    find: vi.fn(),
    delete: vi.fn(),
  };

  /** Constructable stand-in for mongoose.mongo.GridFSBucket. */
  class MockGridFSBucket {
    openUploadStream = mockBucket.openUploadStream;
    openDownloadStream = mockBucket.openDownloadStream;
    find = mockBucket.find;
    delete = mockBucket.delete;
  }

  /** Constructable stand-in for mongoose.Types.ObjectId. */
  function MockObjectId(value: string) {
    return { toString: () => value, value };
  }

  return {
    __mockBucket: mockBucket,
    default: {
      connection: { readyState: 1, db: {} },
      mongo: {
        GridFSBucket: MockGridFSBucket,
      },
      Types: {
        ObjectId: MockObjectId,
      },
    },
  };
});

vi.mock('fs', () => ({
  default: {
    createReadStream: vi.fn(() => ({
      pipe: vi.fn(),
      on: vi.fn(),
    })),
  },
}));

import mongoose from 'mongoose';
import fs from 'fs';
import { mongoUploadService } from '../mongoUploadService.js';
import { AppError } from '../../../../core/errors/AppError.js';

// The shared GridFS bucket mock exposed by the mongoose mock factory.
const mockBucket = (await import('mongoose') as any).__mockBucket as {
  openUploadStream: ReturnType<typeof vi.fn>;
  openDownloadStream: ReturnType<typeof vi.fn>;
  find: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

describe('mongoUploadService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (mongoose.connection as any).readyState = 1;
    (mongoose.connection as any).db = {};
  });

  describe('storePdf', () => {
    it('should stream the temp file into GridFS and return the file id and size', async () => {
      const uploadStream = {
        id: { toString: () => 'file-123' },
        length: 1024,
        on: vi.fn((event: string, cb: () => void) => {
          if (event === 'finish') cb();
          return uploadStream;
        }),
      };
      mockBucket.openUploadStream.mockReturnValue(uploadStream);

      const result = await mongoUploadService.storePdf('/tmp/x.pdf', 'guide.pdf', 'application/pdf');

      expect(mockBucket.openUploadStream).toHaveBeenCalledWith('guide.pdf', {
        contentType: 'application/pdf',
        metadata: { uploadedAt: expect.any(Date) },
      });
      expect(fs.createReadStream).toHaveBeenCalledWith('/tmp/x.pdf');
      expect(result).toEqual({ fileId: 'file-123', size: 1024 });
    });

    it('should reject when the GridFS upload stream errors', async () => {
      const uploadStream = {
        id: { toString: () => 'file-123' },
        length: 0,
        on: vi.fn((event: string, cb: (err?: Error) => void) => {
          if (event === 'error') cb(new Error('gridfs down'));
          return uploadStream;
        }),
      };
      mockBucket.openUploadStream.mockReturnValue(uploadStream);

      await expect(mongoUploadService.storePdf('/tmp/x.pdf', 'guide.pdf', 'application/pdf'))
        .rejects.toThrow('gridfs down');
    });

    it('should throw 503 when the database is not connected', async () => {
      (mongoose.connection as any).readyState = 0;

      await expect(mongoUploadService.storePdf('/tmp/x.pdf', 'guide.pdf', 'application/pdf'))
        .rejects.toBeInstanceOf(AppError);
    });
  });

  describe('getPdfInfo', () => {
    it('should return normalized metadata when the file exists', async () => {
      mockBucket.find.mockReturnValue({
        toArray: () =>
          Promise.resolve([
            { _id: { toString: () => 'file-123' }, filename: 'guide.pdf', length: 44, contentType: 'application/pdf' },
          ]),
      });

      const info = await mongoUploadService.getPdfInfo('file-123');

      expect(info).toEqual({
        fileId: 'file-123',
        filename: 'guide.pdf',
        length: 44,
        contentType: 'application/pdf',
      });
    });

    it('should return null when the file does not exist', async () => {
      mockBucket.find.mockReturnValue({ toArray: () => Promise.resolve([]) });

      const info = await mongoUploadService.getPdfInfo('missing');

      expect(info).toBeNull();
    });

    it('should throw 400 for an invalid object id', async () => {
      mockBucket.find.mockImplementation(() => {
        throw new AppError(400, 'Invalid PDF id.');
      });

      await expect(mongoUploadService.getPdfInfo('not-an-id')).rejects.toThrow('Invalid PDF id.');
    });
  });

  describe('openDownloadStream', () => {
    it('should return the download stream and info for an existing file', async () => {
      mockBucket.find.mockReturnValue({
        toArray: () =>
          Promise.resolve([
            { _id: { toString: () => 'file-123' }, filename: 'guide.pdf', length: 44, contentType: 'application/pdf' },
          ]),
      });
      const downloadStream = { on: vi.fn(), pipe: vi.fn() };
      mockBucket.openDownloadStream.mockReturnValue(downloadStream);

      const result = await mongoUploadService.openDownloadStream('file-123');

      expect(mockBucket.openDownloadStream).toHaveBeenCalled();
      expect(result.stream).toBe(downloadStream);
      expect(result.info.filename).toBe('guide.pdf');
    });

    it('should throw 404 when the file is missing', async () => {
      mockBucket.find.mockReturnValue({ toArray: () => Promise.resolve([]) });

      await expect(mongoUploadService.openDownloadStream('missing')).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe('deletePdf', () => {
    it('should delete the file from GridFS', async () => {
      mockBucket.delete.mockResolvedValue(undefined);

      await mongoUploadService.deletePdf('file-123');

      expect(mockBucket.delete).toHaveBeenCalled();
    });

    it('should swallow not-found errors', async () => {
      mockBucket.delete.mockRejectedValue(new Error('File not found'));

      await expect(mongoUploadService.deletePdf('missing')).resolves.toBeUndefined();
    });

    it('should rethrow other delete errors', async () => {
      mockBucket.delete.mockRejectedValue(new Error('storage failure'));

      await expect(mongoUploadService.deletePdf('file-123')).rejects.toThrow('storage failure');
    });
  });
});
