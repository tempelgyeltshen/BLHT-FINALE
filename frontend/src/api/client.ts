const apiBaseUrl = import.meta.env.VITE_API_URL || "";

export interface InquiryPayload {
  fullName: string;
  email: string;
  phone?: string;
  country: string;
  travelDates?: string;
  durationDays?: number;
  groupSize?: number;
  interests: string[];
  estimatedBudgetPerPerson?: string;
  message: string;
}

// Store CSRF token only in memory
let storedCsrfToken: string | null = null;

const makeBody = (body: unknown): BodyInit | undefined => {
  if (body === undefined || body === null) {
    return undefined;
  }

  return typeof body === "string" ? body : JSON.stringify(body);
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method || "GET").toUpperCase();
  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method) && storedCsrfToken) {
    headers.set("X-CSRF-Token", storedCsrfToken);
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    credentials: "include",
    ...options,
    headers,
    body: options.body instanceof FormData ? options.body : makeBody(options.body)
  });

  const csrfHeader = response.headers.get("X-CSRF-Token");
  if (csrfHeader) {
    storedCsrfToken = csrfHeader;
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || error.message || "Request failed");
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  health: () => request<{ status: string }>('/api/health'),

  getCsrfToken: async () => {
    const response = await request<{ csrfToken: string }>('/api/csrf-token');
    storedCsrfToken = response.csrfToken;
  },

  login: (email: string, password: string) =>
    request<{ data: { user: { id: string; email: string; role: "admin" } } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  logout: () => request<void>('/api/auth/logout', { method: 'POST' }),

  me: () => request<{ data: { user: { id: string; email: string; role: "admin" } } }>('/api/auth/me'),

  refresh: () => request<{ data: { user: { id: string; email: string; role: "admin" } } }>('/api/auth/refresh', { method: 'POST' }),

  submitInquiry: (payload: InquiryPayload) =>
    request<{ inquiry: { id: string; createdAt: string; status: string } }>('/api/inquiries', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  cmsList: <T = any>(resource: string) => request<{ data: T[] }>(`/api/cms/${resource}`),

  cmsGet: <T = any>(resource: string, id: string) => request<{ data: T }>(`/api/cms/${resource}/${id}`),

  cmsCreate: <T = any>(resource: string, body: unknown) =>
    request<{ data: T }>(`/api/cms/${resource}`, {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  cmsUpdate: <T = any>(resource: string, id: string, body: unknown) =>
    request<{ data: T }>(`/api/cms/${resource}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body)
    }),

  cmsDelete: (resource: string, id: string) =>
    request<void>(`/api/cms/${resource}/${id}`, {
      method: 'DELETE'
    })
};
