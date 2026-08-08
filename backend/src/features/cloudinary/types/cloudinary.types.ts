export interface CloudinarySignatureRequest {
  folder?: string;
  resource_type?: string;
  public_id?: string;
  eager?: string;
}

export interface CloudinarySignatureResponse {
  signature: string;
  timestamp: number;
  cloud_name: string;
  api_key: string;
  folder: string;
  resource_type: string;
  eager?: string;
}

export interface CloudinaryDeleteRequest {
  public_id: string;
  resource_type?: 'image' | 'video' | 'raw';
}

export interface CloudinaryDeleteResponse {
  success: boolean;
  message: string;
}
