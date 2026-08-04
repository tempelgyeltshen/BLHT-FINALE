import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { submitInquiry } from '../controllers/inquiryController.js';
import { validate } from '../middleware/validate.js';
import { inquirySchema } from '../validation/schemas.js';

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

inquiryRouter.post('/inquiries', inquiryLimiter, validate(inquirySchema), submitInquiry);
