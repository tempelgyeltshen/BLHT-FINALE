import { randomUUID } from 'node:crypto';
import { saveInquiry } from '../repositories/inquiryRepository.js';
import { sendInquiryNotification } from '../../../shared/services/emailService.js';
import type { Inquiry, InquiryInput } from '../types/inquiry.types.js';

export async function createInquiry(input: InquiryInput): Promise<Inquiry> {
  const inquiry = await saveInquiry({
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: 'new'
  });

  // Fire-and-forget notification — never block the inquiry response on email.
  void sendInquiryNotification(inquiry).catch(() => undefined);

  return inquiry;
}
