import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { Image as ImageIcon, Plus, Edit, Trash2, MapPin, X, Check, Search, Maximize2, AlertTriangle, Upload } from 'lucide-react';
import { GalleryItem } from '../../types';

export const AdminGalleryView: React.FC = () => {
  const { gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem } = useApp();
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [previewImageModal, setPreviewImageModal] = useState<GalleryItem | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<GalleryItem['category']>('monasteries');
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');

  const categories: { id: GalleryItem['category']; label: string }[] = [
    { id: 'monasteries', label: 'Sacred Monasteries' },
    { id: 'dzongs', label: 'Ancient Fortresses (Dzongs)' },
    { id: 'festivals', label: 'Mask Dance Festivals' },
    { id: 'luxury', label: 'BLHT & Six Senses Lodges' },
    { id: 'nature', label: 'Glacial Valleys & Nature' },
    { id: 'culture', label: 'Cultural & Local Life' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setTitle('');
    setLocation('Paro, Bhutan');
    setCategory('monasteries');
    setImageUrl('');
    setCaption('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setLocation(item.location);
    setCategory(item.category);
    setImageUrl(item.imageUrl);
    setCaption(item.caption);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    if (editingItem) {
      updateGalleryItem(editingItem.id, {
        title: title.trim(),
        location: location.trim(),
        category,
        imageUrl: imageUrl.trim(),
        caption: caption.trim()
      });
    } else {
      addGalleryItem({
        title: title.trim(),
        location: location.trim(),
        category,
        imageUrl: imageUrl.trim(),
        caption: caption.trim()
      });
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

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-amber-50 font-extrabold text-xs rounded-xl shadow-md cursor-pointer inline-flex items-center gap-2 shrink-0 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Photo</span>
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-[#fcf8f2] p-4 rounded-2xl border border-amber-200">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-amber-700 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, location, or caption..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-amber-300 rounded-xl py-2 pl-9 pr-4 text-xs font-serif text-stone-800 focus:outline-hidden focus:border-amber-600 shadow-inner"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-serif cursor-pointer transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-amber-950 text-amber-100 shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              All ({gallery.length})
            </button>
            {categories.map(c => {
              const count = gallery.filter(g => g.category === c.id).length;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-serif cursor-pointer transition-colors ${
                    selectedCategory === c.id
                      ? 'bg-amber-950 text-amber-100 shadow-xs'
                      : 'bg-white text-stone-700 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  {c.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
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
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    title="Edit Photo"
                  >
                    <Edit className="w-3.5 h-3.5 text-amber-800" />
                    <span className="hidden xs:inline">Edit</span>
                  </button>

                  <button
                    onClick={() => setDeleteConfirm({ id: item.id, title: item.title })}
                    className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-700" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Form for Add/Edit Gallery Photo */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl border-2 border-amber-400 max-w-xl w-full p-6 shadow-2xl relative"
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 p-2 bg-stone-100 hover:bg-stone-200 rounded-full text-stone-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-amber-200 pb-3">
                    <ImageIcon className="w-5 h-5 text-amber-700" />
                    <h3 className="font-serif font-extrabold text-lg text-amber-950">
                      {editingItem ? 'Edit Gallery Photo' : 'Add New Gallery Photo'}
                    </h3>
                  </div>

                  <form onSubmit={handleSave} className="space-y-4 font-serif text-xs">
                    <div>
                      <label className="block text-stone-800 font-bold mb-1">Photo Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Paro Taktsang Cliffside Monastery"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-[#fcf8f2] border border-amber-300 rounded-xl p-2.5 text-stone-900 focus:outline-hidden focus:border-amber-600"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-stone-800 font-bold mb-1">Location *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Paro Valley, Bhutan"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full bg-[#fcf8f2] border border-amber-300 rounded-xl p-2.5 text-stone-900 focus:outline-hidden focus:border-amber-600"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-800 font-bold mb-1">Category *</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value as GalleryItem['category'])}
                          className="w-full bg-[#fcf8f2] border border-amber-300 rounded-xl p-2.5 text-stone-900 focus:outline-hidden focus:border-amber-600 font-serif"
                        >
                          {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-800 font-bold mb-1">Image URL or Desktop File Upload *</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          required
                          placeholder="https://images.unsplash.com/photo-... or upload desktop file"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="flex-1 bg-[#fcf8f2] border border-amber-300 rounded-xl p-2.5 text-stone-900 focus:outline-hidden focus:border-amber-600"
                        />
                        <label className="px-3 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-bold cursor-pointer inline-flex items-center gap-1 shrink-0">
                          <Upload className="w-4 h-4" />
                          <span>Upload Desktop File</span>
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                      </div>
                      {imageUrl && (
                        <div className="mt-2 h-32 w-full rounded-xl overflow-hidden border border-amber-200 bg-stone-100">
                          <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-stone-800 font-bold mb-1">Caption / Story</label>
                      <textarea
                        rows={3}
                        placeholder="Detailed description or spiritual story behind this photo..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="w-full bg-[#fcf8f2] border border-amber-300 rounded-xl p-2.5 text-stone-900 focus:outline-hidden focus:border-amber-600"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-amber-200">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 border border-stone-300 text-stone-700 font-bold rounded-xl hover:bg-stone-100 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-amber-50 font-extrabold rounded-xl shadow-md cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>{editingItem ? 'Update Photo' : 'Publish Photo'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

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
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">Delete Photo?</h3>
                <p className="text-sm text-stone-600">This action cannot be undone.</p>
              </div>
            </div>
            
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
              <p className="text-sm text-stone-700">
                Are you sure you want to delete <span className="font-bold text-rose-900">"{deleteConfirm.title}"</span>?
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteGalleryItem(deleteConfirm.id);
                  setDeleteConfirm(null);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </AdminLayout>
  );
};
