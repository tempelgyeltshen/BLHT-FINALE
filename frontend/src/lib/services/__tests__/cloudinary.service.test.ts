import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cloudinaryService } from '../cloudinary.service';
import type { CloudinarySignature } from '../cloudinary.service';

// ---------------------------------------------------------------------------
// Mock the API client (only api.post is used, for the signature endpoint).
// ---------------------------------------------------------------------------
const { mockApiPost } = vi.hoisted(() => ({ mockApiPost: vi.fn() }));

vi.mock('../../api/client', () => ({
  api: { post: mockApiPost }
}));

// ---------------------------------------------------------------------------
// Controllable fake XMLHttpRequest so we can assert request shape and drive
// responses for the single-upload, chunked-upload and retry code paths.
// ---------------------------------------------------------------------------
class MockXHR {
  static instances: MockXHR[] = [];

  url = '';
  method = '';
  headers: Record<string, string> = {};
  formData: FormData | null = null;
  status = 0;
  responseText = '';
  timeout = 0;

  upload: {
    onprogress: ((e: { lengthComputable: boolean; loaded: number; total: number }) => void) | null;
  } = { onprogress: null };

  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  ontimeout: (() => void) | null = null;

  open(method: string, url: string) {
    this.method = method;
    this.url = url;
  }

  setRequestHeader(name: string, value: string) {
    this.headers[name] = value;
  }

  send(body: FormData) {
    this.formData = body;
    MockXHR.instances.push(this);
  }
}

const flush = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

function respond(instance: MockXHR, status: number, body: unknown) {
  instance.status = status;
  instance.responseText = JSON.stringify(body);
  instance.onload?.();
}

const signature: CloudinarySignature = {
  signature: 'sig-1',
  timestamp: 1700000000,
  cloud_name: 'demo',
  api_key: 'key-1',
  folder: 'blht/media'
};

const uploadResult = {
  secure_url: 'https://res.cloudinary.com/demo/video/upload/v1/sample.mp4',
  public_id: 'blht/media/sample',
  resource_type: 'video',
  format: 'mp4',
  bytes: 1024,
  created_at: '2024-01-01T00:00:00Z'
} as const;

const CHUNK_SIZE = 20 * 1024 * 1024;
// NOTE: only used to SIZE the chunked test fixtures (120/105 MB) below — it is
// intentionally NOT a mirror of the service's real 20 MB chunk threshold.
const CHUNKED_THRESHOLD = 100 * 1024 * 1024;

