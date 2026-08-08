import React, { useState, useRef } from 'react';
import { Upload, Plus, X, Trash2, ArrowLeft, ArrowRight, Image as ImageIcon, Link as LinkIcon, AlertCircle, Loader2 } from 'lucide-react';
import { useCloudinaryUpload } from '../../hooks/useCloudinaryUpload';
import { useApp } from '../../../../core/providers/AppProvider';

interface MultiImageUploaderProps {
  label?: string;
  images: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  className?: string;
  folder?: string; // Cloudinary folder path
}

const LUXURY_PRESETS = [
  { name: "Tiger's Nest Valley", url: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80" },
  { name: "Punakha Dzong Palace", url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80" },
  { name: "Six Senses Lodge", url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80" },
  { name: "Monastic Ceremony", url: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80" },
  { name: "Himalayan Sunset", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80" }
];

export const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({
  label = 'Gallery Files',
  images = [],
  onChange,
  maxImages = 15,
  className = '',
  folder = 'blht/gallery'
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [showUrlField, setShowUrlField] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { showToast } = useApp();
  
  // Cloudinary upload hook
  const { uploadFile } = useCloudinaryUpload();

  // Handle Desktop Multiple File Selection with Cloudinary upload
  const handleFilesSelected = async (filesList: FileList) => {
    setErrorMsg(null);
    const files = Array.from(filesList);
    const validFiles = files.filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));

    if (validFiles.length === 0) {
      setErrorMsg('Please select valid image or video files (PNG, JPG, WEBP, GIF, MP4, WEBM).');
      return;
    }

    if (images.length + validFiles.length > maxImages) {
      setErrorMsg(`Maximum ${maxImages} files allowed. Currently at ${images.length}.`);
      return;
    }

    setIsUploading(true);
    const newUrls: string[] = [];
    let processedCount = 0;

    for (const file of validFiles) {
      if (file.size > 1024 * 1024 * 1024) {
        setErrorMsg(`Skipped ${file.name}: exceeds 1GB limit.`);
        processedCount++;
        continue;
      }

      try {
        const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
        const result = await uploadFile(file, {
          folder,
          resourceType
        });
        
        newUrls.push(result.secure_url);
        processedCount++;
        
        if (processedCount === validFiles.length) {
          onChange([...images, ...newUrls].slice(0, maxImages));
          setIsUploading(false);
          if (newUrls.length > 0) {
            showToast(`${newUrls.length} file${newUrls.length > 1 ? 's' : ''} uploaded to Cloudinary successfully!`);
          }
        }
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        setErrorMsg(`Failed to upload ${file.name}. Please try again.`);
        processedCount++;
        
        if (processedCount === validFiles.length) {
          setIsUploading(false);
        }
      }
    }
  };

  // Add Image via Direct URL
  const handleAddUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;
    if (images.length >= maxImages) {
      setErrorMsg(`Maximum ${maxImages} files limit reached.`);
      return;
    }
    onChange([...images, urlInput.trim()]);
    setUrlInput('');
    setShowUrlField(false);
  };

  // Add preset sample
  const handleAddPreset = (url: string) => {
    if (images.length >= maxImages) {
      setErrorMsg(`Maximum ${maxImages} files limit reached.`);
      return;
    }
    onChange([...images, url]);
  };

  // Move image position (Reorder)
  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    onChange(updated);
  };

  // Delete image
  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  // Make cover (move to index 0)
  const handleMakeCover = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const [cover] = updated.splice(index, 1);
    updated.unshift(cover);
    onChange(updated);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  return (
    <div className={`space-y-3 bg-stone-50 border border-stone-200 p-4 rounded-2xl ${className}`}>
      
      {/* Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <label className="font-serif font-bold text-xs text-amber-950 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-[#d96b27]" />
            <span>{label}</span>
            <span className="text-[10px] bg-amber-100 text-amber-900 font-sans font-semibold px-2 py-0.5 rounded-full">
              {images.length} / {maxImages} Files
            </span>
          </label>
          <p className="text-[11px] text-stone-500 font-serif">
            Add multiple high-resolution photos for this package or brochure gallery
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs ${isUploading ? 'bg-amber-400 text-amber-950' : 'bg-amber-900 hover:bg-amber-850 text-amber-50 text-xs font-bold'}`}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Upload Multiple Files</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowUrlField(!showUrlField)}
            disabled={isUploading}
            className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Add URL</span>
          </button>
        </div>
      </div>

      {/* Hidden input for multiple file upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={e => {
          if (e.target.files && e.target.files.length > 0) {
            handleFilesSelected(e.target.files);
          }
        }}
      />

      {/* URL Input Form */}
      {showUrlField && (
        <form onSubmit={handleAddUrl} className="flex gap-2 bg-white p-2 border border-amber-300 rounded-xl">
          <input
            type="url"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            placeholder="Paste file URL (https://...)"
            className="flex-1 p-2 border border-stone-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#d96b27] hover:bg-[#b85116] text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>
      )}

      {/* Drop Zone Area */}
      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={e => { e.preventDefault(); setDragOver(false); }}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
          isUploading
            ? 'bg-amber-50 border-amber-400 opacity-80 pointer-events-none'
            : dragOver
            ? 'border-[#d96b27] bg-amber-50 scale-[1.01]'
            : 'border-stone-300 hover:border-[#d96b27] bg-white'
        }`}
      >
        <div className="flex items-center justify-center gap-2 text-stone-600">
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 text-[#d96b27] animate-spin" />
              <span className="text-xs font-bold font-serif">
                Uploading to Cloudinary...
              </span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 text-[#d96b27]" />
              <span className="text-xs font-bold font-serif">
                Drag & drop multiple photos here or click to browse files
              </span>
            </>
          )}
        </div>
      </div>

      {/* Quick Luxury Sample Stock Images */}
      <div className="space-y-1">
        <span className="text-[10px] text-stone-500 font-serif font-bold uppercase tracking-wider block">
          Quick Luxury Presets:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {LUXURY_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAddPreset(preset.url)}
              className="text-[10px] bg-white border border-stone-300 hover:border-amber-600 hover:bg-amber-50 text-stone-700 px-2.5 py-1 rounded-md flex items-center gap-1 font-serif cursor-pointer transition"
            >
              <Plus className="w-3 h-3 text-[#d96b27]" />
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
          <button type="button" onClick={() => setErrorMsg(null)} className="ml-auto text-stone-400 hover:text-stone-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
          {images.map((url, idx) => (
            <div
              key={idx}
              className="relative group bg-stone-900 rounded-xl overflow-hidden border border-stone-300 shadow-xs aspect-video flex items-center justify-center"
            >
              <img
                src={url}
                alt={`Gallery photo ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Index Badge */}
              <div className="absolute top-1.5 left-1.5 bg-black/75 text-amber-200 text-[10px] font-bold font-mono px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                <span>#{idx + 1}</span>
                {idx === 0 && <span className="text-amber-400 font-sans font-bold">COVER</span>}
              </div>

              {/* Overlay Action Buttons */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex items-center justify-end gap-1">
                  {idx !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleMakeCover(idx)}
                      className="text-[9px] bg-amber-600 hover:bg-amber-500 text-white font-bold px-1.5 py-0.5 rounded shadow cursor-pointer"
                      title="Set as First / Main Image"
                    >
                      Set Main
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="p-1 bg-rose-700 hover:bg-rose-600 text-white rounded shadow cursor-pointer"
                    title="Remove Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-white">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'left')}
                    className="p-1 bg-black/60 hover:bg-black text-amber-200 rounded disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    title="Move Left"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono text-stone-300">
                    Cloudinary Hosted
                  </span>
                  <button
                    type="button"
                    disabled={idx === images.length - 1}
                    onClick={() => handleMove(idx, 'right')}
                    className="p-1 bg-black/60 hover:bg-black text-amber-200 rounded disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    title="Move Right"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-6 bg-white rounded-xl border border-dashed border-stone-300 text-stone-400 text-xs font-serif italic">
          No gallery files added yet. Upload files or select luxury presets above.
        </div>
      )}
    </div>
  );
};
