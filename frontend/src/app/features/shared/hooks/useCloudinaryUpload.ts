import { useState, useCallback } from 'react';
import { cloudinaryService, CloudinaryUploadResult, UploadProgress } from '../../../../lib/services/cloudinary.service';

export interface UseCloudinaryUploadResult {
  uploadFile: (file: File, options?: {
    folder?: string;
    resourceType?: string;
    publicId?: string;
    eager?: string;
  }) => Promise<CloudinaryUploadResult>;
  uploadProgress: UploadProgress | null;
  isUploading: boolean;
  uploadError: string | null;
  uploadSuccess: CloudinaryUploadResult | null;
  resetUpload: () => void;
}

export function useCloudinaryUpload(): UseCloudinaryUploadResult {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<CloudinaryUploadResult | null>(null);

  const resetUpload = useCallback(() => {
    setUploadProgress(null);
    setIsUploading(false);
    setUploadError(null);
    setUploadSuccess(null);
  }, []);

  const uploadFile = useCallback(async (
    file: File,
    options: {
      folder?: string;
      resourceType?: string;
      publicId?: string;
      eager?: string;
    } = {}
  ): Promise<CloudinaryUploadResult> => {
    resetUpload();
    setIsUploading(true);
    setUploadError(null);

    try {
      // Validate file size (max 1GB for videos, 5GB for PDFs, 100MB for images)
      const isPdf = file.type === 'application/pdf';
      const isVideo = file.type.startsWith('video/');
      const maxSize = isVideo ? 1024 * 1024 * 1024 : isPdf ? 5 * 1024 * 1024 * 1024 : 100 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error(`File size exceeds maximum allowed size of ${cloudinaryService.formatFileSize(maxSize)}`);
      }

      const result = await cloudinaryService.uploadFile(file, {
        ...options,
        onProgress: (progress) => {
          setUploadProgress(progress);
        }
      });

      setUploadSuccess(result);
      setIsUploading(false);
      setUploadProgress(null);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadError(errorMessage);
      setIsUploading(false);
      setUploadProgress(null);
      throw error;
    }
  }, [resetUpload]);

  return {
    uploadFile,
    uploadProgress,
    isUploading,
    uploadError,
    uploadSuccess,
    resetUpload
  };
}
