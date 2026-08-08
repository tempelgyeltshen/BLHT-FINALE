import { api } from "../api/client";

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  resource_type: "image" | "video" | "raw";
  format: string;
  bytes: number;
  duration?: number;
  width?: number;
  height?: number;
  created_at: string;
  /** Pre-generated derivatives requested via the `eager` option. */
  eager?: CloudinaryEagerDerivative[];
}

export interface CloudinarySignature {
  signature: string;
  timestamp: number;
  cloud_name: string;
  api_key: string;
  folder: string;
  eager?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadOptions {
  folder?: string;
  resourceType?: string;
  publicId?: string;
  /** Cloudinary eager transformation string (e.g. "w_640,h_360,c_fill,so_5/jpg"). */
  eager?: string;
  onProgress?: (progress: UploadProgress) => void;
}

/** A single derivative returned in the upload response's `eager` array. */
export interface CloudinaryEagerDerivative {
  secure_url: string;
  url?: string;
  public_id?: string;
  format?: string;
  width?: number;
  height?: number;
  transformation?: string;
}

// Chunked upload parameters (per Cloudinary docs):
// - Files larger than 100 MB must be uploaded in chunks.
// - Each chunk must be larger than 5 MB (SDK default is 20 MB).
// - Every chunk carries the same X-Unique-Upload-Id plus a Content-Range
//   header; intermediate responses include done:false and the final chunk's
//   response includes done:true with the full asset metadata.
const CHUNK_SIZE = 20 * 1024 * 1024; // 20 MB (> 5 MB minimum)
const CHUNKED_THRESHOLD = 100 * 1024 * 1024; // 100 MB
const MAX_RETRIES = 3;
// Per-chunk request timeout so a stalled connection triggers retries
// instead of hanging forever.
const CHUNK_TIMEOUT_MS = 120 * 1000;

/** Error carrying the HTTP status so retry logic can react to 401/403. */
interface CloudinaryRequestError extends Error {
  status?: number;
}

/** A chunk response: intermediate chunks only report done:false, the final
 * chunk returns the complete upload result with done:true. */
type ChunkedResponse = Partial<CloudinaryUploadResult> & { done?: boolean };

class CloudinaryUploadService {
  async getUploadSignature(
    folder = "blht/media",
    resourceType = "auto",
    publicId?: string,
    eager?: string
  ) {
    // Backend returns the flat signature object (not wrapped in { data })
    return api.post<CloudinarySignature>("/api/cloudinary/signature", {
      folder,
      resource_type: resourceType,
      public_id: publicId,
      ...(eager ? { eager } : {})
    });
  }

  async uploadFile(file: File, options: UploadOptions = {}): Promise<CloudinaryUploadResult> {
    const { folder = "blht/media", resourceType = "auto", publicId, eager, onProgress } = options;

    const signature = await this.getUploadSignature(folder, resourceType, publicId, eager);
    const fileType = this.getResourceType(file);
    const url = `https://api.cloudinary.com/v1_1/${signature.cloud_name}/${fileType}/upload`;

    // Files over 100 MB must be chunked (Cloudinary upload API requirement).
    if (file.size > CHUNKED_THRESHOLD) {
      return this.uploadChunked(file, url, signature, publicId, eager, onProgress);
    }

    return this.uploadSingle(file, url, signature, publicId, eager, onProgress);
  }

