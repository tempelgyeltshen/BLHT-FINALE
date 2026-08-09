import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { submitInquiry, listInquiries, updateInquiryStatus } from '../controllers/inquiryController.js';
import { validate } from '../../../core/middleware/validate.js';
import { requireAdmin } from '../../../core/middleware/auth.js';
import { csrfProtection } from '../../../core/middleware/csrf.js';
import { inquirySchema, inquiryUpdateSchema } from '../validation/inquirySchemas.js';

export const inquiryRouter = Router();

// Rate limiting for inquiry submission (prevent spam)
const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 5, // 5 inquiries per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Too many inquiry submissions. Please try again later.' } },
  skipSuccessfulRequests: false // Count all requests, including successful ones
});

// Public: submit a new inquiry
inquiryRouter.post('/inquiries', inquiryLimiter, validate(inquirySchema), submitInquiry);

// Admin: list all inquiries (newest first)
inquiryRouter.get('/inquiries', requireAdmin, listInquiries);

// Admin: update inquiry status / internal notes
inquiryRouter.patch('/inquiries/:id', requireAdmin, csrfProtection, validate(inquiryUpdateSchema), updateInquiryStatus);
