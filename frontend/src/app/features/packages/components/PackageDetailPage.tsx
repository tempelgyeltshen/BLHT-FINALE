import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft, Star, MapPin, Clock, Users, CalendarDays, CheckCircle2,
  XCircle, Sparkles, Compass, ChevronRight, PhoneCall, Phone, Mail,
  BedDouble, UtensilsCrossed, Trophy, BadgeCheck, ShieldCheck
} from 'lucide-react';
import { useApp } from '../../../core/providers/AppProvider';
import { usePackages } from '../hooks/usePackages';
import { AutoImageSlider } from '../../shared/components/media/AutoImageSlider';
import type { TourPackage } from '../../../../types';
import type { Package } from '../types/package.types';

/** Union of both shapes (context TourPackage + API Package) so rendering is safe for either source. */
type ResolvedPackage = TourPackage | Package;

const isItineraryDay = (d: unknown): d is NonNullable<TourPackage['itinerary']>[number] =>
  !!d && typeof d === 'object' && typeof (d as any).day === 'number';

export const PackageDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { packages, setActivePackage, navigate } = useApp();
  const { getPackage, loading: apiLoading } = usePackages();

  const [apiPackage, setApiPackage] = useState<Package | null>(null);

  // Resolve the package from the app's own data (initialData fallback,
  // localStorage, or the CMS fetch) by id or slug — works even when the
  // backend API is unreachable.
  const localPackage = useMemo<ResolvedPackage | null>(() => {
    if (!id) return null;
    return packages.find(p => p.id === id || p.slug === id) ?? null;
  }, [packages, id]);

  const activePackage = useMemo<ResolvedPackage | null>(() => {
    if (localPackage) return localPackage;
    if (apiPackage) return apiPackage;
    return null;
  }, [localPackage, apiPackage]);

  // Deep links (direct URL with an id that isn't in the local list): fall back
  // to the backend API. Errors are non-fatal — the local list already covers
  // every package shown on the site.
  useEffect(() => {
    setApiPackage(null);
    if (!id || localPackage) return;

    let cancelled = false;
    getPackage(id)
      .then(data => {
        if (!cancelled && data) setApiPackage(data);
      })
      .catch(() => { /* not in the API either — the not-found screen is shown */ });
    return () => { cancelled = true; };
  }, [id, localPackage, getPackage]);

  // Scroll to top whenever the resolved package changes.
  useEffect(() => {
    if (activePackage) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePackage?.id]);

  const handleGoBack = () => {
    navigate('luxury');
  };

  if (apiLoading && !localPackage) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d96b27] mx-auto" />
        <p className="mt-4 text-stone-600 font-serif">Curating journey details...</p>
      </div>
    );
  }

  if (!activePackage) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#3b2314]">Journey Not Found</h2>
        <p className="mt-2 text-sm text-stone-600 font-serif max-w-md mx-auto">
          We couldn't find that tour package. It may have been removed or the link is outdated.
        </p>
        <button
          onClick={handleGoBack}
          className="mt-6 px-6 py-2.5 bg-[#d96b27] hover:bg-[#b85116] text-white font-serif font-bold rounded-xl text-xs transition-colors cursor-pointer"
        >
          Back to All Journeys
        </button>
      </div>
    );
  }

  const pkg = activePackage;
  const title = pkg.title || 'Tour Journey';
  const subtitle = pkg.subtitle || '';
  const gallery = [pkg.heroImage, ...(pkg.galleryImages || [])].filter(Boolean);
  const highlights = pkg.highlights || [];
  const included = pkg.included || [];
  const excluded = pkg.excluded || [];
  const destinations = pkg.destinations || [];
  const itinerary = Array.isArray(pkg.itinerary) ? pkg.itinerary : [];
  const rating = pkg.rating;
  const reviewsCount = pkg.reviewsCount;

  // Related journeys: same category or shared destination first, then any others.
  const related = packages
    .filter(p => p.id !== pkg.id && p.title !== pkg.title)
    .sort((a, b) => {
      const aScore = (a.category === pkg.category ? 1 : 0) + (a.destinations?.some(d => destinations.includes(d)) ? 1 : 0);
      const bScore = (b.category === pkg.category ? 1 : 0) + (b.destinations?.some(d => destinations.includes(d)) ? 1 : 0);
      return bScore - aScore;
    })
    .slice(0, 3);

  return (
    <div className="bg-[#fcf8f2] min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* Top Navigation */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-1">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#3b2314] bg-[#f5eee4] hover:bg-[#3b2314] hover:text-amber-100 border border-[#e2d1be] px-4 py-2 rounded-full transition-all shadow-xs cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-[#d96b27] group-hover:text-amber-200 transition-colors" />
            <span>Back to Journeys</span>
          </button>

          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-2 text-xs text-stone-600">
            <span onClick={() => navigate('home')} className="hover:text-[#d96b27] cursor-pointer transition-colors">Home</span>
            <span className="text-stone-400">/</span>
            <span onClick={() => navigate('luxury')} className="hover:text-[#d96b27] cursor-pointer transition-colors">Journeys</span>
            <span className="text-stone-400">/</span>
            <span className="font-semibold text-[#d96b27] truncate max-w-[220px]">{title}</span>
          </nav>
        </div>

        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden shadow-xl border border-[#e2d1be] bg-stone-900 group"
        >
          <AutoImageSlider
            images={gallery}
            alt={title}
            intervalMs={5000}
            className="h-72 sm:h-96 md:h-[440px] w-full"
            imageClassName="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#1d1007] via-[#1d1007]/45 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white pointer-events-none">
              <div className="flex flex-wrap items-center gap-2 mb-3 pointer-events-auto">
                <span className="bg-[#d96b27] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full font-serif">
                  {pkg.category}
                </span>
                {pkg.hotelCategory && (
                  <span className="bg-[#3b2314]/90 border border-[#d96b27]/40 text-amber-200 text-[11px] font-semibold px-3 py-1 rounded-full font-serif">
                    {pkg.hotelCategory}
                  </span>
                )}
                {pkg.featured && (
                  <span className="bg-amber-400/95 text-amber-950 text-[11px] font-bold px-3 py-1 rounded-full font-serif">
                    ★ Featured Journey
                  </span>
                )}
              </div>
              <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-amber-50 leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-amber-100/90 text-sm sm:text-base mt-2 max-w-3xl font-serif italic">
                  {subtitle}
                </p>
              )}
            </div>
          </AutoImageSlider>
        </motion.div>

        {/* Quick Details Bar */}
        <div className="bg-[#3b2314] text-amber-100 rounded-2xl p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium border border-[#e2d1be] shadow-md">
          <div className="p-2 border-r sm:border-r border-[#5c3820] last:border-0">
            <span className="text-[#d96b27] text-[10px] uppercase font-bold tracking-wider block mb-1">Duration</span>
            <span className="font-bold text-sm sm:text-base text-white flex items-center gap-1.5 font-serif">
              <Clock className="w-4 h-4 text-[#d96b27]" />
              {pkg.durationDays} Days / {Math.max(pkg.durationDays - 1, 0)} Nights
            </span>
          </div>

          <div className="p-2 border-r sm:border-r border-[#5c3820] last:border-0">
            <span className="text-[#d96b27] text-[10px] uppercase font-bold tracking-wider block mb-1">Investment Per Guest</span>
            <span className="font-bold text-sm sm:text-base text-amber-300 font-serif">
              ${pkg.priceUSD.toLocaleString()} USD
            </span>
          </div>

          <div className="p-2 border-r sm:border-r border-[#5c3820] last:border-0">
            <span className="text-[#d96b27] text-[10px] uppercase font-bold tracking-wider block mb-1">Guest Rating</span>
            <span className="font-bold text-sm sm:text-base text-white flex items-center gap-1 font-serif">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              {rating ? `${rating.toFixed(2)}` : 'Exceptional'}
              {typeof reviewsCount === 'number' && <span className="text-xs font-normal text-amber-200/80">({reviewsCount})</span>}
            </span>
          </div>

          <div className="p-2">
            <span className="text-[#d96b27] text-[10px] uppercase font-bold tracking-wider block mb-1">Destinations</span>
            <span className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5 font-serif">
              <MapPin className="w-4 h-4 text-[#d96b27] shrink-0" />
              <span className="truncate">{destinations.length ? destinations.join(', ') : 'Bhutan'}</span>
            </span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">

            {/* Overview */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7 }}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e2d1be] shadow-xs space-y-4"
            >
              <h2 className="font-serif text-xl font-bold text-[#3b2314] border-b border-[#efe2d3] pb-3">
                Journey Overview
              </h2>
              <p className="text-sm text-stone-700 leading-relaxed font-serif">
                {pkg.description}
              </p>
              {highlights.length > 0 && (
                <div className="pt-2">
                  <h3 className="font-serif text-sm font-bold text-[#d96b27] uppercase tracking-wider mb-3">Key Highlights</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {highlights.map((h, i) => (
                      <div key={i} className="p-3 rounded-xl bg-[#f5eee4]/70 border border-[#e2d1be] text-xs font-serif text-[#3b2314] flex items-start gap-2">
                        <BadgeCheck className="w-4 h-4 text-[#d96b27] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Itinerary */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7 }}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e2d1be] shadow-xs"
            >
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#efe2d3] pb-3 mb-6">
                <h2 className="font-serif text-xl font-bold text-[#3b2314] flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-[#d96b27]" />
                  Day-by-Day Itinerary
                </h2>
                <span className="text-[10px] font-bold text-[#d96b27] bg-[#f5eee4] border border-[#e2d1be] px-2.5 py-1 rounded-full">
                  {itinerary.length} Days
                </span>
              </div>

              {itinerary.length === 0 ? (
                <div className="text-center py-10">
                  <Compass className="w-10 h-10 text-[#d96b27] mx-auto mb-3" />
                  <p className="text-sm text-stone-600 font-serif max-w-md mx-auto">
                    A detailed day-by-day itinerary is available on request. Contact our journey designers to tailor this experience to your dates and preferences.
                  </p>
                  <button
                    onClick={() => navigate('contact')}
                    className="mt-5 px-6 py-2.5 bg-[#d96b27] hover:bg-[#b85116] text-white font-serif font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Request Full Itinerary
                  </button>
                </div>
              ) : (
                <div className="relative space-y-5">
                  {/* vertical connector line */}
                  <div className="absolute left-[21px] sm:left-[25px] top-3 bottom-3 w-px bg-[#e2d1be]" aria-hidden />
                  {itinerary.map((item, index) => {
                    const dayNum = isItineraryDay(item) ? item.day : index + 1;
                    const titleText = (item as any).title || `Day ${dayNum}`;
                    const locationText = (item as any).location;
                    const descriptionText = (item as any).description;
                    const dayHighlights = (item as any).highlights;
                    const accommodation = (item as any).accommodation;
                    const meals = (item as any).meals;
                    return (
                      <motion.div
                        key={`${dayNum}-${index}`}
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4) }}
                        className="relative flex gap-4 sm:gap-5"
                      >
                        <div className="w-11 h-11 sm:w-[50px] sm:h-[50px] rounded-full bg-gradient-to-br from-[#d96b27] to-[#b85116] text-white flex items-center justify-center font-serif font-bold text-xs sm:text-sm shadow-md ring-4 ring-[#f5eee4] shrink-0 z-10">
                          {dayNum}
                        </div>
                        <div className="flex-1 bg-[#fcf8f2] border border-[#e2d1be] rounded-2xl p-4 sm:p-5 hover:border-[#d96b27]/60 transition-colors">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <h3 className="font-serif font-bold text-sm sm:text-base text-[#3b2314]">{titleText}</h3>
                            {locationText && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-[#d96b27] bg-white border border-[#e2d1be] px-2 py-0.5 rounded-full">
                                <MapPin className="w-3 h-3" />
                                {locationText}
                              </span>
                            )}
                          </div>
                          {descriptionText && (
                            <p className="text-xs text-stone-700 font-serif leading-relaxed">{descriptionText}</p>
                          )}
                          {Array.isArray(dayHighlights) && dayHighlights.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {dayHighlights.map((h: string, i: number) => (
                                <span key={i} className="text-[10px] font-bold text-[#3b2314] bg-white border border-[#e2d1be] px-2 py-1 rounded-md">
                                  ✓ {h}
                                </span>
                              ))}
                            </div>
                          )}
                          {(accommodation || meals) && (
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 pt-3 border-t border-[#e2d1be] text-[10px] font-bold text-stone-600">
                              {accommodation && (
                                <span className="flex items-center gap-1.5">
                                  <BedDouble className="w-3.5 h-3.5 text-[#d96b27]" />
                                  {accommodation}
                                </span>
                              )}
                              {meals && (
                                <span className="flex items-center gap-1.5">
                                  <UtensilsCrossed className="w-3.5 h-3.5 text-[#d96b27]" />
                                  {meals}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Gallery */}
            {gallery.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7 }}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e2d1be] shadow-xs"
              >
                <h2 className="font-serif text-xl font-bold text-[#3b2314] border-b border-[#efe2d3] pb-3 mb-4">
                  Journey Gallery
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {gallery.map((img, idx) => (
                    <div key={idx} className="h-48 rounded-xl overflow-hidden border border-[#e2d1be]">
                      <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-24">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7 }}
              className="bg-white p-6 rounded-2xl border border-[#e2d1be] shadow-xs space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#efe2d3]">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#d96b27] block font-serif">Journey Investment</span>
                  <span className="font-serif font-bold text-[#3b2314] text-lg">
                    ${pkg.priceUSD.toLocaleString()} <span className="text-xs font-normal text-stone-500">USD / guest</span>
                  </span>
                </div>
                <span className="bg-[#f5eee4] text-[#3b2314] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#e2d1be] font-serif">
                  {pkg.durationDays} Days
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
                  <span>Inquire About This Journey</span>
                </button>
              </div>

              <div className="pt-3 border-t border-[#efe2d3] space-y-2 text-xs text-stone-600 font-serif">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Approved Operator License #BLHT-8842</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#d96b27] shrink-0" />
                  <span>Full Visa &amp; Permits Included</span>
                </div>
                {destinations.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#d96b27] shrink-0" />
                    <span>{destinations.join(', ')}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {included.length > 0 && (
              <div className="bg-green-50/70 border border-green-200 rounded-2xl p-6 space-y-3">
                <h3 className="font-serif text-base font-bold text-green-950 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-700" />
                  What's Included
                </h3>
                <ul className="space-y-2">
                  {included.map((item, index) => (
                    <li key={index} className="text-xs text-stone-700 font-serif flex items-start gap-2">
                      <span className="text-green-700 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {excluded.length > 0 && (
              <div className="bg-red-50/60 border border-red-200 rounded-2xl p-6 space-y-3">
                <h3 className="font-serif text-base font-bold text-red-950 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-700" />
                  Not Included
                </h3>
                <ul className="space-y-2">
                  {excluded.map((item, index) => (
                    <li key={index} className="text-xs text-stone-700 font-serif flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">✕</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Concierge Card */}
            <div className="bg-white p-5 rounded-2xl border border-[#e2d1be] shadow-xs space-y-3 text-xs font-serif">
              <h4 className="font-bold text-[#3b2314] flex items-center gap-2 text-sm">
                <PhoneCall className="w-4 h-4 text-[#d96b27]" />
                <span>24/7 Director Concierge</span>
              </h4>
              <p className="text-stone-600 leading-relaxed">
                Speak directly with our journey designers to customize dates, lodges, or add private experiences.
              </p>
              <div className="space-y-1.5 text-[#3b2314] font-bold">
                <div className="flex items-center gap-2 font-mono"><Phone className="w-3.5 h-3.5 text-[#d96b27]" /> +975-17377777 / +975-77444445</div>
                <div className="flex items-center gap-2 font-mono break-all"><Mail className="w-3.5 h-3.5 text-[#d96b27]" /> pemsbumthap@gmail.com</div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Journeys */}
        {related.length > 0 && (
          <div className="pt-8 border-t border-[#e2d1be]">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#d96b27] uppercase tracking-wider font-serif">
                  <Trophy className="w-4 h-4" />
                  <span>Continue Exploring</span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-[#3b2314] mt-1">
                  Other Journeys You'll Love
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
              {related.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => setActivePackage(rel)}
                  className="bg-white border border-[#e2d1be] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={rel.heroImage} alt={rel.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 bg-[#d96b27] text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-md font-serif">
                      {rel.category}
                    </span>
                    <div className="absolute bottom-3 right-3 bg-[#3b2314]/90 text-amber-200 text-xs font-bold font-serif px-2.5 py-1 rounded-md">
                      ${rel.priceUSD.toLocaleString()} / guest
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-serif text-base font-bold text-[#3b2314] group-hover:text-[#d96b27] transition-colors">
                        {rel.title}
                      </h3>
                      <p className="text-xs text-stone-600 font-serif line-clamp-2 mt-1">
                        {rel.subtitle}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#efe2d3] flex items-center justify-between text-xs font-serif text-stone-600">
                      <span className="font-bold text-[#3b2314]">{rel.durationDays} Days</span>
                      <span className="text-[#d96b27] font-bold group-hover:underline">View Journey →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
