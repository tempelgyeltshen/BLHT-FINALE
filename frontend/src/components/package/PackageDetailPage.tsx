import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AutoImageSlider } from '../common/AutoImageSlider';
import { 
  ArrowLeft, Calendar, Star, MapPin, CheckCircle2, Sparkles, FileText, 
  Hotel as HotelIcon, Clock, DollarSign, ChevronRight, XCircle, ShieldCheck,
  Compass, Building2, ExternalLink, Camera, Image as ImageIcon, ChevronLeft, Maximize2, X
} from 'lucide-react';
import { TourPackage, Hotel } from '../../types';

export const PackageDetailPage: React.FC = () => {
  const { 
    activePackage, setActivePackage, packages, hotels,
    navigate, brochures, setActiveBrochure 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'itinerary' | 'highlights' | 'inclusions' | 'gallery'>('itinerary');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Scroll to top when active package changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePackage?.id]);

  // Fallback to first package if activePackage is null
  const currentPackage = activePackage || packages[0];

  const allImages = React.useMemo(() => {
    if (!currentPackage) return [];
    const list = [currentPackage.heroImage, ...(currentPackage.galleryImages || [])];
    return Array.from(new Set(list.filter(Boolean)));
  }, [currentPackage]);

  if (!currentPackage) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#3b2314]">No Journey Selected</h2>
        <button 
          onClick={() => navigate('luxury')}
          className="mt-4 px-6 py-2.5 bg-[#d96b27] text-white font-serif font-bold rounded-md"
        >
          View All Journeys
        </button>
      </div>
    );
  }

  const linkedBrochure = brochures.find(b => b.id === currentPackage.brochureId) || brochures[0];

  const handleOpenBrochure = () => {
    if (linkedBrochure) {
      setActiveBrochure(linkedBrochure);
      navigate('brochures');
    }
  };

  // Filter related packages (excluding current)
  const relatedPackages = packages
    .filter(p => p.id !== currentPackage.id)
    .slice(0, 3);

  // Filter related hotels matching destinations in this itinerary
  const relatedHotels = hotels.filter(h => 
    currentPackage.destinations.some(d => 
      h.location.toLowerCase().includes(d.toLowerCase()) || 
      h.region.toLowerCase().includes(d.toLowerCase())
    ) || h.featured
  ).slice(0, 3);

  return (
    <div className="bg-[#fcf8f2] min-h-screen pb-20">
      
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-1">
          <button
            onClick={() => navigate('luxury')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#3b2314] bg-[#f5eee4] hover:bg-[#3b2314] hover:text-amber-100 border border-[#e2d1be] px-4 py-2 rounded-full transition-all shadow-xs cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-[#d96b27] group-hover:text-amber-200 transition-colors" />
            <span>Back to Journeys & Circuits</span>
          </button>

          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-2 text-xs text-stone-600">
            <span onClick={() => navigate('home')} className="hover:text-[#d96b27] cursor-pointer transition-colors">Home</span>
            <span className="text-stone-400">/</span>
            <span onClick={() => navigate('luxury')} className="hover:text-[#d96b27] cursor-pointer transition-colors">Journeys</span>
            <span className="text-stone-400">/</span>
            <span className="font-semibold text-[#d96b27] truncate max-w-[220px]">{currentPackage.title}</span>
          </nav>
        </div>
        
        {/* Hero Header Section with Auto Image Slider */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#e2d1be] bg-stone-900 group">
          <AutoImageSlider
            images={allImages}
            alt={currentPackage.title}
            intervalMs={1500}
            className="h-80 sm:h-96 md:h-[420px] w-full"
            imageClassName="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#1d1007] via-[#1d1007]/50 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white pointer-events-none">
              <div className="flex flex-wrap items-center gap-2 mb-3 pointer-events-auto">
                <span className="bg-[#d96b27] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  {currentPackage.category}
                </span>
                <span className="bg-[#3b2314]/90 border border-[#d96b27]/40 text-amber-200 text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <HotelIcon className="w-3.5 h-3.5 text-[#d96b27]" />
                  {currentPackage.hotelCategory}
                </span>
                <span className="bg-[#3b2314]/90 border border-[#d96b27]/40 text-amber-200 text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {currentPackage.rating} ({currentPackage.reviewsCount} Reviews)
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-amber-50 leading-tight">
                {currentPackage.title}
              </h1>
              <p className="text-amber-100/90 text-sm sm:text-base mt-2 max-w-3xl font-serif leading-relaxed">
                {currentPackage.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 mt-6 pointer-events-auto">
                <button
                  onClick={handleOpenBrochure}
                  className="bg-[#d96b27] hover:bg-[#b85116] text-white font-serif font-bold text-xs sm:text-sm px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer min-h-[44px]"
                >
                  <FileText className="w-4 h-4 text-white" />
                  <span>Download Official PDF Guide</span>
                </button>

                <a
                  href="https://www.bhutanlhtours.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#3b2314]/90 hover:bg-[#3b2314] text-amber-200 border border-[#d96b27]/40 font-serif font-bold text-xs sm:text-sm px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer min-h-[44px]"
                >
                  <Sparkles className="w-4 h-4 text-[#d96b27]" />
                  <span>Customize This Itinerary</span>
                </a>
              </div>
            </div>
          </AutoImageSlider>
        </div>

        {/* Quick Stats Strip */}
        <div className="bg-[#3b2314] text-amber-100 rounded-2xl p-5 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium border border-[#e2d1be] shadow-md">
          <div className="p-2 border-r border-[#5c3820] last:border-0">
            <span className="text-[#d96b27] text-[10px] uppercase font-bold tracking-wider block mb-1">Duration</span>
            <span className="font-bold text-sm sm:text-base text-white flex items-center gap-1.5 font-serif">
              <Clock className="w-4 h-4 text-[#d96b27]" />
              {currentPackage.durationDays} Days / {currentPackage.durationDays - 1} Nights
            </span>
          </div>

          <div className="p-2 border-r border-[#5c3820] last:border-0">
            <span className="text-[#d96b27] text-[10px] uppercase font-bold tracking-wider block mb-1">Starting Tariff</span>
            <span className="font-bold text-sm sm:text-base text-amber-300 flex items-center gap-1.5 font-serif">
              <DollarSign className="w-4 h-4 text-[#d96b27]" />
              ${currentPackage.priceUSD.toLocaleString()} / guest
            </span>
          </div>

          <div className="p-2 border-r border-[#5c3820] last:border-0">
            <span className="text-[#d96b27] text-[10px] uppercase font-bold tracking-wider block mb-1">Valleys Visited</span>
            <span className="font-semibold text-xs sm:text-sm text-amber-100 truncate flex items-center gap-1.5 font-serif">
              <MapPin className="w-4 h-4 text-[#d96b27] shrink-0" />
              {currentPackage.destinations.join(', ')}
            </span>
          </div>

          <div className="p-2">
            <span className="text-[#d96b27] text-[10px] uppercase font-bold tracking-wider block mb-1">Includes All Taxes & SDF</span>
            <span className="font-bold text-xs sm:text-sm text-emerald-400 flex items-center gap-1 font-serif">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              SDF Fee ($100/day) Included
            </span>
          </div>
        </div>

        {/* Tabbed Detail Section */}
        <div className="bg-[#fcf8f2] rounded-2xl border border-[#e2d1be] shadow-sm overflow-hidden">
          {/* Tab Controls */}
          <div className="flex border-b border-[#e2d1be] px-4 sm:px-6 pt-4 bg-[#f5eee4] overflow-x-auto scrollbar-none whitespace-nowrap">
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`pb-4 px-4 sm:px-6 font-serif text-sm font-bold transition-all border-b-2 cursor-pointer shrink-0 min-h-[44px] ${
                activeTab === 'itinerary'
                  ? 'border-[#d96b27] text-[#d96b27]'
                  : 'border-transparent text-stone-600 hover:text-[#3b2314]'
              }`}
            >
              Day-by-Day Itinerary ({currentPackage.itinerary.length} Days)
            </button>
            <button
              onClick={() => setActiveTab('highlights')}
              className={`pb-4 px-4 sm:px-6 font-serif text-sm font-bold transition-all border-b-2 cursor-pointer shrink-0 min-h-[44px] ${
                activeTab === 'highlights'
                  ? 'border-[#d96b27] text-[#d96b27]'
                  : 'border-transparent text-stone-600 hover:text-[#3b2314]'
              }`}
            >
              Highlights & Experiences
            </button>
            <button
              onClick={() => setActiveTab('inclusions')}
              className={`pb-4 px-4 sm:px-6 font-serif text-sm font-bold transition-all border-b-2 cursor-pointer shrink-0 min-h-[44px] ${
                activeTab === 'inclusions'
                  ? 'border-[#d96b27] text-[#d96b27]'
                  : 'border-transparent text-stone-600 hover:text-[#3b2314]'
              }`}
            >
              Inclusions & Exclusions
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`pb-4 px-4 sm:px-6 font-serif text-sm font-bold transition-all border-b-2 cursor-pointer shrink-0 min-h-[44px] flex items-center gap-1.5 ${
                activeTab === 'gallery'
                  ? 'border-[#d96b27] text-[#d96b27]'
                  : 'border-transparent text-stone-600 hover:text-[#3b2314]'
              }`}
            >
              <Camera className="w-4 h-4 text-[#d96b27]" />
              <span>Photo Gallery ({allImages.length})</span>
            </button>
          </div>

          {/* Tab Contents */}
          <div className="p-6 sm:p-8">
            {activeTab === 'itinerary' && (
              <div className="space-y-6">
                <p className="text-sm text-stone-700 font-serif leading-relaxed mb-6">
                  {currentPackage.description}
                </p>

                <div className="space-y-4">
                  {currentPackage.itinerary.map((dayItem) => (
                    <div 
                      key={dayItem.day}
                      className="bg-[#f5eee4]/60 border border-[#e2d1be] rounded-2xl p-5 sm:p-6 space-y-3 hover:border-[#d96b27] transition-all shadow-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e2d1be] pb-3">
                        <span className="bg-[#3b2314] text-amber-100 text-xs font-bold px-3 py-1 rounded-lg font-serif">
                          DAY {dayItem.day} • {dayItem.location}
                        </span>
                        {dayItem.accommodation && (
                          <span className="text-xs font-semibold text-[#d96b27] flex items-center gap-1.5 font-serif">
                            <HotelIcon className="w-4 h-4 text-[#d96b27]" />
                            {dayItem.accommodation}
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#3b2314]">
                        {dayItem.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-serif">
                        {dayItem.description}
                      </p>

                      {dayItem.highlights && dayItem.highlights.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[10px] font-bold text-[#d96b27] uppercase tracking-wider block mb-1.5 font-serif">
                            Key Experiences:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {dayItem.highlights.map((hl, i) => (
                              <span key={i} className="bg-white border border-[#e2d1be] text-[#3b2314] text-xs font-serif px-2.5 py-1 rounded-md">
                                • {hl}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'highlights' && (
              <div className="space-y-6">
                <h3 className="font-serif text-lg font-bold text-[#3b2314] border-b border-[#e2d1be] pb-2">
                  Curated Kingdom Experiences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentPackage.highlights.map((hl, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-[#e2d1be] flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-[#d96b27] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-serif font-bold text-sm text-[#3b2314]">{hl}</div>
                        <div className="text-xs text-stone-600 font-serif mt-1">
                          VIP access, certified master guide accompaniment, and tailored local immersion.
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'inclusions' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-50/60 border border-emerald-200 p-5 rounded-2xl space-y-3">
                  <h3 className="font-serif text-base font-bold text-emerald-950 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Included in Kingdom Tariff</span>
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-stone-700 font-serif">
                    {currentPackage.included.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-rose-50/60 border border-rose-200 p-5 rounded-2xl space-y-3">
                  <h3 className="font-serif text-base font-bold text-rose-950 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>Exclusions & Personal Expenses</span>
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-stone-700 font-serif">
                    {currentPackage.excluded.map((exc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-rose-600 font-bold">•</span>
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#e2d1be] pb-3">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#3b2314]">
                      Live Photo Slider & Visual Showcase
                    </h3>
                    <p className="text-stone-600 text-xs font-serif mt-0.5">
                      Auto-sliding every 1.5 seconds. Click arrows or drag to navigate directly inline.
                    </p>
                  </div>

                  <span className="bg-[#3b2314] text-amber-200 text-xs font-bold font-serif px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-[#d96b27]" />
                    <span>{allImages.length} Photos</span>
                  </span>
                </div>

                {/* Main Large Inline Slider */}
                <div className="rounded-2xl overflow-hidden border border-[#e2d1be] shadow-lg bg-stone-900 h-80 sm:h-96 md:h-[450px]">
                  <AutoImageSlider
                    images={allImages}
                    alt={currentPackage.title}
                    intervalMs={1500}
                    className="w-full h-full"
                    imageClassName="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RELATED STUFFS SECTION 1: Related Journeys & Expeditions */}
        <div className="pt-8 border-t border-[#e2d1be]">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#d96b27] uppercase tracking-wider font-serif">
                <Compass className="w-4 h-4" />
                <span>Explore Related Circuit Expeditions</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#3b2314] mt-1">
                Other Bespoke Journeys You Might Love
              </h2>
            </div>

            <button
              onClick={() => navigate('luxury')}
              className="text-xs font-serif font-bold text-[#d96b27] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({packages.length}) Journeys</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPackages.map(pkg => (
              <div
                key={pkg.id}
                onClick={() => {
                  setActivePackage(pkg);
                  navigate('package-detail');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white border border-[#e2d1be] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={pkg.heroImage} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-[#d96b27] text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-md font-serif">
                    {pkg.category}
                  </span>
                  <div className="absolute bottom-3 right-3 bg-[#3b2314]/90 text-amber-200 text-xs font-bold font-serif px-2.5 py-1 rounded-md">
                    ${pkg.priceUSD.toLocaleString()} / guest
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#3b2314] group-hover:text-[#d96b27] transition-colors leading-snug">
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-stone-600 font-serif line-clamp-2 mt-1">
                      {pkg.subtitle}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#efe2d3] flex items-center justify-between text-xs font-serif text-stone-600">
                    <span className="font-bold text-[#3b2314]">{pkg.durationDays} Days</span>
                    <span className="text-[#d96b27] font-bold group-hover:underline flex items-center gap-1">
                      Explore Details →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RELATED STUFFS SECTION 2: Featured Lodges in these Valleys */}
        <div className="pt-8 border-t border-[#e2d1be]">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#d96b27] uppercase tracking-wider font-serif">
                <Building2 className="w-4 h-4" />
                <span>Sanctuary Accommodations</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#3b2314] mt-1">
                Luxury Lodges Along This Route
              </h2>
            </div>

            <button
              onClick={() => navigate('hotels')}
              className="text-xs font-serif font-bold text-[#d96b27] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All Sanctuary Lodges</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedHotels.map(h => (
              <div
                key={h.id}
                onClick={() => {
                  useApp().setActiveHotel(h);
                  navigate('hotel-detail');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white border border-[#e2d1be] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col"
              >
                <div className="relative h-44 overflow-hidden">
                  <img src={h.heroImage} alt={h.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-[#3b2314] text-amber-100 text-[10px] font-bold uppercase px-2.5 py-1 rounded-md font-serif">
                    {h.brand}
                  </span>
                  <div className="absolute bottom-3 right-3 bg-[#d96b27] text-white text-xs font-bold font-serif px-2.5 py-1 rounded-md">
                    ${h.pricePerNightUSD.toLocaleString()} / night
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#3b2314] group-hover:text-[#d96b27] transition-colors">
                      {h.name}
                    </h3>
                    <p className="text-xs text-stone-600 font-serif italic mt-0.5">
                      "{h.tagline}"
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#efe2d3] flex items-center justify-between text-xs font-serif text-stone-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#d96b27]" />
                      {h.location}
                    </span>
                    <span className="text-[#d96b27] font-bold group-hover:underline">View Sanctuary →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
