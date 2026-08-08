/** Application-wide constants shared across features. */

/** localStorage key prefix for the BLHT portal data cache. */
export const LOCAL_STORAGE_KEY = 'blht_bhutan_portal_v1';

/** localStorage key for the access token. */
export const TOKEN_KEY = 'blht_access_token';

/** How long toast notifications stay visible, in ms. */
export const TOAST_DURATION_MS = 3500;

/** Toast copy shown when an admin action is attempted while logged out. */
export const ADMIN_REQUIRED_MESSAGE = 'Administrator access required to';

/** Company contact details used across public pages. */
export const COMPANY = {
  name: 'Bhutan Land of Happiness Tours',
  phone1: '+975-17377777',
  phone2: '+975-77444445',
  email: 'info@bhutanlhtours.com',
  website: 'https://www.bhutanlhtours.com/',
  license: 'BLHT-8842',
} as const;

/**
 * WhatsApp chat link: opens a conversation with the company number and a
 * pre-filled "plan a trip" message. Used by every WhatsApp CTA on the site
 * so the destination stays in sync.
 */
export const WHATSAPP_URL =
  'https://api.whatsapp.com/send/?phone=97517377777&text=Hello%20BLHT%2C%20I%27d%20like%20to%20plan%20a%20trip';
