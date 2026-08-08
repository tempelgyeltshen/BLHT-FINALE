export interface CmsResource {
  id: string;
  slug?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface CmsListResponse<T> {
  data: T[];
}

export interface CmsItemResponse<T> {
  data: T;
}

export interface CmsCreateRequest {
  [key: string]: unknown;
}

export interface CmsUpdateRequest {
  [key: string]: unknown;
}
