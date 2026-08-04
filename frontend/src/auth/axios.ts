const apiBaseUrl = import.meta.env.VITE_API_URL || "";

let storedCsrfToken: string | null = null;
let accessTokenValue: string | null = null;
let onRefreshFailed: (() => void) | null = null;
let refreshPromise: Promise<boolean> | null = null;

export const setRefreshFailedHandler = (handler: () => void) => {
  onRefreshFailed = handler;
};

export const setAccessToken = (token: string | null) => {
  accessTokenValue = token;
};

const updateCsrfToken = (response: Response) => {
  const token = response.headers.get("X-CSRF-Token");
  if (token) {
    storedCsrfToken = token;
  }
};

const makeBody = (body: unknown): BodyInit | undefined => {
  if (body === undefined || body === null) {
    return undefined;
  }

  return typeof body === "string" ? body : JSON.stringify(body);
};

const refreshToken = async (): Promise<boolean> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = fetch(`${apiBaseUrl}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(async (response) => {
      updateCsrfToken(response);
      if (!response.ok) {
        throw new Error("Refresh failed");
      }
      return true;
    })
    .catch(() => {
      if (onRefreshFailed) {
        onRefreshFailed();
      }
      return false;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

interface CustomRequestInit extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

const request = async <T>(path: string, options: CustomRequestInit = {}): Promise<T> => {
  const method = (options.method || "GET").toUpperCase();
  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (storedCsrfToken && ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    headers.set("X-CSRF-Token", storedCsrfToken);
  }

  if (accessTokenValue) {
    headers.set("Authorization", `Bearer ${accessTokenValue}`);
  }

  const { body, ...restOptions } = options;

  const response = await fetch(`${apiBaseUrl}${path}`, {
    credentials: "include",
    ...restOptions,
    headers,
    body: body instanceof FormData ? body : makeBody(body)
  });

  updateCsrfToken(response);

  if (response.status === 401 && !path.includes("/auth/refresh")) {
    const refreshed = await refreshToken();
    if (refreshed) {
      return request<T>(path, options);
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error?.message || "API request failed");
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
};

export const axios = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: "PUT", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" })
};
