import React, { useState, useRef } from 'react';
import { Cloud, X, Loader2, AlertCircle, RefreshCw, Link as LinkIcon, Check } from 'lucide-react';
import { useCloudinaryUpload } from '../../hooks/useCloudinaryUpload';
import { useApp } from '../../../../core/providers/AppProvider';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
  accept?: string; // Allow custom accept types
  folder?: string; // Cloudinary folder path
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'File Upload',
  className = '',
  accept = 'image/*,video/*,.pdf,.mp4,.webm,.ogg,.mov',
  folder = 'blht/media'
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [showUrlField, setShowUrlField] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const { showToast } = useApp();

  // Cloudinary upload hook
  const { uploadFile, uploadProgress, isUploading, uploadError, resetUpload } = useCloudinaryUpload();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cloudinary Upload Handler (new implementation)
  const handleCloudinaryUpload = async (file: File) => {
    resetUpload();

    // Validate file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/') && file.type !== 'application/pdf') {
      throw new Error('Please select a valid image, video, or PDF file (PNG, JPG, WEBP, GIF, SVG, MP4, WEBM, OGG, MOV, PDF).');
    }

    // Determine resource type
    const resourceType = file.type.startsWith('video/') ? 'video' :
                        file.type === 'application/pdf' ? 'raw' : 'image';

    try {
      const result = await uploadFile(file, {
        folder,
        resourceType
      });

      onChange(result.secure_url);
      showToast(`File uploaded to Cloudinary successfully! Verify the URL: ${result.secure_url}`);
    } catch (error) {
      console.error('Cloudinary upload failed:', error);
      throw error;
    }
  };

  // Paste a direct URL (works even when Cloudinary is not configured)
  const handleAddUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const url = urlInput.trim();
    if (!url) return;
    onChange(url);
    setUrlInput('');
    setShowUrlField(false);
    showToast('Image URL added.');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleCloudinaryUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleCloudinaryUpload(e.target.files[0]);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-stone-800 font-serif">
            {label}
          </label>
          {value && (
            <span className="text-[10px] text-amber-900 bg-amber-100 font-semibold px-2 py-0.5 rounded-full">
              Image Set
            </span>
          )}
        </div>
      )}

      {/* Image Preview Box if Value Exists */}
      {value && (
        <div className="relative group rounded-xl overflow-hidden border border-stone-300 bg-stone-900 aspect-video max-h-48 flex items-center justify-center">
          <img
            src={value}
            alt="Uploaded Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-amber-900 hover:bg-amber-800 text-amber-100 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Change Image</span>
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-3 py-1.5 bg-rose-800 hover:bg-rose-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
          <div className="absolute bottom-2 left-2 bg-black/70 text-amber-200 text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs truncate max-w-[80%]">
            {value.startsWith('data:') ? 'Local Preview' : 'Hosted Image'}
          </div>
        </div>
      )}

      {/* URL Paste Toggle */}
      {!showUrlField ? (
        <button
          type="button"
          onClick={() => setShowUrlField(true)}
          className="w-full px-3 py-2 bg-stone-100 hover:bg-amber-50 border border-stone-200 hover:border-amber-400 text-stone-600 hover:text-amber-900 text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Or paste an image URL directly</span>
        </button>
      ) : (
        <form onSubmit={handleAddUrl} className="flex gap-2 bg-white p-2 border border-amber-300 rounded-xl">
          <input
            type="url"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            placeholder="Paste image URL (https://...)"
            className="flex-1 p-2 border border-stone-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#d96b27] hover:bg-[#b85116] text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
          >
            <Check className="w-4 h-4" /> Use URL
          </button>
        </form>
      )}

      {/* Cloudinary Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
          isUploading
            ? 'bg-amber-50 border-amber-400 opacity-80 pointer-events-none'
            : dragOver
            ? 'border-[#d96b27] bg-amber-50/80 scale-[1.01]'
            : 'border-stone-300 hover:border-[#d96b27] bg-stone-50 hover:bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileSelect}
          disabled={isUploading}
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          {isUploading ? (
            <>
              <Loader2 className="w-10 h-10 text-[#d96b27] animate-spin" />
              <div className="w-full max-w-xs">
                <div className="flex items-center justify-between text-xs text-amber-900 mb-1">
                  <span>Uploading to Cloudinary...</span>
                  <span>{uploadProgress ? `${Math.round(uploadProgress.percentage)}%` : '...'}</span>
                </div>
                <div className="w-full bg-amber-200 rounded-full h-2">
                  <div
                    className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress?.percentage || 0}%` }}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-amber-100 text-[#d96b27] flex items-center justify-center">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-800 font-serif">
                  Click to upload to Cloudinary
                </p>
                <p className="text-[11px] text-stone-500 font-serif mt-0.5">
                  or drag & drop your file here (Images, Videos, PDFs)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Upload Error */}
      {uploadError && (
        <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-serif">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
};
