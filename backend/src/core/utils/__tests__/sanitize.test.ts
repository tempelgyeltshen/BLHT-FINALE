import { describe, it, expect } from 'vitest';
import { sanitizeString, sanitizeObject, sanitizeEmail, sanitizePhone } from '../sanitize.js';

describe('sanitizeString', () => {
  it('should strip HTML tags but keep content', () => {
    expect(sanitizeString('<script>alert(1)</script>hello')).toBe('alert(1)hello');
    expect(sanitizeString('<b>Bold</b> text')).toBe('Bold text');
  });

  it('should strip XSS patterns', () => {
    expect(sanitizeString('javascript:alert(1)')).toBe('alert(1)');
    expect(sanitizeString('onclick=alert(1)')).toBe('alert(1)');
    expect(sanitizeString('data:text/html')).toBe('text/html');
    expect(sanitizeString('vbscript:msgbox(1)')).toBe('msgbox(1)');
    expect(sanitizeString('eval(alert(1))')).toBe('alert(1))');
    expect(sanitizeString('expression(alert(1))')).toBe('alert(1))');
  });

  it('should trim whitespace', () => {
    expect(sanitizeString('  hello world  ')).toBe('hello world');
  });

  it('should return empty string for non-string input', () => {
    expect(sanitizeString(null as unknown as string)).toBe('');
    expect(sanitizeString(undefined as unknown as string)).toBe('');
    expect(sanitizeString(42 as unknown as string)).toBe('');
  });

  it('should preserve safe strings', () => {
    expect(sanitizeString('Bhutan Land of Happiness')).toBe('Bhutan Land of Happiness');
  });
});

describe('sanitizeObject', () => {
  it('should recursively sanitize nested string values', () => {
    const input = {
      name: '<script>alert(1)</script>Bhutan',
      tags: ['<b>luxury</b>', 'culture'],
      meta: {
        description: 'javascript:alert(1)',
        count: 5,
        flag: true
      }
    };

    const result = sanitizeObject(input);

    expect(result.name).toBe('alert(1)Bhutan');
    expect(result.tags[0]).toBe('luxury');
    expect(result.tags[1]).toBe('culture');
    expect((result.meta as { description: string }).description).toBe('alert(1)');
    expect((result.meta as { count: number }).count).toBe(5);
    expect((result.meta as { flag: boolean }).flag).toBe(true);
  });

  it('should preserve non-string values', () => {
    const result = sanitizeObject({ num: 42, bool: false, nil: null });
    expect(result).toEqual({ num: 42, bool: false, nil: null });
  });
});

describe('sanitizeEmail', () => {
  it('should lowercase and trim valid emails', () => {
    expect(sanitizeEmail('  Admin@Example.COM ')).toBe('admin@example.com');
  });

  it('should return empty for invalid emails', () => {
    expect(sanitizeEmail('not-an-email')).toBe('');
    expect(sanitizeEmail('javascript:alert(1)')).toBe('');
    expect(sanitizeEmail('a@b')).toBe('');
  });

  it('should return empty for non-string input', () => {
    expect(sanitizeEmail(null as unknown as string)).toBe('');
  });
});

describe('sanitizePhone', () => {
  it('should keep digits and formatting characters', () => {
    expect(sanitizePhone('+975 17 123 456')).toBe('+975 17 123 456');
    expect(sanitizePhone('(975) 17-123-456')).toBe('(975) 17-123-456');
  });

  it('should strip dangerous characters', () => {
    expect(sanitizePhone('123<script>456')).toBe('123456');
    expect(sanitizePhone('+1; DROP TABLE')).toBe('+1');
  });

  it('should return empty for non-string input', () => {
    expect(sanitizePhone(12345 as unknown as string)).toBe('');
  });
});
