/**
 * Shared API response type shapes.
 *
 * These mirror the backend's response envelope so services can type their
 * calls consistently instead of redeclaring local response types.
 */

/** Envelope for a single-resource response: `{ data: T }`. */
export interface ApiResponse<T> {
  data: T;
}

/** Envelope for a list response: `{ data: T[] }`. */
export interface ApiListResponse<T> {
  data: T[];
}

/** Standard error body returned by the backend error handler. */
export interface ApiErrorBody {
  error: {
    message: string;
    details?: unknown;
  };
}

/** Metadata describing a paginated slice. */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** Envelope for a paginated list response. */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}
