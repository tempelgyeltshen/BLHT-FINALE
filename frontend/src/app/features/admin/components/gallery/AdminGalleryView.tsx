import React, { useEffect, useState } from 'react';
import { useApp } from '../../../../core/providers/AppProvider';
import { AdminLayout } from '../shared/AdminLayout';
import { Button, ConfirmDialog, FilterPill, Input, Modal, Pagination, SearchInput, Select, TextArea } from '../../../shared/components/ui';
import { usePagination } from '../../../shared/hooks/usePagination';
import { Image as ImageIcon, Plus, Edit, Trash2, MapPin, X, Check, Maximize2, Upload, Loader2 } from 'lucide-react';
import { GalleryItem } from '../../../../../types';
import { useCloudinaryUpload } from '../../../shared/hooks/useCloudinaryUpload';
import { isValidHttpUrl } from '../../../../../utils/helpers';

export const AdminGalleryView: React.FC = () => {
  const { gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem, showToast } = useApp();
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [previewImageModal, setPreviewImageModal] = useState<GalleryItem | null>(null);

  // Cloudinary upload hook
  const { uploadFile, uploadProgress, isUploading, uploadError, resetUpload } = useCloudinaryUpload();

  // Form state
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<GalleryItem['category']>('monasteries');
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');

  // Cloudinary metadata state
  const [imageMetadata, setImageMetadata] = useState<any>(null);

  const categories: { id: GalleryItem['category']; label: string }[] = [
    { id: 'monasteries', label: 'Sacred Monasteries' },
    { id: 'dzongs', label: 'Ancient Fortresses (Dzongs)' },
    { id: 'festivals', label: 'Mask Dance Festivals' },
    { id: 'luxury', label: 'BLHT & Six Senses Lodges' },
    { id: 'nature', label: 'Glacial Valleys & Nature' },
    { id: 'culture', label: 'Cultural & Local Life' },
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate image file type
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (PNG, JPG, WEBP).');
        return;
      }
      
      try {
        resetUpload();
        const result = await uploadFile(file, {
          folder: 'blht/gallery',
          resourceType: 'image'
        });
        
        setImageUrl(result.secure_url);
        setImageMetadata(result);
        showToast(`Image uploaded to Cloudinary successfully! Verify the URL before publishing: ${result.secure_url}`);
      } catch (error) {
        console.error('Image upload failed:', error);
        showToast('Image upload failed. Please try again.');
      }
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setTitle('');
    setLocation('Paro, Bhutan');
    setCategory('monasteries');
    setImageUrl('');
    setCaption('');
    setImageMetadata(null);
    resetUpload();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setLocation(item.location);
    setCategory(item.category);
    setImageUrl(item.imageUrl);
    setCaption(item.caption);
    setImageMetadata(null);
    resetUpload();
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImageUrl = imageUrl.trim();
    if (!finalImageUrl) {
      showToast('Please upload an image or paste a valid image URL before publishing.');
      return;
    }
    if (!imageMetadata && !isValidHttpUrl(finalImageUrl)) {
      showToast('The image URL is invalid. Please paste a valid https:// URL.');
      return;
    }

    const galleryData: any = {
      title: title.trim(),
      location: location.trim(),
      category,
      imageUrl: finalImageUrl,
      caption: caption.trim()
    };

    // Add Cloudinary metadata if available
    if (imageMetadata) {
      galleryData.public_id = imageMetadata.public_id;
      galleryData.resource_type = imageMetadata.resource_type;
      galleryData.format = imageMetadata.format;
      galleryData.bytes = imageMetadata.bytes;
      galleryData.upload_date = imageMetadata.created_at;
    }

    if (editingItem) {
      updateGalleryItem(editingItem.id, galleryData);
    } else {
      addGalleryItem(galleryData);
    }
    setIsModalOpen(false);
  };

  const filteredGallery = gallery.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.caption.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const { currentPage, totalPages, pageItems, goToPage, goToFirstPage } = usePagination(filteredGallery, 6);

  // Reset to first page when search/category filters change
  useEffect(() => {
    goToFirstPage();
  }, [searchQuery, selectedCategory, goToFirstPage]);

  return (
    <AdminLayout
      title="Photo Gallery Management"
      subtitle="Upload and manage high-definition imagery showcasing monasteries, dzongs, festivals, and luxury lodges"
    >
      <div className="space-y-6">

        {/* Action Header */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-serif font-extrabold text-lg text-amber-950 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-700" />
              <span>Photo Gallery Library ({gallery.length} Images)</span>
            </h2>
            <p className="text-xs text-stone-600 font-serif">Manage photography displayed in the Kingdom Photography section</p>
          </div>

          <Button
            onClick={handleOpenAddModal}
            variant="accent"
            size="lg"
            className="shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Photo</span>
          </Button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-[#fcf8f2] p-4 rounded-2xl border border-amber-200">
          <SearchInput
            placeholder="Search by title, location, or caption..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            <FilterPill active={selectedCategory === 'all'} onClick={() => setSelectedCategory('all')}>
              All ({gallery.length})
            </FilterPill>
            {categories.map(c => {
              const count = gallery.filter(g => g.category === c.id).length;
              return (
                <FilterPill
                  key={c.id}
                  active={selectedCategory === c.id}
                  onClick={() => setSelectedCategory(c.id)}
                >
                  {c.label} ({count})
                </FilterPill>
              );
            })}
          </div>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pageItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-amber-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-56 overflow-hidden bg-stone-900 group">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-3 left-3 bg-amber-950/90 text-amber-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border border-amber-600/40 uppercase">
                    {item.category}
                  </span>
                  <button
                    onClick={() => setPreviewImageModal(item)}
                    className="absolute bottom-3 right-3 p-2 bg-black/70 hover:bg-black/90 text-white rounded-lg transition-colors cursor-pointer"
                    title="Enlarge Photo"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-amber-800 text-[11px] font-bold">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      {item.location}
                    </span>
                  </div>
                  <h3 className="font-serif font-extrabold text-amber-950 text-base">{item.title}</h3>
                  <p className="text-stone-600 text-xs font-serif line-clamp-2">{item.caption}</p>
                </div>
              </div>

              <div className="p-3 bg-stone-50 border-t border-amber-200 flex items-center justify-between gap-2">
                <span className="text-[10px] text-stone-500 font-mono truncate max-w-[150px]" title={item.imageUrl}>
                  {item.imageUrl}
                </span>

                <div className="flex items-center gap-1">
                  <Button
                    onClick={() => handleOpenEditModal(item)}
                    variant="iconAmberText"
                    size="iconSm"
                    title="Edit Photo"
                  >
                    <Edit className="w-3.5 h-3.5 text-amber-800" />
                    <span className="hidden xs:inline">Edit</span>
                  </Button>

                  <Button
                    onClick={() => setDeleteConfirm({ id: item.id, title: item.title })}
                    variant="iconRoseText"
                    size="iconSm"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-700" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />

        {/* Modal Form for Add/Edit Gallery Photo */}
        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem ? 'Edit Gallery Photo' : 'Add New Gallery Photo'}
          icon={<ImageIcon className="w-5 h-5 text-amber-700" />}
          variant="dialog"
          size="lg"
          animate
        >
          <form onSubmit={handleSave} className="space-y-4 font-serif text-xs">
            <Input
              label="Photo Title *"
              labelClassName="block text-stone-800 font-bold mb-1"
              variant="cream"
              required
              placeholder="e.g. Paro Taktsang Cliffside Monastery"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Location *"
                labelClassName="block text-stone-800 font-bold mb-1"
                variant="cream"
                required
                placeholder="e.g. Paro Valley, Bhutan"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              <Select
                label="Category *"
                labelClassName="block text-stone-800 font-bold mb-1"
                variant="cream"
                value={category}
                onChange={(e) => setCategory(e.target.value as GalleryItem['category'])}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-stone-800 font-bold mb-1">Image URL or Desktop File Upload *</label>
              <div className="flex gap-2 items-center">
                <Input
                  variant="creamFill"
                  required
                  placeholder="https://images.unsplash.com/photo-... or upload desktop file"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  disabled={isUploading}
                />
                        <label className={`px-3 py-2.5 rounded-xl font-bold cursor-pointer inline-flex items-center gap-1 shrink-0 ${isUploading ? 'bg-amber-400 text-amber-950' : 'bg-amber-100 hover:bg-amber-200 text-amber-900'}`}>
                          {isUploading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>{uploadProgress ? `${Math.round(uploadProgress.percentage)}%` : '...'}</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              <span>Upload Desktop File</span>
                            </>
                          )}
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                        </label>
                      </div>
                      
                      {/* Upload Progress */}
                      {uploadProgress && (
                        <div className="mt-2 bg-amber-100 rounded-lg p-2">
                          <div className="flex items-center justify-between text-xs text-amber-900 mb-1">
                            <span>Uploading to Cloudinary...</span>
                            <span>{Math.round(uploadProgress.percentage)}%</span>
                          </div>
                          <div className="w-full bg-amber-200 rounded-full h-2">
                            <div 
                              className="bg-amber-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${uploadProgress.percentage}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Upload Error */}
                      {uploadError && (
                        <div className="mt-2 bg-rose-50 border border-rose-200 text-rose-800 text-xs p-2 rounded-lg">
                          {uploadError}
                        </div>
                      )}

                      {imageUrl && !isUploading && (
                        <div className="mt-2 h-32 w-full rounded-xl overflow-hidden border border-amber-200 bg-stone-100">
                          <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

            <TextArea
              label="Caption / Story"
              labelClassName="block text-stone-800 font-bold mb-1"
              variant="cream"
              rows={3}
              placeholder="Detailed description or spiritual story behind this photo..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-amber-200">
              <Button type="button" variant="outline" size="mdXl" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="submitAccent" size="submitWide">
                <Check className="w-4 h-4" />
                <span>{editingItem ? 'Update Photo' : 'Publish Photo'}</span>
              </Button>
            </div>
          </form>
        </Modal>

        {/* Lightbox Preview Modal */}
        {previewImageModal && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <div className="relative max-w-3xl w-full bg-stone-900 rounded-2xl border border-amber-800 p-4 space-y-3">
              <button
                onClick={() => setPreviewImageModal(null)}
                className="absolute top-3 right-3 p-2 text-stone-300 hover:text-white cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
              <img src={previewImageModal.imageUrl} alt={previewImageModal.title} className="max-h-[70vh] w-full object-contain rounded-xl" />
              <div className="text-amber-100 space-y-1">
                <h3 className="font-serif font-bold text-lg">{previewImageModal.title} ({previewImageModal.location})</h3>
                <p className="text-xs text-amber-200/80 font-serif">{previewImageModal.caption}</p>
              </div>
            </div>
          </div>
        )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={Boolean(deleteConfirm)}
        title="Delete Photo?"
        message={(
          <span>
            Are you sure you want to delete <span className="font-bold text-rose-900">"{deleteConfirm?.title}"</span>?
          </span>
        )}
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={() => {
          if (deleteConfirm) deleteGalleryItem(deleteConfirm.id);
          setDeleteConfirm(null);
        }}
      />

      </div>
    </AdminLayout>
  );
};
