import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  formatFileSize,
  parseFileSizeToBytes,
  getYouTubeThumbnailUrl,
  autoPopulateBrochureMetadata
} from '../autoCalculate.js';

describe('formatFileSize', () => {
  it('should return 0 Bytes for zero', () => {
    expect(formatFileSize(0)).toBe('0 Bytes');
  });

  it('should format bytes, KB, MB, GB', () => {
    expect(formatFileSize(500)).toBe('500 Bytes');
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1024 * 1024)).toBe('1 MB');
    expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
  });

  it('should handle fractional sizes', () => {
    expect(formatFileSize(1536)).toBe('1.5 KB');
  });
});

describe('parseFileSizeToBytes', () => {
  it('should parse size strings with units', () => {
    expect(parseFileSizeToBytes('1 KB')).toBe(1024);
    expect(parseFileSizeToBytes('2MB')).toBe(2 * 1024 * 1024);
    expect(parseFileSizeToBytes('1.5 GB')).toBe(1.5 * 1024 * 1024 * 1024);
  });

  it('should default to bytes', () => {
    expect(parseFileSizeToBytes('512')).toBe(512);
  });

  it('should return 0 for invalid input', () => {
    expect(parseFileSizeToBytes('abc')).toBe(0);
    expect(parseFileSizeToBytes('')).toBe(0);
  });
});

describe('getYouTubeThumbnailUrl', () => {
  it('should return default quality thumbnail', () => {
    expect(getYouTubeThumbnailUrl('abc123xyz')).toBe('https://img.youtube.com/vi/abc123xyz/hqdefault.jpg');
  });

  it('should return specified quality', () => {
    expect(getYouTubeThumbnailUrl('abc123xyz', 'maxresdefault'))
      .toBe('https://img.youtube.com/vi/abc123xyz/maxresdefault.jpg');
  });
});

describe('autoPopulateBrochureMetadata', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should format file size and return page count', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = await autoPopulateBrochureMetadata('https://example.com/brochure.pdf', 2 * 1024 * 1024);
    expect(result.fileSize).toBe('2 MB');
    expect(result.totalPages).toBe(0); // placeholder implementation
  });
});
