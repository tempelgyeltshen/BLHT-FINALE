import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { AutoImageSlider } from '../common/AutoImageSlider';
import { 
  X, Calendar, Star, MapPin, CheckCircle2, Sparkles, FileText, 
  Hotel as HotelIcon, Clock, DollarSign, ChevronRight 
} from 'lucide-react';

export const PackageDetailModal: React.FC = () => {
  const { 
    activePackage, setActivePackage, 
    brochures, setActiveBrochure 
  } = useApp();
  const { t, translateText } = useLanguage();

  const [activeTab, setActiveTab] = useState<'itinerary' | 'highlights' | 'inclusions'>('itinerary');

  if (!activePackage) return null;

  const linkedBrochure = brochures.find(b => b.id === activePackage.brochureId) || brochures[0];

  const handleOpenBrochure = () => {
    setActivePackage(null);
    if (linkedBrochure) setActiveBrochure(linkedBrochure);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-amber-200 relative my-6">
        
        {/* Close button */}
        <button
          onClick={() => setActivePackage(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 text-white hover:bg-black flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Header with Auto Image Slider */}
        <div className="relative h-72 sm:h-80 w-full overflow-hidden rounded-t-2xl">
          <AutoImageSlider
            images={[activePackage.heroImage, ...(activePackage.galleryImages || [])]}
            alt={activePackage.title}
            intervalMs={1500}
            className="w-full h-full"
            imageClassName="w-full h-full object-cover"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-amber-950 via-amber-950/40 to-transparent flex flex-col justify-end p-6 text-white pointer-events-none">
              <div className="flex flex-wrap items-center gap-2 mb-2 pointer-events-auto">
                <span className="bg-amber-600 text-amber-950 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">
                  {translateText(activePackage.category)}
                </span>
                <span className="bg-amber-900/80 border border-amber-500/40 text-amber-200 text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <HotelIcon className="w-3 h-3 text-amber-400" />
                  {translateText(activePackage.hotelCategory)}
                </span>
                <span className="bg-amber-900/80 border border-amber-500/40 text-amber-200 text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  {activePackage.rating} ({activePackage.reviewsCount})
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-50 leading-tight">
                {activePackage.title}
              </h2>
              <p className="text-amber-200/90 text-xs sm:text-sm mt-1 max-w-2xl font-serif">
                {activePackage.subtitle}
              </p>
            </div>
          </AutoImageSlider>
        </div>

        {/* Quick Stats Strip */}
        <div className="bg-amber-900 text-amber-100 p-3 sm:p-4 px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs font-medium border-b border-amber-800">
          <div>
            <span className="text-amber-400 text-[9px] sm:text-[10px] uppercase block">{t('modal.duration', 'Duration')}</span>
            <span className="font-bold text-xs sm:text-sm text-white flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {activePackage.durationDays}D / {activePackage.durationDays - 1}N
            </span>
          </div>

          <div>
            <span className="text-amber-400 text-[9px] sm:text-[10px] uppercase block">{t('modal.startingTariff', 'Starting Tariff')}</span>
            <span className="font-bold text-xs sm:text-sm text-white flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              ${activePackage.priceUSD.toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-amber-400 text-[9px] sm:text-[10px] uppercase block">{t('modal.valleysVisited', 'Valleys Visited')}</span>
            <span className="font-semibold text-xs text-amber-200 truncate flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              {activePackage.destinations.map(d => translateText(d)).join(', ')}
            </span>
          </div>

          <div>
            <span className="text-amber-400 text-[9px] sm:text-[10px] uppercase block">{t('modal.officialPdf', 'Official PDF Guide')}</span>
            <button
              onClick={handleOpenBrochure}
              className="text-amber-300 hover:underline text-xs font-bold flex items-center gap-1 cursor-pointer min-h-[32px]"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              {t('modal.viewPdf', 'View PDF')}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 px-4 sm:px-6 pt-3 sm:pt-4 bg-stone-50 overflow-x-auto scrollbar-none whitespace-nowrap">
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`pb-3 px-3 sm:px-4 font-serif text-xs font-bold transition-all border-b-2 cursor-pointer shrink-0 min-h-[40px] ${
              activeTab === 'itinerary'
                ? 'border-amber-800 text-amber-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {t('modal.tabItinerary', 'Day-by-Day Itinerary')} ({activePackage.itinerary.length} {t('modal.day', 'Days')})
          </button>
          <button
            onClick={() => setActiveTab('highlights')}
            className={`pb-3 px-3 sm:px-4 font-serif text-xs font-bold transition-all border-b-2 cursor-pointer shrink-0 min-h-[40px] ${
              activeTab === 'highlights'
                ? 'border-amber-800 text-amber-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {t('modal.tabHighlights', 'Highlights')}
          </button>
          <button
            onClick={() => setActiveTab('inclusions')}
            className={`pb-3 px-3 sm:px-4 font-serif text-xs font-bold transition-all border-b-2 cursor-pointer shrink-0 min-h-[40px] ${
              activeTab === 'inclusions'
                ? 'border-amber-800 text-amber-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {t('modal.tabInclusions', 'Inclusions & Exclusions')}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-6">
          {activeTab === 'itinerary' && (
            <div className="space-y-4">
              {activePackage.itinerary.map((dayItem) => (
                <div 
                  key={dayItem.day}
                  className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-4 space-y-2 hover:border-amber-400 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="bg-amber-900 text-amber-100 text-[10px] font-bold px-2.5 py-1 rounded-md">
                      {t('modal.day', 'DAY')} {dayItem.day} • {translateText(dayItem.location)}
                    </span>
                    {dayItem.accommodation && (
                      <span className="text-[11px] font-semibold text-amber-900 flex items-center gap-1">
                        <HotelIcon className="w-3.5 h-3.5 text-amber-700" />
                        {translateText(dayItem.accommodation)}
                      </span>
                    )}
                  </div>

                  <h4 className="font-serif font-bold text-base text-amber-950">
                    {dayItem.title}
                  </h4>

                  <p className="text-stone-700 text-xs leading-relaxed font-serif">
                    {dayItem.description}
                  </p>

                  {dayItem.highlights && dayItem.highlights.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-2">
                      {dayItem.highlights.map((hl, idx) => (
                        <span key={idx} className="bg-white border border-amber-300 text-amber-950 text-[10px] px-2 py-0.5 rounded font-medium">
                          ✓ {hl}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'highlights' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600 leading-relaxed font-serif">
                {activePackage.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {activePackage.highlights.map((hl, idx) => (
                  <div key={idx} className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-amber-950">{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'inclusions' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {t('modal.includedInTariff', 'Included in Package')}
                </h4>
                <ul className="space-y-2 text-xs text-stone-700">
                  {activePackage.included.map((inc, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-stone-800 uppercase tracking-wider">
                  {t('modal.excludedInTariff', 'Not Included')}
                </h4>
                <ul className="space-y-2 text-xs text-stone-600">
                  {activePackage.excluded.map((exc, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-stone-50 p-2 rounded-lg border border-stone-200">
                      <span className="text-stone-400 font-bold">•</span>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Bar */}
        <div className="bg-amber-950 p-4 px-6 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-amber-900">
          <div className="text-amber-100">
            <p className="text-[10px] text-amber-400 uppercase tracking-widest font-serif">{translateText('Curated by BLHT Travel Concierge')}</p>
            <p className="text-xs text-amber-200">{translateText('Guaranteed 100% Carbon Negative Sustainable Journey')}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleOpenBrochure}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#d96b27] hover:bg-[#b85116] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
            >
              <FileText className="w-4 h-4 text-white" />
              <span>{t('modal.viewPdf', 'Read PDF Guide')}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