  /** Single-request upload for files at or below the 100 MB threshold. */
  private uploadSingle(
    file: File,
    url: string,
    signature: CloudinarySignature,
    publicId: string | undefined,
    eager: string | undefined,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<CloudinaryUploadResult> {
    const formData = new FormData();
    formData.append("file", file);
    this.appendSignatureFields(formData, signature, publicId, eager);

    return this.postToCloudinary<CloudinaryUploadResult>(url, formData, undefined, onProgress);
  }

  /** Chunked upload for large files using the upload_large REST protocol. */
  private async uploadChunked(
    file: File,
    url: string,
    signature: CloudinarySignature,
    publicId: string | undefined,
    eager: string | undefined,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<CloudinaryUploadResult> {
    const totalBytes = file.size;
    const uploadId = this.generateUniqueUploadId();
    const totalChunks = Math.ceil(totalBytes / CHUNK_SIZE);

    let start = 0;
    let uploadedBytes = 0;
    let chunkIndex = 0;

    while (start < totalBytes) {
      // Content-Range uses an inclusive end byte, clamped to the file size.
      const end = Math.min(start + CHUNK_SIZE, totalBytes) - 1;
      const chunk = file.slice(start, end + 1);

      const contentRange = `bytes ${start}-${end}/${totalBytes}`;

      const response = await this.sendChunkWithRetry(
        url,
        chunk,
        signature,
        publicId,
        eager,
        uploadId,
        contentRange,
        (chunkProgress) => {
          if (!onProgress) return;
          // Report cumulative progress across all chunks, clamped to 0-100.
          const loaded = Math.min(uploadedBytes + chunkProgress.loaded, totalBytes);
          onProgress({
            loaded,
            total: totalBytes,
            percentage: Math.min(100, Math.round((loaded / totalBytes) * 100))
          });
        }
      );

      uploadedBytes = end + 1;
      start = end + 1;
      chunkIndex++;

      // The final chunk returns done:true with the complete asset metadata.
      if (response.done === true || chunkIndex >= totalChunks) {
        return response as CloudinaryUploadResult;
      }
    }

    throw new Error("Cloudinary chunked upload completed without a final response.");
  }

  /** Sends one chunk, retrying transient failures with exponential backoff. */
  private async sendChunkWithRetry(
    url: string,
    chunk: Blob,
    signature: CloudinarySignature,
    publicId: string | undefined,
    eager: string | undefined,
    uploadId: string,
    contentRange: string,
    onChunkProgress?: (progress: UploadProgress) => void
  ): Promise<ChunkedResponse> {
    let lastError: Error | null = null;
    let currentSignature = signature;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const formData = new FormData();
        formData.append("file", chunk);
        this.appendSignatureFields(formData, currentSignature, publicId, eager);

        return await this.postToCloudinary<ChunkedResponse>(
          url,
          formData,
          {
            "X-Unique-Upload-Id": uploadId,
            "Content-Range": contentRange
          },
          onChunkProgress
        );
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Upload failed");
        const status = (error as CloudinaryRequestError).status;

        // The signature is valid for ~1 hour. For very large/slow uploads the
        // original signature may expire mid-upload; refresh it before retrying.
        if ((status === 401 || status === 403) && attempt < MAX_RETRIES) {
          currentSignature = await this.getUploadSignature(
            currentSignature.folder,
            "auto",
            publicId,
            eager
          );
        }

        if (attempt < MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, 500 * Math.pow(2, attempt)));
        }
      }
    }

    throw lastError ?? new Error("Upload failed");
  }

  /** POST multipart form data to Cloudinary via XHR (needed for progress events). */
  private postToCloudinary<T = ChunkedResponse>(
    url: string,
    formData: FormData,
    headers: Record<string, string> | undefined,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.timeout = CHUNK_TIMEOUT_MS;

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          onProgress({
            loaded: event.loaded,
            total: event.total,
            percentage: (event.loaded / event.total) * 100
          });
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          try {
            resolve(JSON.parse(xhr.responseText) as T);
          } catch {
            reject(new Error("Cloudinary returned an invalid response."));
          }
        } else {
          const err = new Error(`Cloudinary upload failed (${xhr.status}).`) as CloudinaryRequestError;
          err.status = xhr.status;
          reject(err);
        }
      };

      xhr.ontimeout = () => {
        const err = new Error("Upload timed out.") as CloudinaryRequestError;
        err.status = 408;
        reject(err);
      };

      xhr.onerror = () => {
        reject(new Error("Upload failed due to a network error."));
      };

      xhr.open("POST", url);
      if (headers) {
        for (const [name, value] of Object.entries(headers)) {
          xhr.setRequestHeader(name, value);
        }
      }
      xhr.send(formData);
    });
  }

  /** Adds the signed upload fields shared by single and chunked uploads. */
  private appendSignatureFields(
    formData: FormData,
    signature: CloudinarySignature,
    publicId: string | undefined,
    eager: string | undefined
  ) {
    formData.append("api_key", signature.api_key);
    formData.append("timestamp", signature.timestamp.toString());
    formData.append("signature", signature.signature);
    formData.append("folder", signature.folder);
    if (publicId) {
      formData.append("public_id", publicId);
    }
    if (eager) {
      formData.append("eager", eager);
    }
  }

  /** Unique upload session id required by the X-Unique-Upload-Id header. */
  private generateUniqueUploadId(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  /**
   * Format a byte count into a human-readable string (e.g. "1.5 MB").
   */
  formatFileSize(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes <= 0) {
      return "0 Bytes";
    }

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }

  /**
   * Format a duration in seconds into "MM:SS" or "HH:MM:SS".
   */
  formatDuration(seconds: number): string {
    if (seconds <= 0 || !isFinite(seconds)) {
      return "00:00";
    }

    const total = Math.round(seconds);
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const secs = total % 60;
    const pad = (n: number) => String(n).padStart(2, "0");

    return hours > 0
      ? `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
      : `${pad(minutes)}:${pad(secs)}`;
  }

  private getResourceType(file: File): string {
    if (file.type.startsWith("video")) {
      return "video";
    }
    if (file.type === "application/pdf") {
      return "raw";
    }
    if (file.type.startsWith("image")) {
      return "image";
    }
    return "auto";
  }
}

export const cloudinaryService = new CloudinaryUploadService();
