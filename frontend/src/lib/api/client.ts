import {
  attachAuthHeader,
  attachCsrfHeader,
  extractCsrfToken,
  getAccessToken,
  handleUnauthorized,
  setAccessToken,
} from './interceptors';

const apiBaseUrl = import.meta.env.VITE_API_URL || "";

let csrfToken: string | null = null;

export const setCsrfToken = (token: string | null) => {
  csrfToken = token;
};

export const getCsrfToken = (): string | null => {
  return csrfToken;
};

// Request options that allow any serializable body (JSON objects, FormData, strings).
// Bodies are serialized in prepareBody() before being passed to fetch().
interface ApiRequestInit extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

function prepareBody(body: unknown): BodyInit | undefined {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (body instanceof FormData) {
    return body;
  }

  return JSON.stringify(body);
}

async function request<T>(
  path: string,
  options: ApiRequestInit = {},
  isCsrfRetry = false
): Promise<T> {
  const method = (options.method || "GET").toUpperCase();
  const headers = new Headers(options.headers || {});
  const isFormData = options.body instanceof FormData;

  if (!isFormData) {
    headers.set("Content-Type", "application/json");
  }

  // Add Authorization header for authenticated requests
  attachAuthHeader(headers);

  // Add CSRF token for state-changing requests
  attachCsrfHeader(headers, method, csrfToken);

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers,
    credentials: "include",
    body: prepareBody(options.body)
  });

  // Update CSRF token from response headers
  const newCsrfToken = extractCsrfToken(response);
  if (newCsrfToken) {
    csrfToken = newCsrfToken;
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const message = error.error?.message || error.message || "Request failed";

    // CSRF token may be stale/expired (the backend regenerates it and sends
    // it in the response header). Refetch once and retry the request.
    if (response.status === 403 && /csrf/i.test(message) && !isCsrfRetry) {
      try {
        await api.getCsrfToken();
      } catch {
        // If the token refetch fails, fall through to the normal error path.
      }
      return request<T>(path, options, true);
    }

    // 401 = token expired/invalid → clear session and redirect to login
    if (response.status === 401 && getAccessToken()) {
      setAccessToken(null);
      // Only redirect if on an admin page (not login or public pages)
      handleUnauthorized(window.location.pathname);
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  // Generic methods
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: "PUT", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),

  // Auth
  login: (email: string, password: string) => {
    return request<{
      token: string;
      user: {
        id: string;
        email: string;
        role: "admin";
      }
    }>("/api/auth/login", {
      method: "POST",
      body: { email, password }
    });
  },

  logout: () => {
    return request("/api/auth/logout", { method: "POST" });
  },

  me: () => {
    return request<{
      data: {
        user: {
          id: string;
          email: string;
          role: "admin";
        }
      }
    }>("/api/auth/me");
  },

  getCsrfToken: async () => {
    const res = await request<{ csrfToken: string }>("/api/auth/csrf-token");
    // The backend also returns the token in the JSON body. Store it as a
    // fallback in case the response header isn't exposed by CORS, so the
    // token is always available for subsequent state-changing requests.
    if (res?.csrfToken) {
      csrfToken = res.csrfToken;
    }
    return res;
  },

  // Inquiry
  submitInquiry: (payload: any) => {
    return request<{
      inquiry: {
        id: string;
        createdAt: string;
        status: string;
      }
    }>("/api/inquiries", {
      method: "POST",
      body: payload
    });
  },

  listInquiries: <T = any>() => {
    return request<{ data: T[] }>("/api/inquiries");
  },

  updateInquiry: <T = any>(id: string, body: { status?: string; adminNotes?: string }) => {
    return request<{ data: T }>(`/api/inquiries/${id}`, {
      method: "PATCH",
      body
    });
  },

  // CMS
  cmsList: <T = any>(resource: string) => {
    return request<{ data: T[] }>(`/api/cms/${resource}`);
  },

  cmsGet: <T = any>(resource: string, id: string) => {
    return request<{ data: T }>(`/api/cms/${resource}/${id}`);
  },

  cmsCreate: <T = any>(resource: string, body: unknown) => {
    return request<{ data: T }>(`/api/cms/${resource}`, {
      method: "POST",
      body
    });
  },

  cmsUpdate: <T = any>(resource: string, id: string, body: unknown) => {
    return request<{ data: T }>(`/api/cms/${resource}/${id}`, {
      method: "PATCH",
      body
    });
  },

  cmsDelete: (resource: string, id: string) => {
    return request(`/api/cms/${resource}/${id}`, {
      method: "DELETE"
    });
  }
};
