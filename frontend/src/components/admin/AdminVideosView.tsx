import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { Film, Plus, Edit, Trash2, ExternalLink, Play, X, Check, Search, AlertTriangle, Upload, Video } from 'lucide-react';
import { VideoItem } from '../../types';

export const AdminVideosView: React.FC = () => {
  const { videos, addVideoItem, updateVideoItem, deleteVideoItem } = useApp();
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [duration, setDuration] = useState('04:30');
  const [category, setCategory] = useState('Documentary');
  const [description, setDescription] = useState('');

  // Helper to check if URL is direct video file/data
  const isDirectVideo = (url: string) => {
    if (!url) return false;
    return url.startsWith('data:video') || url.startsWith('blob:') || url.match(/\.(mp4|webm|ogg|mov)$/i);
  };

  // Desktop Video File Upload handler
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setVideoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Desktop Thumbnail Upload handler
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setThumbnailUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAddModal = () => {
    setEditingVideo(null);
    setTitle('');
    setVideoUrl('');
    setThumbnailUrl('');
    setDuration('05:00');
    setCategory('Documentary');
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (vid: VideoItem) => {
    setEditingVideo(vid);
    setTitle(vid.title);
    setVideoUrl(vid.videoUrl || (vid.youtubeId ? `https://www.youtube.com/watch?v=${vid.youtubeId}` : ''));
    setThumbnailUrl(vid.thumbnailUrl);
    setDuration(vid.duration || '05:00');
    setCategory(vid.category);
    setDescription(vid.description);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalThumbnail = thumbnailUrl.trim() || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80';

    if (editingVideo) {
      updateVideoItem(editingVideo.id, {
        title: title.trim(),
        videoUrl: videoUrl.trim(),
        duration: duration.trim() || '05:00',
        category: category.trim(),
        description: description.trim(),
        thumbnailUrl: finalThumbnail
      });
    } else {
      addVideoItem({
        title: title.trim(),
        videoUrl: videoUrl.trim(),
        duration: duration.trim() || '05:00',
        category: category.trim(),
        description: description.trim(),
        thumbnailUrl: finalThumbnail
      });
    }
    setIsModalOpen(false);
  };

  const categoriesList = ['all', ...Array.from(new Set(videos.map(v => v.category)))];

  const filteredVideos = videos.filter(v => {
    const matchesCat = selectedCategory === 'all' || v.category === selectedCategory;
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <AdminLayout
      title="Video Showcase Management"
      subtitle="Upload video files directly from your desktop or enter video links to feature on the website"
    >
      <div className="space-y-6">

        {/* Action Header */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-serif font-extrabold text-lg text-amber-950 flex items-center gap-2">
              <Film className="w-5 h-5 text-amber-700" />
              <span>Media Library ({videos.length} Videos)</span>
            </h2>
            <p className="text-xs text-stone-600 font-serif">Upload video documentaries from desktop or link external video media</p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-amber-50 font-extrabold text-xs rounded-xl shadow-md cursor-pointer inline-flex items-center gap-2 shrink-0 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Video</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-[#fcf8f2] p-4 rounded-2xl border border-amber-200">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-amber-700 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search videos by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-amber-300 rounded-xl py-2 pl-9 pr-4 text-xs font-serif text-stone-800 focus:outline-hidden focus:border-amber-600 shadow-inner"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {categoriesList.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-serif capitalize cursor-pointer transition-colors ${
                  selectedCategory === cat
                    ? 'bg-amber-950 text-amber-100 shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((vid) => {
            const vUrl = vid.videoUrl || (vid.youtubeId ? `https://www.youtube.com/watch?v=${vid.youtubeId}` : '');
            const isUploaded = isDirectVideo(vUrl);
            return (
              <div
                key={vid.id}
                className="bg-white rounded-2xl border border-amber-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-stone-900">
                    <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-amber-500 text-amber-950 flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 fill-amber-950 ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute top-3 left-3 bg-amber-950/90 text-amber-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border border-amber-600/40">
                      {vid.category}
                    </span>
                    <span className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                      {vid.duration}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif font-extrabold text-amber-950 text-sm leading-snug">{vid.title}</h3>
                    </div>
                    <p className="text-stone-600 text-xs font-serif line-clamp-2">{vid.description}</p>
                    <div className="text-[10px] text-stone-500 font-mono flex items-center gap-1.5 pt-1">
                      <span className={`px-2 py-0.5 rounded font-bold ${isUploaded ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}>
                        {isUploaded ? 'Desktop Upload' : 'Video Link'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 border-t border-amber-200 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-amber-800 font-serif font-bold inline-flex items-center gap-1">
                    <Video className="w-3.5 h-3.5" />
                    <span>Duration: {vid.duration}</span>
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(vid)}
                      className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                      title="Edit Video"
                    >
                      <Edit className="w-3.5 h-3.5 text-amber-800" />
                      <span className="hidden xs:inline">Edit</span>
                    </button>

                    <button
                      onClick={() => setDeleteConfirm({ id: vid.id, title: vid.title })}
                      className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                      title="Delete Video"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-700" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Form for Add/Edit Video */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl border-2 border-amber-400 max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 p-2 bg-stone-100 hover:bg-stone-200 rounded-full text-stone-700 transition-colors cursor-pointer z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-amber-200 pb-3">
                    <Film className="w-5 h-5 text-amber-700" />
                    <h3 className="font-serif font-extrabold text-lg text-amber-950">
                      {editingVideo ? 'Edit Video Tour' : 'Add New Video Tour'}
                    </h3>
                  </div>

                  <form onSubmit={handleSave} className="space-y-4 font-serif text-xs">
                    <div>
                      <label className="block text-stone-800 font-bold mb-1">Video Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Paro Taktsang Tiger's Nest 4K Aerial Documentary"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-[#fcf8f2] border border-amber-300 rounded-xl p-2.5 text-stone-900 focus:outline-hidden focus:border-amber-600"
                      />
                    </div>

                    {/* Desktop Video Upload OR URL */}
                    <div className="space-y-2 bg-[#fcf8f2] border border-amber-300 rounded-2xl p-4">
                      <label className="block text-amber-950 font-extrabold">Add Video File from Desktop or Video URL *</label>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        <label className="px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold cursor-pointer inline-flex items-center justify-center gap-2 shadow-xs shrink-0">
                          <Upload className="w-4 h-4" />
                          <span>Select Video File from Desktop</span>
                          <input type="file" accept="video/*" onChange={handleVideoFileUpload} className="hidden" />
                        </label>

                        <span className="text-center sm:self-center font-bold text-stone-400 text-xs">OR</span>

                        <input
                          type="text"
                          placeholder="Paste direct video URL (e.g. https://...)"
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          className="flex-1 bg-white border border-amber-300 rounded-xl p-2.5 text-stone-900 focus:outline-hidden focus:border-amber-600"
                        />
                      </div>

                      {/* Video Player Preview if Video File / Data URL is selected */}
                      {videoUrl && (
                        <div className="mt-3 bg-stone-900 rounded-xl p-2 space-y-2">
                          <span className="text-[10px] font-mono text-amber-300 font-bold block">Video Loaded Preview:</span>
                          {isDirectVideo(videoUrl) ? (
                            <video src={videoUrl} controls className="w-full max-h-48 rounded-lg object-contain bg-black" />
                          ) : (
                            <div className="text-amber-100 text-xs p-3 font-mono bg-stone-800 rounded-lg overflow-x-auto">
                              {videoUrl.substring(0, 100)}...
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-stone-800 font-bold mb-1">Category</label>
                        <input
                          type="text"
                          placeholder="e.g. Documentary, Culture, Luxury Lodges, Trekking"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-[#fcf8f2] border border-amber-300 rounded-xl p-2.5 text-stone-900 focus:outline-hidden focus:border-amber-600"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-800 font-bold mb-1">Duration (MM:SS or text)</label>
                        <input
                          type="text"
                          placeholder="e.g. 04:30 or 10 mins"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full bg-[#fcf8f2] border border-amber-300 rounded-xl p-2.5 text-stone-900 focus:outline-hidden focus:border-amber-600"
                        />
                      </div>
                    </div>

                    {/* Thumbnail Image URL or Upload */}
                    <div className="space-y-2">
                      <label className="block text-stone-800 font-bold mb-1">Thumbnail Image</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Thumbnail Image URL (e.g. https://...)"
                          value={thumbnailUrl}
                          onChange={(e) => setThumbnailUrl(e.target.value)}
                          className="flex-1 bg-[#fcf8f2] border border-amber-300 rounded-xl p-2.5 text-stone-900 focus:outline-hidden focus:border-amber-600"
                        />
                        <label className="px-3 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-bold cursor-pointer inline-flex items-center gap-1 shrink-0">
                          <Upload className="w-4 h-4" />
                          <span>Upload Desktop Thumbnail</span>
                          <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
                        </label>
                      </div>
                      {thumbnailUrl && (
                        <img src={thumbnailUrl} alt="Thumbnail Preview" className="w-24 h-16 object-cover rounded-lg border border-amber-300 mt-2" />
                      )}
                    </div>

                    <div>
                      <label className="block text-stone-800 font-bold mb-1">Video Description</label>
                      <textarea
                        rows={3}
                        placeholder="Short summary of what this video showcases..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
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
                        <span>{editingVideo ? 'Update Video' : 'Publish Video'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-serif">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-stone-900">Delete Video?</h3>
                  <p className="text-xs text-stone-600">This action cannot be undone.</p>
                </div>
              </div>
              
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
                <p className="text-xs text-stone-700">
                  Are you sure you want to delete <span className="font-bold text-rose-900">"{deleteConfirm.title}"</span>?
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-bold hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteVideoItem(deleteConfirm.id);
                    setDeleteConfirm(null);
                  }}
                  className="flex-1 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 cursor-pointer"
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
