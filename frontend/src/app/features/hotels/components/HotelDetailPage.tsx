import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHotels } from '../hooks/useHotels';
import { useApp } from '../../../core/providers/AppProvider';
import { AutoImageSlider } from '../../shared/components/media/AutoImageSlider';
import { 
  ArrowLeft, Star, MapPin, CheckCircle2, Sparkles, Building2, Compass, 
  ChevronRight, PhoneCall, ShieldCheck
} from 'lucide-react';
import type { Hotel } from '../types/hotel.types';

export const HotelDetailPage: React.FC = () => {
  const { slug, id, hotelId } = useParams<{ slug?: string; id?: string; hotelId?: string }>();
  const { fetchHotelBySlug, fetchHotelById, hotels, loading } = useHotels();
  const { 
    setActiveHotel, packages, setActivePackage,
    navigate
  } = useApp();

  // Fetch specific hotel details based on URL slug or id param
  const urlSlug = slug || id || hotelId;
  const [apiHotel, setApiHotel] = useState<Hotel | null>(null);

  // Resolve the lodge from the already-loaded list by slug or id — works even
  // when the backend API is unreachable.
  const localHotel = useMemo<Hotel | null>(() => {
    if (!urlSlug) return null;
    return hotels.find(h => h.slug === urlSlug || h.id === urlSlug) ?? null;
  }, [hotels, urlSlug]);

  const currentHotel = localHotel ?? apiHotel;

  // Deep links (direct URL with a slug/id that isn't in the local list): fall
  // back to the backend API. Errors are non-fatal — the local list already
  // covers every lodge shown on the site.
  useEffect(() => {
    setApiHotel(null);
    if (!urlSlug || localHotel) return;

    let cancelled = false;
    const fetchHotel = async () => {
      let hotel: Hotel | null = null;

      // Try by slug first
      if (!urlSlug.match(/^[0-9a-f]{24}$/)) {
        hotel = await fetchHotelBySlug(urlSlug);
      }

      // If not found by slug, try by ID
      if (!hotel) {
        hotel = await fetchHotelById(urlSlug);
      }

      if (!cancelled && hotel) setApiHotel(hotel);
    };

    fetchHotel();
    return () => { cancelled = true; };
  }, [urlSlug, localHotel, fetchHotelBySlug, fetchHotelById]);

  // Scroll to top when hotel changes
  useEffect(() => {
    if (currentHotel) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentHotel?.id]);

  const handleGoBack = () => {
    navigate('hotels');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900 mx-auto"></div>
        <p className="mt-4 text-stone-600">Loading sanctuary details...</p>
      </div>
    );
  }

  if (!currentHotel) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#3b2314]">No Lodge Selected</h2>
        <button 
          onClick={handleGoBack}
          className="mt-4 px-6 py-2.5 bg-[#d96b27] text-white font-serif font-bold rounded-md"
        >
          View All Lodges
        </button>
      </div>
    );
  }

  // Related hotels in Bhutan (excluding current)
  const relatedHotels = hotels
    .filter(h => h.id !== currentHotel.id)
    .slice(0, 3);

  // Tour packages visiting this hotel's region or category
  const relatedPackages = packages.filter(p => {
    const destinations = Array.isArray(p.destinations) ? p.destinations : [];
    const hotelCategory = p.hotelCategory || '';
    return destinations.some(d => 
      d.toLowerCase().includes(currentHotel.region.toLowerCase()) || 
      d.toLowerCase().includes(currentHotel.location.toLowerCase())
    ) || hotelCategory.toLowerCase().includes(currentHotel.brand.toLowerCase()) || p.featured;
  }).slice(0, 3);

  return (
    <div className="bg-[#fcf8f2] min-h-screen pb-20">
      
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-1">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#3b2314] bg-[#f5eee4] hover:bg-[#3b2314] hover:text-amber-100 border border-[#e2d1be] px-4 py-2 rounded-full transition-all shadow-xs cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-[#d96b27] group-hover:text-amber-200 transition-colors" />
            <span>Back to The Lodges & Sanctuary</span>
          </button>

          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-2 text-xs text-stone-600">
            <span onClick={() => navigate('home')} className="hover:text-[#d96b27] cursor-pointer transition-colors">Home</span>
            <span className="text-stone-400">/</span>
            <span onClick={() => navigate('hotels')} className="hover:text-[#d96b27] cursor-pointer transition-colors">The Lodges</span>
            <span className="text-stone-400">/</span>
            <span className="font-semibold text-[#d96b27] truncate max-w-[220px]">{currentHotel.name}</span>
          </nav>
        </div>
        
        {/* Hero Banner Header with Auto Image Slider */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#e2d1be] bg-stone-900 group">
          <AutoImageSlider
            images={[currentHotel.heroImage, ...(currentHotel.images || [])]}
            alt={currentHotel.name}
            intervalMs={1500}
            className="h-80 sm:h-96 md:h-[420px] w-full"
            imageClassName="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#1d1007] via-[#1d1007]/50 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white pointer-events-none">
              <div className="flex flex-wrap items-center gap-2 mb-3 pointer-events-auto">
                <span className="bg-[#d96b27] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full font-serif">
                  {currentHotel.brand}
                </span>
                <span className="bg-[#3b2314]/90 border border-[#d96b27]/40 text-amber-200 text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 font-serif">
                  <MapPin className="w-3.5 h-3.5 text-[#d96b27]" />
                  {currentHotel.region} Valley
                </span>
                <span className="bg-[#3b2314]/90 border border-[#d96b27]/40 text-amber-200 text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1 font-serif">
                  {Array.from({ length: currentHotel.starRating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                  ))}
                  <span>{currentHotel.starRating}-Star Rating</span>
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-amber-50 leading-tight">
                {currentHotel.name}
              </h1>
              <p className="text-amber-100/90 text-sm sm:text-base mt-2 max-w-3xl font-serif italic">
                "{currentHotel.tagline}"
              </p>
            </div>
          </AutoImageSlider>
        </div>

        {/* Quick Details Bar */}
        <div className="bg-[#3b2314] text-amber-100 rounded-2xl p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium border border-[#e2d1be] shadow-md">
          <div className="p-2 border-r sm:border-r border-[#5c3820] last:border-0">
            <span className="text-[#d96b27] text-[10px] uppercase font-bold tracking-wider block mb-1">Sanctuary Location</span>
            <span className="font-bold text-sm sm:text-base text-white flex items-center gap-1.5 font-serif">
              <MapPin className="w-4 h-4 text-[#d96b27]" />
              {currentHotel.location}
            </span>
          </div>

          <div className="p-2 border-r sm:border-r border-[#5c3820] last:border-0">
            <span className="text-[#d96b27] text-[10px] uppercase font-bold tracking-wider block mb-1">Est. Tariff Per Night</span>
            <span className="font-bold text-sm sm:text-base text-amber-300 font-serif">
              ${currentHotel.pricePerNightUSD.toLocaleString()} / night
            </span>
          </div>

          <div className="p-2">
            <span className="text-[#d96b27] text-[10px] uppercase font-bold tracking-wider block mb-1">Sanctuary Details</span>
            <span className="font-bold text-xs sm:text-sm text-emerald-400 flex items-center gap-1 font-serif">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Direct Priority Reservation
            </span>
          </div>
        </div>

        {/* Sanctuary Overview & Amenities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e2d1be] shadow-xs space-y-4">
              <h2 className="font-serif text-xl font-bold text-[#3b2314] border-b border-[#efe2d3] pb-3">
                Sanctuary Overview
              </h2>
              <p className="text-sm text-stone-700 leading-relaxed font-serif">
                {currentHotel.description}
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e2d1be] shadow-xs space-y-4">
              <h2 className="font-serif text-xl font-bold text-[#3b2314] border-b border-[#efe2d3] pb-3">
                Lodge Amenities & Bespoke Experiences
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentHotel.amenities.map((amenity, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#f5eee4]/60 border border-[#e2d1be] text-xs font-serif font-bold text-[#3b2314] flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#d96b27] shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo Gallery Grid */}
            {currentHotel.images && currentHotel.images.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e2d1be] shadow-xs space-y-4">
                <h2 className="font-serif text-xl font-bold text-[#3b2314] border-b border-[#efe2d3] pb-3">
                  Lodge Sanctuary Gallery
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentHotel.images.map((img, idx) => (
                    <div key={idx} className="h-48 rounded-xl overflow-hidden border border-[#e2d1be]">
                      <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar CTA & Benefits */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="bg-white p-6 rounded-2xl border border-[#e2d1be] shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#efe2d3]">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#d96b27] block font-serif">Lodge Tariff</span>
                  <span className="font-serif font-bold text-[#3b2314] text-lg">${currentHotel.pricePerNightUSD.toLocaleString()} <span className="text-xs font-normal text-stone-500">/ night</span></span>
                </div>
                <span className="bg-[#f5eee4] text-[#3b2314] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#e2d1be] font-serif">
                  5-Star Sanctuary
                </span>
              </div>

              <div className="space-y-2.5">
                <a
                  href="https://www.bhutanlhtours.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-[#d96b27] hover:bg-[#b85116] text-white font-serif font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors min-h-[44px]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Include in Custom Itinerary</span>
                </a>

                <button
                  onClick={() => navigate('contact')}
                  className="w-full py-3 px-4 bg-[#f5eee4] hover:bg-[#efe2d3] text-[#3b2314] border border-[#e2d1be] font-serif font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors min-h-[40px]"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#d96b27]" />
                  <span>Inquire with Director</span>
                </button>
              </div>

              <div className="pt-3 border-t border-[#efe2d3] space-y-2 text-xs text-stone-600 font-serif">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Approved Operator License #BLHT-8842</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#d96b27] shrink-0" />
                  <span>Full Visa & Clearance Included</span>
                </div>
              </div>
            </div>

            {/* Need Direct Assistance Card */}
            <div className="bg-white p-5 rounded-2xl border border-[#e2d1be] shadow-xs space-y-3 text-xs font-serif">
              <h4 className="font-bold text-[#3b2314] flex items-center gap-2 text-sm">
                <PhoneCall className="w-4 h-4 text-[#d96b27]" />
                <span>24/7 Director Concierge</span>
              </h4>
              <p className="text-stone-600 leading-relaxed">
                Have questions about lodge availability, room upgrades, or flight connections?
              </p>
              <div className="font-mono text-[#3b2314] font-bold pt-1">
                +975-17377777 / +975-77444445
              </div>
            </div>
          </div>

        </div>

        {/* RELATED STUFFS SECTION 1: Other Luxury Sanctuaries */}
        <div className="pt-8 border-t border-[#e2d1be]">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#d96b27] uppercase tracking-wider font-serif">
                <Building2 className="w-4 h-4" />
                <span>Explore Other Sanctuaries</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#3b2314] mt-1">
                Other Luxury Lodges in Bhutan
              </h2>
            </div>

            <button
              onClick={() => navigate('hotels')}
              className="text-xs font-serif font-bold text-[#d96b27] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({hotels.length}) Lodges</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedHotels.map(h => (
              <div
                key={h.id}
                onClick={() => {
                  setActiveHotel(h);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white border border-[#e2d1be] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
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
                    <span className="text-[#d96b27] font-bold group-hover:underline">Explore Lodge →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RELATED STUFFS SECTION 2: Journeys Visiting This Lodge / Region */}
        <div className="pt-8 border-t border-[#e2d1be]">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#d96b27] uppercase tracking-wider font-serif">
                <Compass className="w-4 h-4" />
                <span>Featured Itineraries</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#3b2314] mt-1">
                Journeys Including {currentHotel.region} & {currentHotel.brand}
              </h2>
            </div>

            <button
              onClick={() => navigate('luxury')}
              className="text-xs font-serif font-bold text-[#d96b27] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All Journeys</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPackages.length > 0 ? relatedPackages.map(pkg => (
              <div
                key={pkg.id}
                onClick={() => {
                  setActivePackage(pkg);
                }}
                className="bg-white border border-[#e2d1be] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={pkg.heroImage} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-[#d96b27] text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-md font-serif">
                    {pkg.category}
                  </span>
                  <div className="absolute bottom-3 right-3 bg-[#3b2314]/90 text-amber-200 text-xs font-bold font-serif px-2.5 py-1 rounded-md">
                    ${pkg.priceUSD ? pkg.priceUSD.toLocaleString() : 'Contact'} / guest
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#3b2314] group-hover:text-[#d96b27] transition-colors">
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-stone-600 font-serif line-clamp-2 mt-1">
                      {pkg.subtitle}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#efe2d3] flex items-center justify-between text-xs font-serif text-stone-600">
                    <span className="font-bold text-[#3b2314]">{pkg.durationDays} Days</span>
                    <span className="text-[#d96b27] font-bold group-hover:underline">View Journey →</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center py-10 bg-white rounded-2xl border border-[#e2d1be]">
                <Compass className="w-10 h-10 text-[#d96b27] mx-auto mb-3" />
                <p className="text-sm text-stone-600 font-serif max-w-md mx-auto">
                  No specific itineraries currently feature this lodge. Contact our journey designers to create a custom experience including this sanctuary.
                </p>
                <button
                  onClick={() => navigate('contact')}
                  className="mt-5 px-6 py-2.5 bg-[#d96b27] hover:bg-[#b85116] text-white font-serif font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Request Custom Itinerary
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
