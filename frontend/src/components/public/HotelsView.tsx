import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Star, MapPin } from 'lucide-react';
import { Hotel } from '../../types';
import { luxuryHoverProps } from '../../utils/motion';

export const HotelsView: React.FC = () => {
  const { hotels, setActiveHotel } = useApp();
  const { translateText } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const filteredHotels = hotels.filter(h => {
    if (selectedRegion === 'all') return true;
    return h.region.toLowerCase() === selectedRegion.toLowerCase();
  });

  const handleSelectHotel = (hotel: Hotel) => {
    setActiveHotel(hotel);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 overflow-hidden">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-amber-50 rounded-3xl p-8 sm:p-12 border border-amber-800 shadow-xl"
      >
        <div className="max-w-2xl space-y-4">
          <span className="bg-amber-600 text-amber-950 font-bold text-[10px] uppercase px-3 py-1 rounded-full">
            {translateText('Ultra-Luxury Sanctuaries')}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-amber-100">
            {translateText('5-Star Luxury Lodge Directory')}
          </h1>
          <p className="text-amber-200/90 text-xs sm:text-sm font-serif leading-relaxed">
            {translateText('Partnered with the world’s most prestigious luxury hospitality brands: Six Senses Bhutan, COMO Uma Paro, Pemako Thimphu, Zhiwa Ling Heritage, and BLHT Sanctuaries.')}
          </p>
        </div>
      </motion.div>

      {/* Region Filter */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-wrap items-center gap-2 border-b border-amber-200 pb-4"
      >
        {['all', 'Paro', 'Thimphu', 'Punakha', 'Gangtey', 'Bumthang'].map(region => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedRegion === region
                ? 'bg-amber-950 text-amber-100 shadow-sm'
                : 'bg-stone-100 text-stone-700 hover:bg-amber-100'
            }`}
          >
            {region === 'all' ? translateText('All Regions') : `${translateText(region)} ${translateText('Valley')}`}
          </button>
        ))}
      </motion.div>

      {/* Hotels Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
      >
        {filteredHotels.map((hotel) => (
          <motion.div 
            key={hotel.id} 
            {...luxuryHoverProps}
            onClick={() => handleSelectHotel(hotel)}
            className="bg-white rounded-2xl overflow-hidden border border-amber-200 shadow-md transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="relative h-60 overflow-hidden">
                <img src={hotel.heroImage} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-amber-950/80 text-amber-200 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">
                  {translateText(hotel.brand)}
                </div>
                <div className="absolute bottom-3 right-3 bg-amber-900/90 text-amber-100 text-xs font-bold px-3 py-1 rounded-lg">
                  ${hotel.pricePerNightUSD.toLocaleString()} / {translateText('night')}
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: hotel.starRating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                  ))}
                  <span className="text-xs font-semibold text-stone-600 ml-1">({translateText(hotel.region)} {translateText('Valley')})</span>
                </div>

                <h3 className="font-serif font-bold text-xl text-amber-950 group-hover:text-amber-800 transition-colors">
                  {hotel.name}
                </h3>

                <p className="text-stone-600 text-xs italic font-serif">
                  "{hotel.tagline}"
                </p>

                <p className="text-stone-700 text-xs leading-relaxed line-clamp-2">
                  {hotel.description}
                </p>

                <div className="pt-2 flex flex-wrap gap-1.5">
                  {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                    <span key={idx} className="bg-amber-50 text-amber-950 border border-amber-200 text-[10px] font-medium px-2 py-0.5 rounded">
                      ✓ {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectHotel(hotel);
                }}
                className="flex-1 py-3 rounded-xl bg-[#d96b27] hover:bg-[#b85116] text-white font-serif font-bold text-xs cursor-pointer transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>More Details</span>
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

    </div>
  );
};
