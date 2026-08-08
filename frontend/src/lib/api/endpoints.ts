export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    CSRF_TOKEN: '/api/auth/csrf-token',
  },
  
  // Inquiry endpoints
  INQUIRY: {
    SUBMIT: '/api/inquiries',
  },
  
  // CMS endpoints
  CMS: {
    LIST: (resource: string) => `/api/cms/${resource}`,
    GET: (resource: string, id: string) => `/api/cms/${resource}/${id}`,
    CREATE: (resource: string) => `/api/cms/${resource}`,
    UPDATE: (resource: string, id: string) => `/api/cms/${resource}/${id}`,
    DELETE: (resource: string, id: string) => `/api/cms/${resource}/${id}`,
  },
  
  // Cloudinary endpoints
  CLOUDINARY: {
    SIGNATURE: '/api/cloudinary/signature',
  },
} as const;
