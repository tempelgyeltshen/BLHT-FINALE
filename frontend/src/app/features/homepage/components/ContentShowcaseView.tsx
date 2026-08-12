import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../../core/providers/AppProvider';
import { Download, Eye, BookOpen, Play, ExternalLink, Maximize2, X, Search } from 'lucide-react';
import { luxuryHoverProps } from '../../../../utils/motion';
import { downloadBrochurePdf } from '../../../../utils/downloadPdf';
import { FilterPill } from '../../shared/components/ui';
import { GALLERY_CATEGORIES, VIDEO_CATEGORIES, categoryLabel } from '../../shared/constants/mediaCategories';
import { GalleryItem } from '../../../../types';

export const ContentShowcaseView: React.FC = () => {
  const { brochures, videos, gallery, setActiveBrochure, logBrochureDownload, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'brochures' | 'videos' | 'gallery'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleDownload = (b: typeof brochures[0]) => {
    logBrochureDownload(b.id, 'guest@blht.bt');
    downloadBrochurePdf(b, showToast);
  };

  const categoryOptions: { id: string; label: string }[] = [
    { id: 'all', label: 'All Content' },
    { id: 'brochures', label: 'Brochures' },
    { id: 'videos', label: 'Videos' },
    { id: 'gallery', label: 'Photos' },
  ];

  // Category pills shown for the active media type (hidden on 'all' where
  // mixed content types don't share a vocabulary).
  const activeCategories: { id: string; label: string; count: number }[] =
    activeTab === 'videos'
      ? VIDEO_CATEGORIES.map(c => ({ ...c, count: videos.filter(v => v.category === c.id).length }))
      : activeTab === 'gallery'
      ? GALLERY_CATEGORIES.map(c => ({ ...c, count: gallery.filter(g => g.category === c.id).length }))
      : activeTab === 'brochures'
      ? Array.from(new Set(brochures.map(b => b.category).filter(Boolean)))
          .map(id => ({ id, label: id, count: brochures.filter(b => b.category === id).length }))
      : [];

  const filteredContent = () => {
    let content: any[] = [];

    if (activeTab === 'all' || activeTab === 'brochures') {
      content = [
        ...content,
        ...brochures.map(b => ({ ...b, type: 'brochure' }))
      ];
    }

    if (activeTab === 'all' || activeTab === 'videos') {
      content = [
        ...content,
        ...videos.map(v => ({ ...v, type: 'video' }))
      ];
    }

    if (activeTab === 'all' || activeTab === 'gallery') {
      content = [
        ...content,
        ...gallery.map(g => ({ ...g, type: 'gallery' }))
      ];
    }

    // Apply category filter for single-type tabs
    if (activeTab !== 'all' && selectedCategory !== 'all') {
      content = content.filter(item => item.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery) {
      content = content.filter(item => {
        const title = item.title || '';
        const subtitle = item.subtitle || item.caption || '';
        const location = item.location || '';
        return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
               location.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    return content;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12 overflow-hidden">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="bg-gradient-to-r from-red-950 via-amber-950 to-rose-950 text-amber-50 rounded-3xl p-6 sm:p-12 border-2 border-amber-500/60 text-center space-y-3 sm:space-y-4 shadow-xl"
      >
        <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 font-extrabold text-[10px] uppercase px-3.5 py-1 rounded-full inline-block shadow-xs">
          Digital Content Library
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-extrabold text-amber-100 max-w-2xl mx-auto leading-snug">
          Content Showcase: Brochures, Videos & Photos
        </h1>
        <p className="text-amber-200/90 text-xs sm:text-sm font-serif max-w-xl mx-auto leading-relaxed font-medium">
          Explore our comprehensive digital library featuring interactive brochures, video content, and high-resolution photography of Bhutan.
        </p>
      </motion.div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#fcf8f2] p-4 rounded-2xl border border-amber-200">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-amber-700 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search content by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-amber-300 rounded-xl py-2 pl-10 pr-4 text-xs font-serif text-stone-800 focus:outline-hidden focus:border-amber-600 shadow-inner"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categoryOptions.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveTab(cat.id as any);
                setSelectedCategory('all');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-serif cursor-pointer transition-colors ${
                activeTab === cat.id
                  ? 'bg-amber-950 text-amber-100 shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter for the active media type */}
      {activeCategories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 items-center justify-center bg-[#fcf8f2] p-3 rounded-2xl border border-amber-200">
          <FilterPill
            variant="square"
            active={selectedCategory === 'all'}
            onClick={() => setSelectedCategory('all')}
          >
            All {activeTab === 'videos' ? 'Videos' : activeTab === 'gallery' ? 'Photos' : 'Brochures'}
          </FilterPill>
          {activeCategories.map(c => (
            <FilterPill
              key={c.id}
              variant="square"
              active={selectedCategory === c.id}
              onClick={() => setSelectedCategory(c.id)}
            >
              {categoryLabel(
                c.id,
                activeTab === 'gallery' ? GALLERY_CATEGORIES : activeTab === 'videos' ? VIDEO_CATEGORIES : []
              )} ({c.count})
            </FilterPill>
          ))}
        </div>
      )}

      {/* Content Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredContent().map((item) => (
          <motion.div 
            key={item.id} 
            {...luxuryHoverProps}
            className="bg-white rounded-3xl border-2 border-amber-300/80 p-4 sm:p-6 shadow-md flex flex-col gap-4 cursor-pointer"
          >
            {/* Content Type Badge */}
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border ${
                item.type === 'brochure' 
                  ? 'bg-rose-100 text-rose-900 border-rose-300' 
                  : item.type === 'video'
                  ? 'bg-blue-100 text-blue-900 border-blue-300'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}>
                {item.type === 'brochure' ? 'PDF Brochure' : item.type === 'video' ? 'Video' : 'Photo'}
              </span>
              {item.category && (
                <span className="text-[10px] text-stone-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  {categoryLabel(
                    item.category,
                    item.type === 'gallery' ? GALLERY_CATEGORIES : item.type === 'video' ? VIDEO_CATEGORIES : []
                  )}
                </span>
              )}
            </div>

            {/* Content Preview */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400 h-48 group">
              {item.type === 'brochure' && (
                <>
                  <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-red-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-lg">
                      <Eye className="w-4 h-4" /> View Brochure
                    </span>
                  </div>
                </>
              )}

              {item.type === 'video' && (
                <>
                  <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-lg">
                      <Play className="w-4 h-4" /> Watch Video
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded">
                    {item.duration || 'Video'}
                  </div>
                </>
              )}

              {item.type === 'gallery' && (
                <>
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-lg">
                      <Maximize2 className="w-4 h-4" /> View Photo
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Content Info */}
            <div className="flex-1 flex flex-col justify-between space-y-2 min-w-0">
              <div>
                <h3 className="font-serif font-extrabold text-sm sm:text-base text-amber-950 leading-snug break-words">
                  {item.title}
                </h3>
                <p className="text-stone-700 text-xs mt-1 font-serif font-medium leading-normal">
                  {item.subtitle || item.caption || ''}
                </p>
                {item.location && (
                  <p className="text-stone-500 text-xs italic mt-1">{item.location}</p>
                )}
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-amber-200 flex flex-col sm:flex-row gap-2 w-full">
                {item.type === 'brochure' && (
                  <>
                    <button
                      onClick={() => setActiveBrochure(item)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-950 via-amber-950 to-rose-950 hover:from-red-900 hover:to-amber-900 text-amber-100 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md min-h-[40px]"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span className="whitespace-nowrap">Read</span>
                    </button>
                    <button
                      onClick={() => handleDownload(item)}
                      className="py-2.5 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-400 text-amber-950 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs min-h-[40px]"
                    >
                      <Download className="w-3.5 h-3.5 text-rose-800 shrink-0" />
                      <span>Download</span>
                    </button>
                  </>
                )}

                {item.type === 'video' && (
                  <button
                    onClick={() => {
                      const vUrl = item.videoUrl || (item.youtubeId ? `https://www.youtube.com/watch?v=${item.youtubeId}` : '');
                      if (vUrl) window.open(vUrl, '_blank');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md min-h-[40px]"
                  >
                    <Play className="w-3.5 h-3.5 shrink-0" />
                    <span>Watch Video</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </button>
                )}

                {item.type === 'gallery' && (
                  <button
                    onClick={() => setLightboxImage(item)}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-amber-950 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md min-h-[40px]"
                  >
                    <Maximize2 className="w-3.5 h-3.5 shrink-0" />
                    <span>View Photo</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Lightbox Modal for Gallery */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-4xl w-full bg-stone-900 rounded-2xl border border-amber-800 p-4 space-y-3"
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-3 right-3 p-2 text-stone-300 hover:text-white cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img src={lightboxImage.imageUrl} alt={lightboxImage.title} className="max-h-[75vh] w-full object-contain rounded-xl" />
            <div className="text-amber-100">
              <h3 className="font-serif font-bold text-lg">{lightboxImage.title} ({lightboxImage.location})</h3>
              <p className="text-xs text-amber-200/80 font-serif mt-1">{lightboxImage.caption}</p>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};