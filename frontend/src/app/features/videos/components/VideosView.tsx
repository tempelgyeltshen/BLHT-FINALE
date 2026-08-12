import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../../core/providers/AppProvider';
import { Play, X, Film, Search } from 'lucide-react';
import { FilterPill } from '../../shared/components/ui';
import { VIDEO_CATEGORIES, categoryLabel } from '../../shared/constants/mediaCategories';
import { VideoItem } from '../../../../types';

export const VideosView: React.FC = () => {
  const { videos } = useApp();
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Curated categories first, then any legacy/free-text categories still
  // present in older data so those videos remain filterable too.
  const categories = [
    ...VIDEO_CATEGORIES.map(c => c.id),
    ...Array.from(new Set(videos.map(v => v.category))),
  ].filter((id, i, arr) => id && arr.indexOf(id) === i);

  const filteredVideos = videos.filter(v => {
    const matchesCat = selectedCategory === 'all' || v.category === selectedCategory;
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 overflow-hidden">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-amber-50 rounded-3xl p-8 sm:p-12 border border-amber-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="max-w-2xl space-y-3">
          <span className="bg-amber-600 text-amber-950 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full shadow-xs inline-flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5" />
            <span>Cinematic Films & Reels ({videos.length} Videos)</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-amber-100">
            Bhutan Video Documentaries
          </h1>
          <p className="text-amber-200/90 text-xs sm:text-sm font-serif leading-relaxed">
            Immerse yourself in aerial 4K footage of ancient dzongs, 5-star Six Senses and BLHT lodge architecture, and sacred Tshechu mask dance celebrations.
          </p>
        </div>

      </motion.div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-[#fcf8f2] p-4 rounded-2xl border border-amber-200">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-amber-700 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-amber-300 rounded-xl py-2 pl-10 pr-4 text-xs font-serif text-stone-800 focus:outline-hidden focus:border-amber-600 shadow-inner"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {categories.map(cat => (
            <FilterPill
              key={cat}
              variant="square"
              active={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
            >
              {categoryLabel(cat, VIDEO_CATEGORIES)}
            </FilterPill>
          ))}
        </div>
      </div>

      {/* Videos Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
      >
        {filteredVideos.map((vid) => (
          <motion.div 
            key={vid.id} 
            whileHover={{ scale: 1.02 }}
            onClick={() => setActiveVideo(vid)}
            className="bg-white rounded-2xl overflow-hidden border border-amber-200 shadow-md group flex flex-col justify-between cursor-pointer hover:border-amber-400 transition-all relative"
          >
            <div>
              <div className="relative h-52 overflow-hidden bg-stone-900">
                <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500 text-amber-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-amber-950 ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                  {vid.duration}
                </div>
              </div>

              <div className="p-5 space-y-2">
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                  {vid.category}
                </span>
                <h3 className="font-serif font-bold text-base text-amber-950 leading-snug">{vid.title}</h3>
                <p className="text-stone-600 text-xs font-serif line-clamp-2">{vid.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Video Modal Player */}
      <AnimatePresence>
        {activeVideo && (() => {
          const vUrl = activeVideo.videoUrl || (activeVideo.youtubeId ? `https://www.youtube.com/watch?v=${activeVideo.youtubeId}` : '');
          const isDirect = vUrl.startsWith('data:video') || vUrl.startsWith('blob:') || vUrl.match(/\.(mp4|webm|ogg|mov)$/i);
          let ytId = activeVideo.youtubeId;
          if (!ytId && vUrl.includes('youtu')) {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = vUrl.match(regExp);
            if (match && match[2].length === 11) ytId = match[2];
          }

          return (
            <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-stone-900 rounded-2xl max-w-4xl w-full p-4 border border-amber-800 relative"
              >
                <button
                  onClick={() => setActiveVideo(null)}
                  className="absolute top-3 right-3 p-2 text-stone-300 hover:text-white cursor-pointer z-10"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="aspect-video w-full rounded-xl overflow-hidden mt-8 bg-black">
                  {isDirect || !ytId ? (
                    <video
                      src={vUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                      title={activeVideo.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <h3 className="font-serif font-bold text-lg text-amber-100">{activeVideo.title}</h3>
                  <span className="text-xs text-amber-400 font-mono">Category: {activeVideo.category}</span>
                </div>
                <p className="text-xs font-serif text-stone-300 mt-1">{activeVideo.description}</p>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
};
