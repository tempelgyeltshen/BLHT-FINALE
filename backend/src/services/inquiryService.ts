import { randomUUID } from 'node:crypto';
import { saveInquiry } from '../repositories/inquiryRepository.js';
import type { Inquiry, InquiryInput } from '../types/inquiry.js';

export function createInquiry(input: InquiryInput): Promise<Inquiry> {
  return saveInquiry({
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: 'new'
  });
}
