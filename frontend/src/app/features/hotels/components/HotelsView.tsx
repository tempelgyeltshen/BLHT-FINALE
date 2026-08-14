import React, { useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useNavigate as useReactNavigate } from 'react-router-dom';
import { useHotels } from '../hooks/useHotels';
import { Star } from 'lucide-react';
import { luxuryHoverProps } from '../../../../utils/motion';
import { FilterPill } from '../../shared/components/ui';
import { AutoImageSlider } from '../../shared/components/media/AutoImageSlider';
import { FALLBACK_HERO_IMAGES } from '../../shared/constants/media';
import { useApp } from '../../../core/providers/AppProvider';

export const HotelsView: React.FC = () => {
  const { hotels, loading } = useHotels();
  const { setActiveHotel } = useApp();
  const navigateRouter = useReactNavigate();
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [heroHovered, setHeroHovered] = useState(false);

  // Scroll Parallax for Hero Section
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // Hero slider images come from the hotels themselves; fall back to curated
  // lodge scenery when the list is empty or has fewer than 3 images.
  const heroSlideImages = useMemo(() => {
    const fromHotels = hotels.map(h => h.heroImage).filter(Boolean);
    return fromHotels.length >= 3 ? fromHotels : FALLBACK_HERO_IMAGES;
  }, [hotels]);

  const filteredHotels = hotels.filter(h => {
    if (selectedRegion === 'all') return true;
    return h.region.toLowerCase() === selectedRegion.toLowerCase();
  });

  const handleHotelClick = (hotel: any) => {
    setActiveHotel(hotel);
    const hotelSlug = hotel.slug || hotel.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    navigateRouter(`/hotels/${hotelSlug}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:8 py-12">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900 mx-auto"></div>
          <p className="mt-4 text-stone-600">Loading luxury sanctuaries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcf8f2] text-[#2b1d14] overflow-hidden">

      {/* Hero Header Block with Auto-Sliding Image Background */}
      <div
        ref={heroRef}
        className="relative min-h-[68vh] sm:min-h-[82vh] flex items-center overflow-hidden bg-[#1f130b]"
        onMouseEnter={() => setHeroHovered(true)}
        onMouseLeave={() => setHeroHovered(false)}
      >
        {/* Auto-sliding hero background — slides on its own, pauses on hover */}
        <div className="absolute inset-0">
          <AutoImageSlider
            images={heroSlideImages}
            alt="Luxury Lodge"
            intervalMs={5000}
            paused={heroHovered}
            showDots
            showArrows={false}
            showCounter={false}
            className="w-full h-full"
            imageClassName="object-cover"
          >
            {/* Readability overlays blending into the page background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#140c06]/85 via-[#1f130b]/45 to-[#fcf8f2]/95 pointer-events-none z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#140c06]/70 via-[#1f130b]/20 to-transparent pointer-events-none z-10" />
          </AutoImageSlider>
        </div>

        <motion.section
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center space-y-6 sm:space-y-8"
        >
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[10px] sm:text-xs font-sans tracking-[0.25em] sm:tracking-[0.35em] uppercase text-[#f28e2b] font-bold block"
          >
            Ultra-Luxury Sanctuaries
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-[0.06em] sm:tracking-[0.08em] uppercase text-[#f7f1e7] drop-shadow-md leading-tight"
          >
            5-Star Luxury Lodge Directory
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-sm sm:text-lg text-amber-100/90 max-w-3xl mx-auto leading-relaxed font-normal drop-shadow-sm"
          >
            Partnered with the world's most prestigious luxury hospitality brands: Aman (Amankora), Six Senses Bhutan, COMO Uma Paro, Pemako Thimphu, Zhiwa Ling Heritage, and BLHT Sanctuaries.
          </motion.p>

          {/* Section Divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.8 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="pt-6 sm:pt-10 pb-2 sm:pb-4 relative flex items-center justify-center"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e2d1be]" />
            </div>
            <div className="relative bg-[#fcf8f2] px-4 sm:px-6 text-[9px] sm:text-[10px] font-sans tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#d96b27] font-semibold">
              Handpicked Valleys, Unrivalled Rest
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-xs sm:text-base text-amber-100/80 max-w-3xl mx-auto leading-relaxed drop-shadow-sm"
          >
            Explore our collection of exclusive 5-star lodges across Paro, Thimphu, Punakha, Gangtey, and Bumthang — each a sanctuary of serene luxury in the Kingdom of Happiness.
          </motion.p>
        </motion.section>
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

        {/* Region Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap items-center gap-2 border-b border-amber-200 pb-4"
        >
          {['all', 'Paro', 'Thimphu', 'Punakha', 'Gangtey', 'Bumthang'].map(region => (
            <FilterPill
              key={region}
              variant="squareLg"
              active={selectedRegion === region}
              onClick={() => setSelectedRegion(region)}
            >
              {region === 'all' ? 'All Regions' : `${region} Valley`}
            </FilterPill>
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
              onClick={() => handleHotelClick(hotel)}
              className="bg-white rounded-2xl overflow-hidden border border-amber-200 shadow-md transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="relative h-60 overflow-hidden">
                  <img src={hotel.heroImage} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-amber-950/80 text-amber-200 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">
                    {hotel.brand}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-amber-900/90 text-amber-100 text-xs font-bold px-3 py-1 rounded-lg">
                    ${hotel.pricePerNightUSD.toLocaleString()} / night
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: hotel.starRating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                    <span className="text-xs font-semibold text-stone-600 ml-1">({hotel.region} Valley)</span>
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
                    handleHotelClick(hotel);
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
    </div>
  );
};
