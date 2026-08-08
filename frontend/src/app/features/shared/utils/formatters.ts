/**
 * Formatting helpers.
 *
 * File-size and duration formatting reuse the Cloudinary service's battle
 * tested implementations so there is a single source of truth for those.
 */

import { cloudinaryService } from '../../../../lib/services/cloudinary.service';

/** Human-readable file size (e.g. "1.5 MB"). */
export const formatFileSize = (bytes: number): string => cloudinaryService.formatFileSize(bytes);

/** Duration in seconds → "MM:SS" or "HH:MM:SS". */
export const formatDuration = (seconds: number): string => cloudinaryService.formatDuration(seconds);

/** US-dollar formatted amount, e.g. 1250 → "$1,250". */
export const formatCurrency = (amount: number): string => `$${amount.toLocaleString()}`;

/** Price with the USD suffix used across public cards, e.g. "$1,250 USD". */
export const formatPriceUSD = (amount: number): string => `${formatCurrency(amount)} USD`;

/** Compact number formatting, e.g. 12_500 → "12.5K". */
export const formatCompactNumber = (value: number): string =>
  Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

/** Date → "Mar 18, 2027" (localized). */
export const formatDate = (date: string | Date): string =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
