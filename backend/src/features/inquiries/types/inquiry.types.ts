export type InquiryStatus = 'new' | 'contacted' | 'quoted' | 'booked' | 'archived';

export interface InquiryInput {
  fullName: string;
  email: string;
  phone?: string;
  country: string;
  travelDates?: string;
  durationDays?: number;
  groupSize?: number;
  interests?: string[];
  estimatedBudgetPerPerson?: string;
  message: string;
}

export interface Inquiry extends InquiryInput {
  id: string;
  createdAt: string;
  status: InquiryStatus;
  adminNotes?: string;
}
