/**
 * Formatting helpers.
 */

/** US-dollar formatted amount, e.g. 1250 → "$1,250". */
export const formatCurrency = (amount: number): string => `$${amount.toLocaleString()}`;

/** Price with the USD suffix used across public cards, e.g. "$1,250 USD". */
export const formatPriceUSD = (amount: number): string => `${formatCurrency(amount)} USD`;
