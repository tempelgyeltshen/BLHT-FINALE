import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Inquiry } from '../types/inquiry.types.js';

const dataDirectory = path.resolve(process.cwd(), 'data');
const inquiryFile = path.join(dataDirectory, 'inquiries.json');

async function readInquiries(): Promise<Inquiry[]> {
  try {
    return JSON.parse(await readFile(inquiryFile, 'utf8')) as Inquiry[];
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

async function writeInquiries(inquiries: Inquiry[]): Promise<void> {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(inquiryFile, JSON.stringify(inquiries, null, 2), 'utf8');
}

export async function saveInquiry(inquiry: Inquiry): Promise<Inquiry> {
  const inquiries = await readInquiries();
  await writeInquiries([inquiry, ...inquiries]);
  return inquiry;
}

/** All inquiries, newest first. */
export async function listInquiries(): Promise<Inquiry[]> {
  const inquiries = await readInquiries();
  return inquiries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Update status/notes of a single inquiry; returns the updated record or null. */
export async function updateInquiry(
  id: string,
  updates: Partial<Pick<Inquiry, 'status' | 'adminNotes'>>
): Promise<Inquiry | null> {
  const inquiries = await readInquiries();
  const index = inquiries.findIndex((inquiry) => inquiry.id === id);
  if (index === -1) return null;

  // Only apply explicitly-provided fields so a status-only update never wipes
  // previously saved admin notes (undefined values are skipped).
  const cleanUpdates: Partial<Pick<Inquiry, 'status' | 'adminNotes'>> = {};
  if (updates.status !== undefined) cleanUpdates.status = updates.status;
  if (updates.adminNotes !== undefined) cleanUpdates.adminNotes = updates.adminNotes;

  const updated: Inquiry = { ...inquiries[index], ...cleanUpdates };
  inquiries[index] = updated;
  await writeInquiries(inquiries);
  return updated;
}
