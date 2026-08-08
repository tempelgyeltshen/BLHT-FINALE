import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Inquiry } from '../types/inquiry.types.js';
const dataDirectory = path.resolve(process.cwd(), 'data');
const inquiryFile = path.join(dataDirectory, 'inquiries.json');
async function readInquiries(): Promise<Inquiry[]> { try { return JSON.parse(await readFile(inquiryFile, 'utf8')) as Inquiry[]; } catch (error: unknown) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []; throw error; } }
export async function saveInquiry(inquiry: Inquiry): Promise<Inquiry> { const inquiries = await readInquiries(); await mkdir(dataDirectory, { recursive: true }); await writeFile(inquiryFile, JSON.stringify([inquiry, ...inquiries], null, 2), 'utf8'); return inquiry; }
