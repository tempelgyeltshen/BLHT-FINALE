import { randomUUID } from 'node:crypto';
import { saveInquiry, listInquiries, updateInquiry as repoUpdate } from '../repositories/inquiryRepository.js';
import { sendInquiryNotification, sendProposalEmail } from '../../../shared/services/emailService.js';
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

export async function listAllInquiries(): Promise<Inquiry[]> {
  return listInquiries();
}

export async function updateInquiry(
  id: string,
  updates: Partial<Pick<Inquiry, 'status' | 'adminNotes'>>,
): Promise<Inquiry | null> {
  const updated = await repoUpdate(id, updates);
  if (!updated) return null;

  // When an admin dispatches a proposal from the inbox, email the client a copy
  // (fire-and-forget; delivery failures never break the admin flow).
  if (updates.status === 'quoted' && updates.adminNotes) {
    void sendProposalEmail(updated, updates.adminNotes).catch(() => undefined);
  }

  return updated;
}
