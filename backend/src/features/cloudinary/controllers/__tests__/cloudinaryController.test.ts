import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextFunction, Request, Response } from 'express';

// Mutable env mock
const mockEnv = {
  cloudinaryCloudName: 'test-cloud',
  cloudinaryApiKey: 'test-key',
  cloudinaryApiSecret: 'test-secret',
};
vi.mock('../../../../core/config/env.js', () => ({ env: mockEnv }));

// Mock cloudinary
const mockDestroy = vi.fn();
const mockApiSignRequest = vi.fn();
vi.mock('cloudinary', () => ({
  v2: {
    config: vi.fn(),
    utils: {
      api_sign_request: mockApiSignRequest,
    },
    uploader: {
      destroy: mockDestroy,
    },
  }
}));

const { getUploadSignature, deleteCloudinaryResource } = await import('../cloudinaryController.js');

// Express mock helper (controller only calls res.json on success)
function mockRes() {
  const res = {
    json: vi.fn(),
  } as unknown as Response;
  return res;
}

function mockReq(body: unknown): Request {
  return { body } as Request;
}

function mockNext(): NextFunction {
  return vi.fn() as unknown as NextFunction;
}

describe('cloudinaryController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEnv.cloudinaryCloudName = 'test-cloud';
    mockEnv.cloudinaryApiKey = 'test-key';
    mockEnv.cloudinaryApiSecret = 'test-secret';
    mockApiSignRequest.mockReturnValue('fake-signature');
  });

  describe('getUploadSignature', () => {
    it('should return 503 when Cloudinary is not configured', async () => {
      mockEnv.cloudinaryCloudName = '';
      const next = mockNext();

      await getUploadSignature(mockReq({}), mockRes(), next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 503 }));
    });

    it('should return 503 when api key missing', async () => {
      mockEnv.cloudinaryApiKey = '';
      const next = mockNext();
      await getUploadSignature(mockReq({}), mockRes(), next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 503 }));
    });

    it('should return 503 when api secret missing', async () => {
      mockEnv.cloudinaryApiSecret = '';
      const next = mockNext();
      await getUploadSignature(mockReq({}), mockRes(), next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 503 }));
    });

    it('should generate signature covering only form fields sent to Cloudinary', async () => {
      const res = mockRes();

      await getUploadSignature(mockReq({}), res, mockNext());

      expect(mockApiSignRequest).toHaveBeenCalledTimes(1);
      const [params, secret] = mockApiSignRequest.mock.calls[0];
      expect(params.folder).toBe('blht/media');
      // resource_type lives in the URL path and upload_preset is not used —
      // they must NOT be part of the signed params or Cloudinary rejects the signature
      expect(params.resource_type).toBeUndefined();
      expect(params.upload_preset).toBeUndefined();
      expect(typeof params.timestamp).toBe('number');
      expect(secret).toBe('test-secret');

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        signature: 'fake-signature',
        cloud_name: 'test-cloud',
        api_key: 'test-key',
        folder: 'blht/media',
        resource_type: 'auto',
      }));
    });

    it('should use custom folder', async () => {
      const res = mockRes();

      await getUploadSignature(mockReq({ folder: 'custom/folder', resource_type: 'video' }), res, mockNext());

      const [params] = mockApiSignRequest.mock.calls[0];
      expect(params.folder).toBe('custom/folder');
      expect(params.resource_type).toBeUndefined();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        folder: 'custom/folder',
        resource_type: 'video',
      }));
    });

    it('should include eager in the signed params and response', async () => {
      const res = mockRes();

      await getUploadSignature(
        mockReq({ folder: 'blht/videos', resource_type: 'video', eager: 'w_640,h_360,c_fill,so_5/jpg' }),
        res,
        mockNext()
      );

      // eager is sent as a form field, so it must be part of the signed string.
      const [params] = mockApiSignRequest.mock.calls[0];
      expect(params.eager).toBe('w_640,h_360,c_fill,so_5/jpg');
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        eager: 'w_640,h_360,c_fill,so_5/jpg',
      }));
    });

    it('should omit eager from signed params when not provided', async () => {
      const res = mockRes();

      await getUploadSignature(mockReq({}), res, mockNext());

      const [params] = mockApiSignRequest.mock.calls[0];
      expect(params.eager).toBeUndefined();
      expect(res.json).toHaveBeenCalledWith(expect.not.objectContaining({ eager: expect.anything() }));
    });

    it('should include public_id when provided', async () => {
      const res = mockRes();

      await getUploadSignature(mockReq({ public_id: 'blht/media/img1' }), res, mockNext());

      const [params] = mockApiSignRequest.mock.calls[0];
      expect(params.public_id).toBe('blht/media/img1');
    });
  });

  describe('deleteCloudinaryResource', () => {
    it('should return 400 when public_id missing', async () => {
      const next = mockNext();

      await deleteCloudinaryResource(mockReq({}), mockRes(), next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
    });

    it('should return 503 when not configured', async () => {
      mockEnv.cloudinaryCloudName = '';
      const next = mockNext();

      await deleteCloudinaryResource(mockReq({ public_id: 'blht/img1' }), mockRes(), next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 503 }));
    });

    it('should return success when destroy returns ok', async () => {
      mockDestroy.mockResolvedValue({ result: 'ok' });
      const res = mockRes();

      await deleteCloudinaryResource(mockReq({ public_id: 'blht/img1' }), res, mockNext());

      expect(mockDestroy).toHaveBeenCalledWith('blht/img1', { resource_type: 'image' });
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should return success when destroy returns not found', async () => {
      mockDestroy.mockResolvedValue({ result: 'not found' });
      const res = mockRes();

      await deleteCloudinaryResource(mockReq({ public_id: 'blht/img1' }), res, mockNext());

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should return 500 when destroy returns failure', async () => {
      mockDestroy.mockResolvedValue({ result: 'invalid' });
      const next = mockNext();

      await deleteCloudinaryResource(mockReq({ public_id: 'blht/img1' }), mockRes(), next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 500 }));
    });

    it('should use provided resource_type', async () => {
      mockDestroy.mockResolvedValue({ result: 'ok' });
      const res = mockRes();

      await deleteCloudinaryResource(mockReq({ public_id: 'blht/vid1', resource_type: 'video' }), res, mockNext());

      expect(mockDestroy).toHaveBeenCalledWith('blht/vid1', { resource_type: 'video' });
    });

    it('should pass thrown errors to next', async () => {
      mockDestroy.mockRejectedValue(new Error('network error'));
      const next = mockNext();

      await deleteCloudinaryResource(mockReq({ public_id: 'blht/img1' }), mockRes(), next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
