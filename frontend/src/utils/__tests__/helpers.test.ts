import { describe, expect, it } from 'vitest';
import { isValidHttpUrl, slugify } from '../helpers';

describe('isValidHttpUrl', () => {
  it('accepts valid https URLs', () => {
    expect(isValidHttpUrl('https://res.cloudinary.com/oh6ks8gw/video/upload/v1/blht/videos/x.mp4')).toBe(true);
    expect(isValidHttpUrl('http://example.com/file.pdf')).toBe(true);
    expect(isValidHttpUrl('  https://example.com  ')).toBe(true);
  });

  it('rejects non-http protocols', () => {
    expect(isValidHttpUrl('ftp://example.com/file.pdf')).toBe(false);
    expect(isValidHttpUrl('javascript:alert(1)')).toBe(false);
    expect(isValidHttpUrl('data:video/mp4;base64,AAAA')).toBe(false);
    expect(isValidHttpUrl('blob:https://example.com/uuid')).toBe(false);
  });

  it('rejects malformed or empty values', () => {
    expect(isValidHttpUrl('')).toBe(false);
    expect(isValidHttpUrl('   ')).toBe(false);
    expect(isValidHttpUrl('not-a-url')).toBe(false);
    expect(isValidHttpUrl('https://')).toBe(false);
    expect(isValidHttpUrl('example.com/file.pdf')).toBe(false);
  });
});

describe('slugify', () => {
  it('converts strings to URL-safe slugs', () => {
    expect(slugify('Tiger\'s Nest Monastery')).toBe('tiger-s-nest-monastery');
    expect(slugify('  Paro Taktsang  ')).toBe('paro-taktsang');
    expect(slugify('Bhutan: Land of Happiness!')).toBe('bhutan-land-of-happiness');
  });
});