/** Creates a File whose reported size is `size` without allocating memory. */
function fileOfSize(name: string, type: string, size: number): File {
  const file = new File(['x'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

beforeEach(() => {
  mockApiPost.mockReset();
  mockApiPost.mockResolvedValue(signature);
  MockXHR.instances = [];
  vi.stubGlobal('XMLHttpRequest', MockXHR);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getUploadSignature', () => {
  it('parses the flat signature object returned by the backend', async () => {
    const result = await cloudinaryService.getUploadSignature('custom/folder', 'video', 'my-id');

    expect(mockApiPost).toHaveBeenCalledWith('/api/cloudinary/signature', {
      folder: 'custom/folder',
      resource_type: 'video',
      public_id: 'my-id'
    });
    // The backend returns a FLAT object (not wrapped in { data }).
    expect(result).toEqual(signature);
    expect(result.api_key).toBe('key-1');
    expect(result.cloud_name).toBe('demo');
  });

  it('uses default folder and auto resource type', async () => {
    await cloudinaryService.getUploadSignature();

    expect(mockApiPost).toHaveBeenCalledWith('/api/cloudinary/signature', {
      folder: 'blht/media',
      resource_type: 'auto',
      public_id: undefined
    });
  });
});

describe('uploadFile (single request)', () => {
  it('POSTs the file to the correct endpoint with signed fields', async () => {
    const file = fileOfSize('clip.mp4', 'video/mp4', 1024 * 1024);

    const promise = cloudinaryService.uploadFile(file, { folder: 'blht/media' });
    await flush();

    expect(MockXHR.instances).toHaveLength(1);
    const xhr = MockXHR.instances[0];
    expect(xhr.method).toBe('POST');
    expect(xhr.url).toBe('https://api.cloudinary.com/v1_1/demo/video/upload');
    expect(xhr.formData?.get('api_key')).toBe('key-1');
    expect(xhr.formData?.get('timestamp')).toBe('1700000000');
    expect(xhr.formData?.get('signature')).toBe('sig-1');
    expect(xhr.formData?.get('folder')).toBe('blht/media');
    expect(xhr.formData?.get('file')).toBeInstanceOf(Blob);

    respond(xhr, 200, uploadResult);
    await expect(promise).resolves.toEqual(uploadResult);
  });

  it('includes public_id in the form when provided', async () => {
    const file = fileOfSize('img.jpg', 'image/jpeg', 1000);

    const promise = cloudinaryService.uploadFile(file, { publicId: 'hero.jpg' });
    await flush();

    const xhr = MockXHR.instances[0];
    expect(xhr.formData?.get('public_id')).toBe('hero.jpg');
    expect(xhr.url).toBe('https://api.cloudinary.com/v1_1/demo/image/upload');

    respond(xhr, 200, uploadResult);
    await promise;
  });

  it('forwards eager to the signature request and upload form', async () => {
    const file = fileOfSize('clip.mp4', 'video/mp4', 1024 * 1024);
    const eager = 'w_640,h_360,c_fill,so_5/jpg';

    const promise = cloudinaryService.uploadFile(file, {
      folder: 'blht/videos',
      resourceType: 'video',
      eager
    });
    await flush();

    // The eager string is sent to the backend so it is included in the signature.
    expect(mockApiPost).toHaveBeenCalledWith('/api/cloudinary/signature', {
      folder: 'blht/videos',
      resource_type: 'video',
      public_id: undefined,
      eager
    });

    // And echoed as a form field on the Cloudinary upload request.
    const xhr = MockXHR.instances[0];
    expect(xhr.formData?.get('eager')).toBe(eager);
    expect(xhr.url).toBe('https://api.cloudinary.com/v1_1/demo/video/upload');

    respond(xhr, 200, { ...uploadResult, eager: [{ secure_url: 'https://res.cloudinary.com/demo/video/upload/so_5/v1/poster.jpg', format: 'jpg' }] });
    const result = await promise;
    expect(result.eager?.[0]?.secure_url).toContain('poster.jpg');
  });

  it('does not send eager when not requested', async () => {
    const file = fileOfSize('img.jpg', 'image/jpeg', 1000);

    const promise = cloudinaryService.uploadFile(file);
    await flush();

    expect(mockApiPost).toHaveBeenCalledWith('/api/cloudinary/signature', {
      folder: 'blht/media',
      resource_type: 'auto',
      public_id: undefined
    });
    expect(MockXHR.instances[0].formData?.get('eager')).toBeNull();

    respond(MockXHR.instances[0], 200, uploadResult);
    await promise;
  });

  it('reports upload progress', async () => {
    const file = fileOfSize('clip.mp4', 'video/mp4', 100);
    const progressEvents: Array<{ loaded: number; total: number; percentage: number }> = [];

    const promise = cloudinaryService.uploadFile(file, {
      onProgress: (p) => progressEvents.push(p)
    });
    await flush();

    const xhr = MockXHR.instances[0];
    xhr.upload.onprogress?.({ lengthComputable: true, loaded: 40, total: 100 });
    xhr.upload.onprogress?.({ lengthComputable: true, loaded: 100, total: 100 });

    expect(progressEvents).toEqual([
      { loaded: 40, total: 100, percentage: 40 },
      { loaded: 100, total: 100, percentage: 100 }
    ]);

    respond(xhr, 200, uploadResult);
    await promise;
  });

  it('rejects on a non-200 response', async () => {
    const file = fileOfSize('img.jpg', 'image/jpeg', 1000);

    const promise = cloudinaryService.uploadFile(file);
    await flush();

    respond(MockXHR.instances[0], 401, { error: { message: 'Invalid signature' } });
    await expect(promise).rejects.toThrow(/Cloudinary upload failed \(401\)/);
  });
});

describe('uploadFile (chunked upload)', () => {
  it('routes files over 100 MB to the chunked path with correct Content-Range headers', async () => {
    const total = CHUNKED_THRESHOLD + 20 * 1024 * 1024; // 120 MB -> 6 chunks of 20 MB
    const file = fileOfSize('big.mp4', 'video/mp4', total);
    const chunkCount = Math.ceil(total / CHUNK_SIZE);
    expect(chunkCount).toBe(6);

    const progressEvents: Array<{ percentage: number }> = [];
    const promise = cloudinaryService.uploadFile(file, {
      onProgress: (p) => progressEvents.push(p)
    });
    await flush();

    const uploadIds = new Set<string>();

    for (let i = 0; i < chunkCount; i++) {
      expect(MockXHR.instances.length).toBe(i + 1);
      const xhr = MockXHR.instances[i];

      expect(xhr.url).toBe('https://api.cloudinary.com/v1_1/demo/video/upload');
      expect(xhr.headers['Content-Range']).toBe(
        `bytes ${i * CHUNK_SIZE}-${Math.min((i + 1) * CHUNK_SIZE, total) - 1}/${total}`
      );
      uploadIds.add(xhr.headers['X-Unique-Upload-Id']);
      expect(xhr.formData?.get('file')).toBeInstanceOf(Blob);
      expect(xhr.formData?.get('signature')).toBe('sig-1');
      // Each chunk sizes its own timeout (~20 MB at 64 KB/s + 2 min buffer).
      expect(xhr.timeout).toBe(440_000);

      // Intermediate chunks return done:false; the final chunk returns done:true.
      const isLast = i === chunkCount - 1;
      respond(
        xhr,
        200,
        isLast
          ? { ...uploadResult, done: true }
          : { done: false }
      );
      // Simulate the full chunk being uploaded so cumulative progress is reported.
      const chunkBytes = Math.min((i + 1) * CHUNK_SIZE, total) - i * CHUNK_SIZE;
      xhr.upload.onprogress?.({ lengthComputable: true, loaded: chunkBytes, total: chunkBytes });
      await flush();
    }

    // One upload id reused across every chunk of the same file.
    expect(uploadIds.size).toBe(1);
    expect(progressEvents[progressEvents.length - 1].percentage).toBe(100);
    await expect(promise).resolves.toEqual(expect.objectContaining(uploadResult));
  });

  it('handles a trailing partial chunk smaller than CHUNK_SIZE', async () => {
    const total = CHUNKED_THRESHOLD + 5 * 1024 * 1024; // 105 MB -> 6 chunks (last is 5 MB)
    const file = fileOfSize('partial.mp4', 'video/mp4', total);
    const chunkCount = Math.ceil(total / CHUNK_SIZE);
    expect(chunkCount).toBe(6);

    const promise = cloudinaryService.uploadFile(file);
    await flush();

    for (let i = 0; i < chunkCount; i++) {
      const xhr = MockXHR.instances[i];
      const end = Math.min((i + 1) * CHUNK_SIZE, total) - 1;
      expect(xhr.headers['Content-Range']).toBe(`bytes ${i * CHUNK_SIZE}-${end}/${total}`);
      respond(xhr, 200, i === chunkCount - 1 ? { ...uploadResult, done: true } : { done: false });
      await flush();
    }

    await expect(promise).resolves.toEqual(expect.objectContaining(uploadResult));
  });

  it('retries a failed chunk with exponential backoff and refreshes the signature on 401', async () => {
    vi.useFakeTimers();
    try {
      const total = CHUNKED_THRESHOLD + 20 * 1024 * 1024; // 120 MB
      const file = fileOfSize('retry.mp4', 'video/mp4', total);

      const freshSignature: CloudinarySignature = { ...signature, signature: 'sig-2' };
      mockApiPost
        .mockResolvedValueOnce(signature) // initial signature
        .mockResolvedValueOnce(freshSignature); // refreshed after 401

      const promise = cloudinaryService.uploadFile(file);
      await vi.advanceTimersByTimeAsync(0);

      // First attempt of chunk 0 -> 401 (signature expired).
      respond(MockXHR.instances[0], 401, { error: { message: 'Invalid signature' } });
      await vi.advanceTimersByTimeAsync(0);

      // Signature endpoint was called a second time to refresh.
      expect(mockApiPost).toHaveBeenCalledTimes(2);

      // Advance past the exponential backoff (500ms * 2^1) so the retry fires.
      await vi.advanceTimersByTimeAsync(1100);
      expect(MockXHR.instances.length).toBe(2);
      expect(MockXHR.instances[1].formData?.get('signature')).toBe('sig-2');

      // Complete the remaining chunks. Chunk 0 consumed 2 instances (401 + retry),
      // so the 6 chunks map to instances[1..6], with done:true only on the last.
      for (let i = 1; i <= 6; i++) {
        const xhr = MockXHR.instances[i];
        respond(xhr, 200, i === 6 ? { ...uploadResult, done: true } : { done: false });
        await vi.advanceTimersByTimeAsync(0);
      }

      await expect(promise).resolves.toEqual(expect.objectContaining(uploadResult));
    } finally {
      vi.useRealTimers();
    }
  });

  it('rejects when a chunk fails with a network error', async () => {
    vi.useFakeTimers();
    try {
      const total = CHUNKED_THRESHOLD + 20 * 1024 * 1024; // 120 MB
      const file = fileOfSize('net-error.mp4', 'video/mp4', total);

      const promise = cloudinaryService.uploadFile(file);
      // Attach a handler immediately so the rejection is not flagged as
      // unhandled during the fake-timer backoff race.
      promise.catch(() => undefined);
      await vi.advanceTimersByTimeAsync(0);

      // Fire onerror (network failure) and advance past each backoff so the
      // next attempt starts; all 3 attempts fail -> upload rejects.
      for (let attempt = 0; attempt < 3; attempt++) {
        MockXHR.instances[attempt].onerror?.();
        await vi.advanceTimersByTimeAsync(attempt === 0 ? 1100 : 2100);
      }

      await expect(promise).rejects.toThrow(/network error/i);
    } finally {
      vi.useRealTimers();
    }
  });

  it('rejects when a chunk times out', async () => {
    vi.useFakeTimers();
    try {
      const total = CHUNKED_THRESHOLD + 20 * 1024 * 1024; // 120 MB
      const file = fileOfSize('timeout.mp4', 'video/mp4', total);

      const promise = cloudinaryService.uploadFile(file);
      // Attach a handler immediately so the rejection is not flagged as
      // unhandled during the fake-timer backoff race.
      promise.catch(() => undefined);
      await vi.advanceTimersByTimeAsync(0);

      // Fire ontimeout and advance past each backoff; all 3 attempts time out.
      for (let attempt = 0; attempt < 3; attempt++) {
        MockXHR.instances[attempt].ontimeout?.();
        await vi.advanceTimersByTimeAsync(attempt === 0 ? 1100 : 2100);
      }

      await expect(promise).rejects.toThrow(/timed out/i);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('upload timeouts', () => {
  it('gives large files a much longer overall timeout than small files', async () => {
    const small = fileOfSize('small.pdf', 'application/pdf', 5 * 1024 * 1024); // 5 MB
    const large = fileOfSize('large.pdf', 'application/pdf', 19 * 1024 * 1024); // 19 MB (still single-request)

    const p1 = cloudinaryService.uploadFile(small);
    await flush();
    const smallTimeout = MockXHR.instances[0].timeout;
    respond(MockXHR.instances[0], 200, uploadResult);
    await p1;

    const p2 = cloudinaryService.uploadFile(large);
    await flush();
    const largeTimeout = MockXHR.instances[1].timeout;
    respond(MockXHR.instances[1], 200, uploadResult);
    await p2;

    // 5 MB at the worst-case 64 KB/s + 2 min buffer ≈ 200 s; 19 MB ≈ 7 min.
    // (Anything above the 20 MB chunk threshold is chunked, where every chunk
    // gets its own 440 s timeout — asserted in the chunked tests above.)
    expect(smallTimeout).toBe(200_000);
    expect(largeTimeout).toBeGreaterThan(smallTimeout);
    expect(largeTimeout).toBeLessThanOrEqual(30 * 60 * 1000);
  });

  it('does not time out while upload progress keeps flowing (stall watchdog)', async () => {
    vi.useFakeTimers();
    try {
      const file = fileOfSize('steady.pdf', 'application/pdf', 19 * 1024 * 1024);
      const promise = cloudinaryService.uploadFile(file);
      promise.catch(() => undefined);
      await vi.advanceTimersByTimeAsync(0);

      // Keep making progress well past the old 120 s budget.
      for (let t = 0; t < 3; t++) {
        await vi.advanceTimersByTimeAsync(60_000);
        MockXHR.instances[0].upload.onprogress?.({
          lengthComputable: true,
          loaded: Math.round(((t + 1) * file.size) / 3),
          total: file.size
        });
      }

      // Still pending (no abort fired), then completes normally.
      respond(MockXHR.instances[0], 200, uploadResult);
      await vi.advanceTimersByTimeAsync(0);
      await expect(promise).resolves.toEqual(expect.objectContaining(uploadResult));
    } finally {
      vi.useRealTimers();
    }
  });

  it('aborts with a timeout when NO progress is made for the stall window', async () => {
    vi.useFakeTimers();
    try {
      const file = fileOfSize('stalled.pdf', 'application/pdf', 19 * 1024 * 1024);
      const promise = cloudinaryService.uploadFile(file);
      promise.catch(() => undefined);
      await vi.advanceTimersByTimeAsync(0);

      // No progress events at all -> the stall watchdog rejects.
      await vi.advanceTimersByTimeAsync(130_000);

      await expect(promise).rejects.toThrow(/timed out/i);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('formatters', () => {
  it('formatFileSize renders human-readable sizes', () => {
    expect(cloudinaryService.formatFileSize(0)).toBe('0 Bytes');
    expect(cloudinaryService.formatFileSize(500)).toBe('500 Bytes');
    expect(cloudinaryService.formatFileSize(1024)).toBe('1 KB');
    expect(cloudinaryService.formatFileSize(5 * 1024 * 1024)).toBe('5 MB');
    expect(cloudinaryService.formatFileSize(2 * 1024 * 1024 * 1024)).toBe('2 GB');
  });

  it('formatDuration renders MM:SS and HH:MM:SS', () => {
    expect(cloudinaryService.formatDuration(0)).toBe('00:00');
    expect(cloudinaryService.formatDuration(65)).toBe('01:05');
    expect(cloudinaryService.formatDuration(3661)).toBe('01:01:01');
  });
});
