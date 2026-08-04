import React, { useState, useRef } from 'react';
import { Upload, Cloud, Monitor, Check, X, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
  accept?: string; // Allow custom accept types
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'File Upload',
  className = '',
  accept = 'image/*,video/*' // Default to accept both images and videos
}) => {
  const [activeTab, setActiveTab] = useState<'desktop' | 'cloudinary'>('desktop');
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Cloudinary configuration states
  const [cloudName, setCloudName] = useState<string>('demo');
  const [uploadPreset, setUploadPreset] = useState<string>('docs_upload_example_us_preset');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cloudinaryFileInputRef = useRef<HTMLInputElement>(null);

  // Desktop File Upload Handler (FileReader -> base64)
  const handleDesktopFileSelect = (file: File) => {
    setUploadError(null);
    setUploadSuccess(null);

    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setUploadError('Please select a valid image or video file (PNG, JPG, WEBP, GIF, SVG, MP4, WEBM).');
      return;
    }

    // Limit to 1GB for large image files
    if (file.size > 1024 * 1024 * 1024) {
      setUploadError('File size exceeds 1GB limit. Please choose a smaller file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
        setUploadSuccess(`Loaded desktop file (${(file.size / 1024).toFixed(0)} KB)`);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read desktop file.');
    };
    reader.readAsDataURL(file);
  };

  // Cloudinary Direct Upload Handler via API
  const handleCloudinaryUpload = async (file: File) => {
    setUploadError(null);
    setUploadSuccess(null);

    if (!cloudName || !uploadPreset) {
      setUploadError('Please enter your Cloudinary Cloud Name and Upload Preset.');
      return;
    }

    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setUploadError('Please select a valid image or video file.');
      return;
    }

    // Limit to 1GB for Cloudinary uploads
    if (file.size > 1024 * 1024 * 1024) {
      setUploadError('File size exceeds 1GB limit. Please choose a smaller file.');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.secure_url) {
        onChange(data.secure_url);
        setUploadSuccess(`Successfully uploaded to Cloudinary: ${data.secure_url}`);
      } else {
        throw new Error(data.error?.message || 'Cloudinary upload failed. Check Cloud Name & Preset.');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Error uploading file to Cloudinary.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (activeTab === 'desktop') {
        handleDesktopFileSelect(file);
      } else {
        handleCloudinaryUpload(file);
      }
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

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-stone-800 font-serif">
            {label}
          </label>
          {value && (
            <span className="text-[10px] text-amber-900 bg-amber-100 font-semibold px-2 py-0.5 rounded-full">
              Image Loaded
            </span>
          )}
        </div>
      )}

      {/* Mode Toggle Buttons: Desktop vs Cloudinary */}
      <div className="flex border border-stone-300 rounded-xl overflow-hidden bg-stone-100 p-1 gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('desktop')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-serif font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'desktop'
              ? 'bg-amber-950 text-amber-100 shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Upload from Desktop</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cloudinary')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-serif font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'cloudinary'
              ? 'bg-[#d96b27] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
          }`}
        >
          <Cloud className="w-3.5 h-3.5" />
          <span>Cloudinary Storage</span>
        </button>
      </div>

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
              onClick={() => {
                if (activeTab === 'desktop') fileInputRef.current?.click();
                else cloudinaryFileInputRef.current?.click();
              }}
              className="px-3 py-1.5 bg-amber-900 hover:bg-amber-800 text-amber-100 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Change Image</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onChange('');
                setUploadSuccess(null);
              }}
              className="px-3 py-1.5 bg-rose-800 hover:bg-rose-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
          <div className="absolute bottom-2 left-2 bg-black/70 text-amber-200 text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs truncate max-w-[80%]">
            {value.startsWith('data:') ? 'Desktop File (Base64)' : value.includes('cloudinary') ? 'Cloudinary Hosted' : 'Loaded Image'}
          </div>
        </div>
      )}

      {/* TAB 1: DESKTOP UPLOAD ZONE */}
      {activeTab === 'desktop' && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-[#d96b27] bg-amber-50/80 scale-[1.01]'
              : 'border-stone-300 hover:border-[#d96b27] bg-stone-50 hover:bg-white'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleDesktopFileSelect(e.target.files[0]);
              }
            }}
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-[#d96b27] flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-800 font-serif">
                Click to browse files from your Desktop
              </p>
              <p className="text-[11px] text-stone-500 font-serif mt-0.5">
                or drag & drop your file here (Images & Videos)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLOUDINARY UPLOAD ZONE */}
      {activeTab === 'cloudinary' && (
        <div className="space-y-3 bg-stone-50 p-4 border border-stone-200 rounded-xl">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                Cloud Name
              </label>
              <input
                type="text"
                value={cloudName}
                onChange={(e) => setCloudName(e.target.value)}
                placeholder="e.g. my-cloud-name"
                className="w-full p-2 border border-stone-300 rounded-lg bg-white text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                Upload Preset (Unsigned)
              </label>
              <input
                type="text"
                value={uploadPreset}
                onChange={(e) => setUploadPreset(e.target.value)}
                placeholder="e.g. my_unsigned_preset"
                className="w-full p-2 border border-stone-300 rounded-lg bg-white text-xs font-mono"
              />
            </div>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !isUploading && cloudinaryFileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
              isUploading
                ? 'bg-amber-50 border-amber-400 opacity-80 pointer-events-none'
                : dragOver
                ? 'border-[#d96b27] bg-amber-50'
                : 'border-stone-300 hover:border-[#d96b27] bg-white'
            }`}
          >
            <input
              ref={cloudinaryFileInputRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleCloudinaryUpload(e.target.files[0]);
                }
              }}
            />

            <div className="flex flex-col items-center justify-center space-y-1.5">
              {isUploading ? (
                <>
                  <Loader2 className="w-6 h-6 text-[#d96b27] animate-spin" />
                  <p className="text-xs font-bold text-amber-900 font-serif">
                    Uploading file to Cloudinary...
                  </p>
                </>
              ) : (
                <>
                  <Cloud className="w-6 h-6 text-[#d96b27]" />
                  <p className="text-xs font-bold text-stone-800 font-serif">
                    Select desktop file to upload to Cloudinary
                  </p>
                  <p className="text-[10px] text-stone-500 font-serif">
                    Directly hosts image or video on Cloudinary servers
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success / Error Banners */}
      {uploadError && (
        <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-serif">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {uploadSuccess && (
        <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2 font-serif">
          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">{uploadSuccess}</span>
        </div>
      )}
    </div>
  );
};
