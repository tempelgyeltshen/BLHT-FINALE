import type { NextFunction, Request, Response } from 'express';
import { createInquiry, listAllInquiries, updateInquiry } from '../services/inquiryService.js';
import { sanitizeString, sanitizeEmail, sanitizePhone } from '../../../core/utils/sanitize.js';

export async function submitInquiry(req: Request, res: Response, next: NextFunction) {
  try {
    // Input is already validated by the inquirySchema middleware, but keep a
    // defensive guard for direct calls. durationDays/groupSize are optional.
    const input = req.body ?? {};

    if (!input.fullName?.trim() || !input.email?.trim()) {
      return res.status(400).json({
        error: 'fullName and email are required.'
      });
    }

    const sanitized = {
      fullName: sanitizeString(input.fullName?.trim() ?? ''),
      email: sanitizeEmail(input.email ?? ''),
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

/** Admin: list all submitted inquiries (newest first). */
export async function listInquiries(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ data: await listAllInquiries() });
  } catch (error) {
    return next(error);
  }
}

/** Admin: update an inquiry's status / internal notes. */
export async function updateInquiryStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const updated = await updateInquiry(req.params.id, {
      status: req.body.status,
      adminNotes: req.body.adminNotes,
    });
    if (!updated) {
      return res.status(404).json({ error: { message: 'Inquiry not found.' } });
    }
    res.json({ data: updated });
  } catch (error) {
    return next(error);
  }
}
