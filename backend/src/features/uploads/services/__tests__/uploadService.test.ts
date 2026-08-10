import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';

// Set env before imports
process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
process.env.CLOUDINARY_API_KEY = 'test-key';
process.env.CLOUDINARY_API_SECRET = 'test-secret';

// Mock env module to allow runtime changes
const mockEnv = {
  cloudinaryCloudName: 'test-cloud',
  cloudinaryApiKey: 'test-key',
  cloudinaryApiSecret: 'test-secret',
};
vi.mock('../../../../core/config/env.js', () => ({ env: mockEnv }));

// Mock cloudinary
const mockUploadStream = vi.fn();
const mockDestroy = vi.fn();
vi.mock('cloudinary', () => ({
  v2: {
    config: vi.fn(),
    uploader: {
      upload_stream: mockUploadStream,
      destroy: mockDestroy,
    }
  }
}));

// Mock fs
vi.mock('fs', () => ({
  default: {
    createReadStream: vi.fn(() => ({
      pipe: vi.fn(),
      on: vi.fn(),
    })),
    existsSync: vi.fn(() => true),
    unlinkSync: vi.fn(),
  }
}));

const { CloudinaryUploadProvider } = await import('../uploadService.js');

type Provider = InstanceType<typeof CloudinaryUploadProvider>;

describe('uploadService', () => {
  let provider: Provider;

  beforeEach(() => {
    vi.clearAllMocks();
    provider = new CloudinaryUploadProvider();
  });

  describe('CloudinaryUploadProvider', () => {
    describe('store', () => {
      it('should throw 503 if Cloudinary is not configured', async () => {
        const origName = mockEnv.cloudinaryCloudName;
        mockEnv.cloudinaryCloudName = '';

        const p = new CloudinaryUploadProvider();
        const mockFile = { mimetype: 'image/jpeg', path: '/tmp/test.jpg', originalname: 'test.jpg', size: 1024 } as any;

        await expect(p.store(mockFile, 'images')).rejects.toThrow('Cloudinary is not configured');

        mockEnv.cloudinaryCloudName = origName;
      });

      it('should determine resource_type as raw for PDFs', async () => {
        mockUploadStream.mockImplementation((_opts: any, callback: Function) => {
          // Simulate successful upload
          callback(null, { public_id: 'test/pdf', secure_url: 'https://example.com/test.pdf' });
          return { pipe: vi.fn() };
        });

        const mockFile = { mimetype: 'application/pdf', path: '/tmp/test.pdf', originalname: 'test.pdf', size: 5000 } as any;

        const result = await provider.store(mockFile, 'brochures');

        expect(result.key).toBe('test/pdf');
        expect(result.url).toBe('https://example.com/test.pdf');
        expect(result.originalName).toBe('test.pdf');
        expect(result.mimeType).toBe('application/pdf');
        expect(result.size).toBe(5000);

        // Verify resource_type was 'raw' for PDF
        const callArgs = mockUploadStream.mock.calls[0];
        expect(callArgs[0].resource_type).toBe('raw');
      });

      it('should determine resource_type as video for video files', async () => {
        mockUploadStream.mockImplementation((_opts: any, callback: Function) => {
          callback(null, { public_id: 'test/video', secure_url: 'https://example.com/test.mp4' });
          return { pipe: vi.fn() };
        });

        const mockFile = { mimetype: 'video/mp4', path: '/tmp/test.mp4', originalname: 'test.mp4', size: 50000 } as any;

        const result = await provider.store(mockFile, 'videos');

        expect(result.key).toBe('test/video');
        const callArgs = mockUploadStream.mock.calls[0];
        expect(callArgs[0].resource_type).toBe('video');
      });

      it('should determine resource_type as image for image files', async () => {
        mockUploadStream.mockImplementation((_opts: any, callback: Function) => {
          callback(null, { public_id: 'test/image', secure_url: 'https://example.com/test.jpg' });
          return { pipe: vi.fn() };
        });

        const mockFile = { mimetype: 'image/jpeg', path: '/tmp/test.jpg', originalname: 'test.jpg', size: 2000 } as any;

        const result = await provider.store(mockFile, 'gallery');

        expect(result.key).toBe('test/image');
        const callArgs = mockUploadStream.mock.calls[0];
        expect(callArgs[0].resource_type).toBe('image');
      });

      it('should clean up temporary file after upload', async () => {
        mockUploadStream.mockImplementation((_opts: any, callback: Function) => {
          callback(null, { public_id: 'test', secure_url: 'https://example.com/test' });
          return { pipe: vi.fn() };
        });

        const mockFile = { mimetype: 'image/jpeg', path: '/tmp/test.jpg', originalname: 'test.jpg', size: 1000 } as any;

        await provider.store(mockFile, 'images');

        expect(fs.existsSync).toHaveBeenCalledWith('/tmp/test.jpg');
        expect(fs.unlinkSync).toHaveBeenCalledWith('/tmp/test.jpg');
      });
    });

    describe('remove', () => {
      it('should call cloudinary destroy with correct params', async () => {
        mockDestroy.mockResolvedValue({ result: 'ok' });

        await provider.remove('test/public_id', 'image');

        expect(mockDestroy).toHaveBeenCalledWith('test/public_id', { resource_type: 'image' });
      });

      it('should default resource_type to image', async () => {
        mockDestroy.mockResolvedValue({ result: 'ok' });

        await provider.remove('test/id');

        expect(mockDestroy).toHaveBeenCalledWith('test/id', { resource_type: 'image' });
      });

      it('should handle video resource_type', async () => {
        mockDestroy.mockResolvedValue({ result: 'ok' });

        await provider.remove('test/video', 'video');

        expect(mockDestroy).toHaveBeenCalledWith('test/video', { resource_type: 'video' });
      });

      it('should handle raw resource_type', async () => {
        mockDestroy.mockResolvedValue({ result: 'ok' });

        await provider.remove('test/file', 'raw');

        expect(mockDestroy).toHaveBeenCalledWith('test/file', { resource_type: 'raw' });
      });
    });
  });
});
