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
// - Files larger than 20 MB are uploaded in chunks; this also gives
//   mid-sized files per-chunk retries on flaky connections (Cloudinary
//   requires chunking above 100 MB regardless).
// - Each chunk must be larger than 5 MB (SDK default is 20 MB); the final
//   chunk may be smaller.
// - Every chunk carries the same X-Unique-Upload-Id plus a Content-Range
//   header; intermediate responses include done:false and the final chunk's
//   response includes done:true with the full asset metadata.
const CHUNK_SIZE = 20 * 1024 * 1024; // 20 MB (> 5 MB minimum)
const CHUNKED_THRESHOLD = 20 * 1024 * 1024; // 20 MB
const MAX_RETRIES = 3;

// Upload timeout policy.
//
// The old fixed 120 s wall-clock deadline aborted large uploads (e.g. a 44 MB
// PDF on a modest connection) even while bytes were still flowing, forcing a
// full restart. Two changes fix this for EVERY upload path (images, videos,
// PDFs, and chunked uploads):
//
// 1. The overall per-request cap is sized to the payload using a worst-case
//    but still-alive throughput of 64 KB/s, plus a 2-minute buffer, clamped
//    between 2 and 30 minutes. (Single requests cap at the 20 MB chunk
//    threshold, ~7 min at 64 KB/s; the stall watchdog below is the real
//    guard against dead connections.)
// 2. A stall watchdog aborts only when NO progress is made for 2 straight
//    minutes, so slow-but-progressing transfers are never cut off.
const STALL_TIMEOUT_MS = 2 * 60 * 1000;
const MIN_TOTAL_TIMEOUT_MS = 2 * 60 * 1000;
const MAX_TOTAL_TIMEOUT_MS = 30 * 60 * 1000;
const MIN_TRANSFER_BYTES_PER_SEC = 64 * 1024;

/** Overall per-request timeout scaled to the payload being sent. */
function computeRequestTimeout(payloadBytes: number): number {
  const worstCaseMs = (payloadBytes / MIN_TRANSFER_BYTES_PER_SEC) * 1000;
  const withBuffer = worstCaseMs + 2 * 60 * 1000;
  return Math.min(MAX_TOTAL_TIMEOUT_MS, Math.max(MIN_TOTAL_TIMEOUT_MS, withBuffer));
}

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

    // Files over 20 MB are chunked so mid-sized uploads get per-chunk
    // retries (and Cloudinary requires chunking above 100 MB regardless).
    if (file.size > CHUNKED_THRESHOLD) {
      return this.uploadChunked(file, url, signature, publicId, eager, onProgress);
    }

    return this.uploadSingle(file, url, signature, publicId, eager, onProgress);
  }

  /** Single-request upload for files at or below the 20 MB threshold. */
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

    return this.postToCloudinary<CloudinaryUploadResult>(url, formData, undefined, onProgress, file.size);
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
        end - start + 1,
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
    payloadBytes: number,
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
          onChunkProgress,
          payloadBytes
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
    onProgress?: (progress: UploadProgress) => void,
    payloadBytes = 0
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Scale the overall request cap to the payload: large files (e.g. 44 MB
      // PDFs, videos) need minutes, not 120 seconds. The stall watchdog below
      // is what actually protects against dead connections.
      xhr.timeout = computeRequestTimeout(payloadBytes);

      let settled = false;
      // Stall watchdog: aborts only when NO bytes move for STALL_TIMEOUT_MS,
      // so slow-but-progressing uploads are never cut off mid-transfer. It
      // stops once the upload phase ends (xhr.upload.onload) because the
      // server-side processing that follows is capped by xhr.timeout instead.
      let lastActivity = Date.now();
      let stallTimer: ReturnType<typeof setTimeout> | undefined;

      const stopStallWatch = () => {
        if (stallTimer !== undefined) {
          clearTimeout(stallTimer);
          stallTimer = undefined;
        }
      };

      const armStallWatch = () => {
        stopStallWatch();
        stallTimer = setTimeout(() => {
          stallTimer = undefined;
          if (settled) return;
          if (Date.now() - lastActivity >= STALL_TIMEOUT_MS) {
            const err = new Error("Upload timed out.") as CloudinaryRequestError;
            err.status = 408;
            settled = true;
            reject(err);
            if (typeof xhr.abort === "function") {
              xhr.abort();
            }
          } else {
            armStallWatch();
          }
        }, STALL_TIMEOUT_MS);
      };

      xhr.upload.onprogress = (event) => {
        lastActivity = Date.now();
        if (event.lengthComputable && onProgress) {
          onProgress({
            loaded: event.loaded,
            total: event.total,
            percentage: (event.loaded / event.total) * 100
          });
        }
      };

      // All bytes sent; server-side processing (eager transformations, etc.)
      // begins now and no longer counts as an upload "stall".
      xhr.upload.onload = () => {
        stopStallWatch();
      };

      xhr.onload = () => {
        stopStallWatch();
        if (settled) return;
        settled = true;
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
        stopStallWatch();
        if (settled) return;
        settled = true;
        const err = new Error("Upload timed out.") as CloudinaryRequestError;
        err.status = 408;
        reject(err);
      };

      xhr.onerror = () => {
        stopStallWatch();
        if (settled) return;
        settled = true;
        reject(new Error("Upload failed due to a network error."));
      };

      xhr.onabort = () => {
        stopStallWatch();
        if (settled) return;
        settled = true;
        reject(new Error("Upload aborted."));
      };

      xhr.open("POST", url);
      if (headers) {
        for (const [name, value] of Object.entries(headers)) {
          xhr.setRequestHeader(name, value);
        }
      }
      armStallWatch();
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
