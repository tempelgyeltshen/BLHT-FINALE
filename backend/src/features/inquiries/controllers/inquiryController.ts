import type { NextFunction, Request, Response } from 'express';
import { createInquiry } from '../services/inquiryService.js';
import { sanitizeString, sanitizeEmail, sanitizePhone } from '../../../core/utils/sanitize.js';

export async function submitInquiry(req: Request, res: Response, next: NextFunction) {
  try {
    const input = req.body ?? {};
    
    if (!input.fullName?.trim() || 
        !input.email?.trim() || 
        !Number.isInteger(input.durationDays) || 
        !Number.isInteger(input.groupSize)) {
      return res.status(400).json({
        error: 'fullName, email, durationDays, and groupSize are required.'
      });
    }
    
    // Sanitize user input to prevent XSS attacks
    const sanitized = {
      fullName: sanitizeString(input.fullName.trim()),
      email: sanitizeEmail(input.email),
      phone: sanitizePhone(input.phone ?? ''),
      country: sanitizeString(input.country ?? ''),
      travelDates: sanitizeString(input.travelDates ?? ''),
      durationDays: input.durationDays,
      groupSize: input.groupSize,
      interests: Array.isArray(input.interests) ? input.interests.map(sanitizeString) : [],
      estimatedBudgetPerPerson: sanitizeString(input.estimatedBudgetPerPerson ?? ''),
      message: sanitizeString(input.message ?? '')
    };
    
    const inquiry = await createInquiry(sanitized);
    
    return res.status(201).json({ inquiry });
  } catch (error) {
    return next(error);
  }
}
