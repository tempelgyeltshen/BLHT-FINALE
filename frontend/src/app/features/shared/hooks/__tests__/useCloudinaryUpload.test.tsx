import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useCloudinaryUpload } from '../useCloudinaryUpload';
import type { CloudinaryUploadResult } from '../../../../../lib/services/cloudinary.service';

// ---------------------------------------------------------------------------
// Mock the Cloudinary service so the hook's state machine is tested in
// isolation from actual network behavior.
// ---------------------------------------------------------------------------
const { mockUploadFile, mockFormatFileSize } = vi.hoisted(() => ({
  mockUploadFile: vi.fn(),
  mockFormatFileSize: vi.fn()
}));

vi.mock('../../../../../lib/services/cloudinary.service', () => ({
  cloudinaryService: {
    uploadFile: mockUploadFile,
    formatFileSize: mockFormatFileSize
  }
}));

const result: CloudinaryUploadResult = {
  secure_url: 'https://res.cloudinary.com/demo/video/upload/v1/sample.mp4',
  public_id: 'blht/media/sample',
  resource_type: 'video',
  format: 'mp4',
  bytes: 1024,
  created_at: '2024-01-01T00:00:00Z'
};

const makeFile = (name = 'clip.mp4', type = 'video/mp4', size = 1024) => {
  const file = new File(['x'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

beforeEach(() => {
  mockUploadFile.mockReset();
  mockFormatFileSize.mockReset();
});

describe('useCloudinaryUpload', () => {
  it('resets state, uploads, and stores the success result', async () => {
    mockUploadFile.mockResolvedValue(result);
    const file = makeFile();

    const { result: hook } = renderHook(() => useCloudinaryUpload());

    let returned: CloudinaryUploadResult | undefined;
    await act(async () => {
      returned = await hook.current.uploadFile(file, { folder: 'blht/media' });
    });

    expect(mockUploadFile).toHaveBeenCalledWith(
      file,
      expect.objectContaining({ folder: 'blht/media' })
    );
    expect(returned).toEqual(result);
    expect(hook.current.uploadSuccess).toEqual(result);
    expect(hook.current.isUploading).toBe(false);
    expect(hook.current.uploadError).toBeNull();
    expect(hook.current.uploadProgress).toBeNull();
  });

  it('surfaces upload errors and rethrows', async () => {
    mockUploadFile.mockRejectedValue(new Error('Upload failed'));
    const file = makeFile();

    const { result: hook } = renderHook(() => useCloudinaryUpload());

    await act(async () => {
      await expect(hook.current.uploadFile(file)).rejects.toThrow('Upload failed');
    });

    expect(hook.current.uploadError).toBe('Upload failed');
    expect(hook.current.isUploading).toBe(false);
    expect(hook.current.uploadSuccess).toBeNull();
  });

  it('reports progress while uploading', async () => {
    let resolveUpload!: (value: CloudinaryUploadResult) => void;
    mockUploadFile.mockImplementation(
      (_file: File, options?: { onProgress?: (p: { loaded: number; total: number; percentage: number }) => void }) => {
        options?.onProgress?.({ loaded: 50, total: 100, percentage: 50 });
        return new Promise<CloudinaryUploadResult>((resolve) => {
          resolveUpload = resolve;
        });
      }
    );
    const file = makeFile();

    const { result: hook } = renderHook(() => useCloudinaryUpload());

    let uploadPromise: Promise<CloudinaryUploadResult>;
    act(() => {
      uploadPromise = hook.current.uploadFile(file);
    });

    expect(hook.current.isUploading).toBe(true);
    expect(hook.current.uploadProgress).toEqual({ loaded: 50, total: 100, percentage: 50 });

    await act(async () => {
      resolveUpload(result);
      await uploadPromise;
    });

    expect(hook.current.uploadSuccess).toEqual(result);
    expect(hook.current.isUploading).toBe(false);
    expect(hook.current.uploadProgress).toBeNull();
  });

  it('rejects files exceeding the type-specific size limit without uploading', async () => {
    mockFormatFileSize.mockReturnValue('1 GB');
    // Videos are capped at 1 GB (1024 * 1024 * 1024 bytes).
    const oversizedVideo = makeFile('huge.mp4', 'video/mp4', 2 * 1024 * 1024 * 1024);

    const { result: hook } = renderHook(() => useCloudinaryUpload());

    await act(async () => {
      await expect(hook.current.uploadFile(oversizedVideo)).rejects.toThrow(
        'File size exceeds maximum allowed size of 1 GB'
      );
    });

    expect(mockUploadFile).not.toHaveBeenCalled();
    expect(hook.current.uploadError).toContain('File size exceeds maximum allowed size');
    expect(hook.current.isUploading).toBe(false);
  });

  it('applies the correct size caps per file type', async () => {
    mockUploadFile.mockResolvedValue(result);
    mockFormatFileSize.mockReturnValue('MAX');

    const { result: hook } = renderHook(() => useCloudinaryUpload());

    // Image cap is 100 MB -> a 200 MB image must be rejected.
    const bigImage = makeFile('big.jpg', 'image/jpeg', 200 * 1024 * 1024);
    await act(async () => {
      await expect(hook.current.uploadFile(bigImage)).rejects.toThrow();
    });

    // PDF cap is 5 GB -> a 2 GB PDF is allowed through to the service.
    const bigPdf = makeFile('manual.pdf', 'application/pdf', 2 * 1024 * 1024 * 1024);
    await act(async () => {
      await hook.current.uploadFile(bigPdf);
    });
    expect(mockUploadFile).toHaveBeenCalledTimes(1);
  });

  it('resetUpload clears all upload state', async () => {
    mockUploadFile.mockResolvedValue(result);
    const file = makeFile();

    const { result: hook } = renderHook(() => useCloudinaryUpload());

    await act(async () => {
      await hook.current.uploadFile(file);
    });
    expect(hook.current.uploadSuccess).toEqual(result);

    act(() => {
      hook.current.resetUpload();
    });

    expect(hook.current.uploadSuccess).toBeNull();
    expect(hook.current.uploadError).toBeNull();
    expect(hook.current.uploadProgress).toBeNull();
    expect(hook.current.isUploading).toBe(false);
  });
});
