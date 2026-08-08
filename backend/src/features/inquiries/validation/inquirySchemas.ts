import { z } from 'zod';

export const inquirySchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  travelDates: z.string().optional(),
  durationDays: z.number().positive().optional(),
  groupSize: z.number().positive().optional(),
  interests: z.array(z.string()).optional(),
  estimatedBudgetPerPerson: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
});

export type InquiryInputSchema = z.infer<typeof inquirySchema>;
