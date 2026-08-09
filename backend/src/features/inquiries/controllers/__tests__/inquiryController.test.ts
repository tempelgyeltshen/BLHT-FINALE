import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextFunction, Request, Response } from 'express';

// Mock the inquiry service
const mockCreateInquiry = vi.fn();
vi.mock('../../services/inquiryService.js', () => ({
  createInquiry: mockCreateInquiry,
}));

// Use real sanitize utils (already covered separately) to exercise real behavior

const { submitInquiry } = await import('../inquiryController.js');

function mockRes() {
  const res = {
    json: vi.fn(),
    status: vi.fn(),
  } as unknown as Response;
  // Chain .status(x).json(...) like express
  (res.status as any).mockReturnValue(res);
  return res;
}

function mockReq(body: unknown): Request {
  return { body } as Request;
}

function mockNext(): NextFunction {
  return vi.fn() as unknown as NextFunction;
}

const validInput = {
  fullName: '  John Doe  ',
  email: 'john@example.com',
  phone: '+975 17 123 456',
  country: 'Bhutan',
  travelDates: '2026-10-01',
  durationDays: 7,
  groupSize: 2,
  interests: ['Trekking', 'Culture'],
  estimatedBudgetPerPerson: '5000',
  message: 'I would like to book this tour.'
};

describe('inquiryController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateInquiry.mockResolvedValue({ id: 'inq-1', status: 'new' });
  });

  describe('submitInquiry', () => {
    it('should return 400 when fullName missing', async () => {
      const res = mockRes();

      await submitInquiry(mockReq({ ...validInput, fullName: '  ' }), res, mockNext());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
      expect(mockCreateInquiry).not.toHaveBeenCalled();
    });

    it('should return 400 when email missing', async () => {
      const res = mockRes();

      await submitInquiry(mockReq({ ...validInput, email: '' }), res, mockNext());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(mockCreateInquiry).not.toHaveBeenCalled();
    });

    it('should accept inquiries without durationDays/groupSize (optional fields)', async () => {
      const res = mockRes();
      const { durationDays, groupSize, ...withoutNumbers } = validInput;

      await submitInquiry(mockReq(withoutNumbers), res, mockNext());

      expect(res.status).toHaveBeenCalledWith(201);
      const [sanitized] = mockCreateInquiry.mock.calls[0];
      expect(sanitized.durationDays).toBeUndefined();
      expect(sanitized.groupSize).toBeUndefined();
    });

    it('should pass through valid numeric durationDays/groupSize', async () => {
      const res = mockRes();

      await submitInquiry(mockReq(validInput), res, mockNext());

      expect(res.status).toHaveBeenCalledWith(201);
      const [sanitized] = mockCreateInquiry.mock.calls[0];
      expect(sanitized.durationDays).toBe(7);
      expect(sanitized.groupSize).toBe(2);
    });

    it('should handle undefined body', async () => {
      const res = mockRes();
      const req = {} as Request;

      await submitInquiry(req, res, mockNext());

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should sanitize input and create inquiry on success', async () => {
      const res = mockRes();
      res.status = vi.fn().mockReturnValue(res);

      await submitInquiry(mockReq(validInput), res, mockNext());

      expect(mockCreateInquiry).toHaveBeenCalledTimes(1);
      const [sanitized] = mockCreateInquiry.mock.calls[0];
      expect(sanitized.fullName).toBe('John Doe'); // trimmed + sanitized
      expect(sanitized.email).toBe('john@example.com');
      expect(sanitized.phone).toBe('+975 17 123 456');
      expect(sanitized.durationDays).toBe(7);
      expect(sanitized.groupSize).toBe(2);
      expect(sanitized.interests).toEqual(['Trekking', 'Culture']);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ inquiry: { id: 'inq-1', status: 'new' } });
    });

    it('should handle non-array interests', async () => {
      const res = mockRes();
      res.status = vi.fn().mockReturnValue(res);

      await submitInquiry(mockReq({ ...validInput, interests: 'Trekking' }), res, mockNext());

      const [sanitized] = mockCreateInquiry.mock.calls[0];
      expect(sanitized.interests).toEqual([]);
    });

    it('should sanitize malicious input', async () => {
      const res = mockRes();
      res.status = vi.fn().mockReturnValue(res);

      const malicious = {
        ...validInput,
        fullName: '<script>alert(1)</script>Jane',
        email: 'JANE@Example.COM ',
        message: 'javascript:alert(1)'
      };

      await submitInquiry(mockReq(malicious), res, mockNext());

      const [sanitized] = mockCreateInquiry.mock.calls[0];
      expect(sanitized.fullName).toBe('alert(1)Jane'); // tags stripped
      expect(sanitized.email).toBe('jane@example.com'); // lowercased + trimmed
      expect(sanitized.message).toBe('alert(1)'); // javascript: removed
    });

    it('should pass errors to next', async () => {
      mockCreateInquiry.mockRejectedValue(new Error('save failed'));
      const next = mockNext();

      await submitInquiry(mockReq(validInput), mockRes(), next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
