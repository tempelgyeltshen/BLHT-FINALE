import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { Search, MapPin, Clock, Star, FileText, ChevronRight } from 'lucide-react';
import { luxuryHoverProps } from '../../utils/motion';

export const SearchView: React.FC = () => {
  const { packages, hotels, brochures, festivals, setActivePackage, setActiveHotel, setActiveBrochure } = useApp();
  const [query, setQuery] = useState<string>('');

  const matchingPackages = packages.filter(p => 
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase()) ||
    p.destinations.some(d => d.toLowerCase().includes(query.toLowerCase()))
  );

  const matchingHotels = hotels.filter(h => 
    h.name.toLowerCase().includes(query.toLowerCase()) ||
    h.region.toLowerCase().includes(query.toLowerCase()) ||
    h.brand.toLowerCase().includes(query.toLowerCase())
  );

  const matchingBrochures = brochures.filter(b => 
    b.title.toLowerCase().includes(query.toLowerCase()) ||
    b.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Search Header */}
      <div className="bg-amber-950 text-amber-50 rounded-3xl p-8 sm:p-12 border border-amber-800 space-y-6 text-center">
        <span className="text-amber-400 font-bold text-xs uppercase tracking-widest font-serif block">
          BLHT Search Engine
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-amber-100">
          Find Your Ideal Bhutan Experience
        </h1>

        <div className="max-w-2xl mx-auto relative">
          <Search className="w-5 h-5 text-amber-400 absolute left-4 top-4" />
          <input
            type="text"
            placeholder="Search by valley (Paro, Punakha, Thimphu), hotel (Six Senses, COMO), or festival..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-amber-900/80 border border-amber-700 text-amber-100 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Results */}
      <div className="space-y-10">
        
        {/* Packages */}
        <div className="space-y-4">
          <h2 className="font-serif font-bold text-xl text-amber-950">Matching Tour Packages ({matchingPackages.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingPackages.map(pkg => (
              <motion.div 
                key={pkg.id} 
                {...luxuryHoverProps}
                onClick={() => setActivePackage(pkg)}
                className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs cursor-pointer space-y-2"
              >
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded uppercase">{pkg.category}</span>
                <h3 className="font-serif font-bold text-base text-amber-950">{pkg.title}</h3>
                <p className="text-stone-600 text-xs font-serif line-clamp-2">{pkg.description}</p>
                <div className="pt-2 flex justify-between items-center text-xs font-bold text-amber-900">
                  <span>{pkg.durationDays} Days</span>
                  <span>${pkg.priceUSD.toLocaleString()} USD</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Hotels */}
        <div className="space-y-4 pt-4 border-t border-amber-200">
          <h2 className="font-serif font-bold text-xl text-amber-950">Matching 5-Star Lodges ({matchingHotels.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingHotels.map(h => (
              <motion.div 
                key={h.id} 
                {...luxuryHoverProps}
                onClick={() => setActiveHotel(h)}
                className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs cursor-pointer space-y-2"
              >
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded uppercase">{h.brand}</span>
                <h3 className="font-serif font-bold text-base text-amber-950">{h.name}</h3>
                <p className="text-stone-600 text-xs font-serif">{h.region} Valley</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
