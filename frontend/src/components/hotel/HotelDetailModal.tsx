import React from 'react';
import { useApp } from '../../context/AppContext';
import { AutoImageSlider } from '../common/AutoImageSlider';
import { X, Star, MapPin, DollarSign, Sparkles, CheckCircle2 } from 'lucide-react';

export const HotelDetailModal: React.FC = () => {
  const { activeHotel, setActiveHotel } = useApp();

  if (!activeHotel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-amber-200 relative my-6">
        
        <button
          onClick={() => setActiveHotel(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 text-white hover:bg-black flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero with Auto Image Slider */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden rounded-t-2xl">
          <AutoImageSlider
            images={[activeHotel.heroImage, ...(activeHotel.images || [])]}
            alt={activeHotel.name}
            intervalMs={1500}
            className="w-full h-full"
            imageClassName="w-full h-full object-cover"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-amber-950 via-amber-950/40 to-transparent flex flex-col justify-end p-6 text-white pointer-events-none">
              <div className="flex items-center gap-2 mb-1 pointer-events-auto">
                <span className="bg-amber-600 text-amber-950 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                  {activeHotel.brand}
                </span>
                <span className="bg-amber-900/80 text-amber-200 text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  {activeHotel.region} Valley
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-50">
                {activeHotel.name}
              </h2>
              <p className="text-amber-200/90 text-xs italic font-serif">
                "{activeHotel.tagline}"
              </p>
            </div>
          </AutoImageSlider>
        </div>

        {/* Details Body */}
        <div className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs font-semibold text-amber-950">
            <div>
              <span className="text-amber-800 text-[10px] uppercase block">Location</span>
              <span>{activeHotel.location}</span>
            </div>
            <div>
              <span className="text-amber-800 text-[10px] uppercase block">Est. Tariff</span>
              <span className="text-sm font-bold text-amber-900">${activeHotel.pricePerNightUSD.toLocaleString()} / night</span>
            </div>
            <div>
              <span className="text-amber-800 text-[10px] uppercase block">Star Rating</span>
              <div className="flex items-center gap-1 text-amber-600">
                {Array.from({ length: activeHotel.starRating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                ))}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-serif font-bold text-sm text-amber-950 uppercase tracking-wider mb-2">Sanctuary Overview</h4>
            <p className="text-stone-700 text-xs leading-relaxed font-serif">
              {activeHotel.description}
            </p>
          </div>

          <div>
            <h4 className="font-serif font-bold text-sm text-amber-950 uppercase tracking-wider mb-3">Lodge Amenities & Experiences</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeHotel.amenities.map((amenity, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs font-medium text-stone-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-amber-950 p-4 px-6 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-amber-900">
          <div className="text-amber-200 text-xs font-serif text-center sm:text-left">
            Pairs seamlessly with Kingdom in the Clouds & Tshechu itineraries.
          </div>
          <button
            onClick={() => setActiveHotel(null)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-200 font-semibold text-xs cursor-pointer transition-colors"
          >
            <span>Close Details</span>
          </button>
        </div>

      </div>
    </div>
  );
};
