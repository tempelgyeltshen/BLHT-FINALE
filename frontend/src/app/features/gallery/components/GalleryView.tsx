import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../../core/providers/AppProvider';
import { X, MapPin, Image as ImageIcon, Search } from 'lucide-react';
import { luxuryHoverProps } from '../../../../utils/motion';
import { FilterPill } from '../../shared/components/ui';
import { GALLERY_CATEGORIES } from '../../shared/constants/mediaCategories';
import { GalleryItem } from '../../../../types';

export const GalleryView: React.FC = () => {
  const { gallery } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);

  const categoryOptions = GALLERY_CATEGORIES;

  const filtered = gallery.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.caption.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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
            <ImageIcon className="w-3.5 h-3.5" />
            <span>High-Resolution Photography ({gallery.length} Photos)</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-amber-100">
            Kingdom Photography Gallery
          </h1>
          <p className="text-amber-200/90 text-xs sm:text-sm font-serif leading-relaxed">
            High-density imagery showcasing sacred monasteries, cliffside Dzongs, 5-star lodge interiors, colourful Tshechu mask dancers, and pristine Himalayan mountain passes.
          </p>
        </div>

      </motion.div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-[#fcf8f2] p-4 rounded-2xl border border-amber-200">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-amber-700 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search gallery by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-amber-300 rounded-xl py-2 pl-10 pr-4 text-xs font-serif text-stone-800 focus:outline-hidden focus:border-amber-600 shadow-inner"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          <FilterPill
            variant="square"
            active={selectedCategory === 'all'}
            onClick={() => setSelectedCategory('all')}
          >
            All Photos ({gallery.length})
          </FilterPill>
          {categoryOptions.map(cat => (
            <FilterPill
              key={cat.id}
              variant="square"
              active={selectedCategory === cat.id}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label} ({gallery.filter(g => g.category === cat.id).length})
            </FilterPill>
          ))}
        </div>
      </div>

      {/* Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filtered.map((item) => (
          <motion.div 
            key={item.id}
            {...luxuryHoverProps}
            onClick={() => setLightboxImage(item)}
            className="group relative rounded-2xl overflow-hidden border border-amber-200 shadow-md h-72 cursor-pointer"
          >
            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end text-white">
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">{item.category}</span>
              <h4 className="font-serif font-bold text-lg leading-tight">{item.title}</h4>
              <p className="text-xs text-stone-300 flex items-center gap-1 mt-1 font-serif">
                <MapPin className="w-3 h-3 text-amber-400" /> {item.location}
              </p>
            </div>

          </motion.div>
        ))}
      </motion.div>

      {/* Lightbox Modal */}
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
