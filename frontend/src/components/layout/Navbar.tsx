import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Search, Menu, X, Globe, ChevronRight, ChevronDown, MapPin, Calendar, 
  BookOpen, Compass, Building2, Sparkles, Check, Mountain, Video, Layers, Image as ImageIcon
} from 'lucide-react';
import bhutanLogo from '../../assets/images/blht_logo.png';

export const Navbar: React.FC = () => {
  const { 
    currentRoute, navigate, 
    brochures, setActiveBrochure,
    packages, hotels, festivals,
    setActivePackage, setActiveHotel
  } = useApp();

  const { currentLanguage, setLanguage, languages, t } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLangOpen, setIsLangOpen] = useState(false);

  // Dropdown states
  const [isPackagesDropdownOpen, setIsPackagesDropdownOpen] = useState(false);
  const [isMediaDropdownOpen, setIsMediaDropdownOpen] = useState(false);

  // Mobile accordion states
  const [mobilePackagesOpen, setMobilePackagesOpen] = useState(true);
  const [mobileMediaOpen, setMobileMediaOpen] = useState(true);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const langContainerRef = useRef<HTMLDivElement>(null);
  const packagesContainerRef = useRef<HTMLDivElement>(null);
  const mediaContainerRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Hide navbar on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (mobileMenuOpen || isSearchExpanded || isLangOpen || isPackagesDropdownOpen || isMediaDropdownOpen) {
        setIsVisible(true);
        return;
      }
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen, isSearchExpanded, isLangOpen, isPackagesDropdownOpen, isMediaDropdownOpen]);

  // Close search, language & menu popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchExpanded(false);
      }
      if (langContainerRef.current && !langContainerRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (packagesContainerRef.current && !packagesContainerRef.current.contains(event.target as Node)) {
        setIsPackagesDropdownOpen(false);
      }
      if (mediaContainerRef.current && !mediaContainerRef.current.contains(event.target as Node)) {
        setIsMediaDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search items
  const q = searchQuery.trim().toLowerCase();
  const matchingPackages = q ? packages.filter(p => 
    p.title.toLowerCase().includes(q) || 
    p.destinations.some(d => d.toLowerCase().includes(q)) || 
    p.hotelCategory.toLowerCase().includes(q)
  ) : [];

  const matchingHotels = q ? hotels.filter(h => 
    h.name.toLowerCase().includes(q) || 
    h.location.toLowerCase().includes(q) || 
    h.brand.toLowerCase().includes(q)
  ) : [];

  const matchingFestivals = q ? festivals.filter(f => 
    f.name.toLowerCase().includes(q) || 
    f.location.toLowerCase().includes(q)
  ) : [];

  const matchingBrochures = q ? brochures.filter(b => 
    b.title.toLowerCase().includes(q) || 
    b.category.toLowerCase().includes(q)
  ) : [];

  const totalResults = matchingPackages.length + matchingHotels.length + matchingFestivals.length + matchingBrochures.length;

  const handleItemSelect = (action: () => void) => {
    action();
    setIsSearchExpanded(false);
    setSearchQuery('');
  };

  // Route active states
  const isPackagesActive = ['luxury', 'adventures', 'package-detail'].includes(currentRoute);
  const isMediaActive = ['brochures', 'videos', 'gallery', 'showcase', 'brochure-viewer'].includes(currentRoute);

  return (
    <header className={`sticky top-0 z-50 bg-[#fcf8f2] backdrop-blur-md border-b border-[#e2d1be] transition-transform duration-300 relative ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 border-b border-[#efe2d3] gap-2">
          
          {/* Top Left Corner: Brand Emblem & Logo Title */}
          <div 
            onClick={() => { navigate('home'); setMobileMenuOpen(false); }} 
            className="flex items-center gap-1.5 sm:gap-3 cursor-pointer group py-1 min-w-0"
          >
            <div className="w-11 h-11 xs:w-12 xs:h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-[#d96b27] shadow-md shrink-0 bg-white p-1 flex items-center justify-center">
              <img 
                src={bhutanLogo} 
                alt="Bhutan Land of Happiness Logo" 
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-left min-w-0">
              <span className="font-serif text-[11px] xs:text-xs sm:text-base md:text-lg lg:text-xl font-bold tracking-[0.04em] sm:tracking-[0.14em] uppercase text-[#3b2314] group-hover:text-[#d96b27] transition-colors block leading-tight truncate">
                BHUTAN LAND OF HAPPINESS
              </span>
              <span className="block text-[7px] xs:text-[8px] sm:text-[9px] font-sans tracking-[0.14em] sm:tracking-[0.22em] text-[#d96b27] font-bold uppercase mt-0.5 truncate">
                TOURISM AND TOURS
              </span>
            </div>
          </div>

          {/* Right Header Controls: Search, Language Dropdown, Plan Journey CTA & Mobile MENU Button */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
            
            {/* Inline Expandable Search Bar */}
            <div className="hidden lg:flex relative items-center" ref={searchContainerRef}>
              {!isSearchExpanded ? (
                <button
                  onClick={() => {
                    setIsSearchExpanded(true);
                    setTimeout(() => searchInputRef.current?.focus(), 50);
                  }}
                  className="p-2 xs:p-2.5 min-h-[40px] xs:min-h-[44px] min-w-[40px] xs:min-w-[44px] flex items-center gap-2 text-[#3b2314] hover:text-[#d96b27] cursor-pointer transition-all border border-[#3b2314]/20 rounded-md bg-[#f5eee4]/40 hover:bg-[#f5eee4]"
                  title="Quick Search"
                  aria-label="Search journeys"
                >
                  <Search className="w-4 h-4 text-[#d96b27]" />
                  <span className="hidden xl:inline text-xs font-serif text-[#5c3820]">Search...</span>
                </button>
              ) : (
                <div className="relative flex items-center animate-in fade-in zoom-in-95 duration-200">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search packages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-36 xs:w-52 sm:w-72 lg:w-80 bg-[#f5eee4] border-2 border-[#d96b27] py-2 pl-8 pr-7 text-xs font-serif text-[#3b2314] rounded-md shadow-inner focus:outline-hidden"
                  />
                  <Search className="w-3.5 h-3.5 text-[#d96b27] absolute left-2.5 pointer-events-none" />
                  {searchQuery ? (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 text-stone-500 hover:text-stone-800 p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button 
                      onClick={() => setIsSearchExpanded(false)}
                      className="absolute right-2 text-stone-500 hover:text-stone-800 p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {/* Real-time Search Dropdown Overlay */}
              {isSearchExpanded && searchQuery.trim() !== '' && (
                <div className="absolute top-full right-0 mt-2 w-80 xs:w-96 sm:w-[480px] bg-[#fcf8f2] border-2 border-[#d96b27] rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[75vh] flex flex-col divide-y divide-[#efe2d3]">
                  {totalResults === 0 ? (
                    <div className="p-6 text-center text-xs font-serif text-stone-600">
                      No results found matching "<span className="font-bold text-[#d96b27]">{searchQuery}</span>". Try searching for "Paro", "Amankora", "Tshechu", or "Luxury".
                    </div>
                  ) : (
                    <div className="overflow-y-auto p-3 space-y-4">
                      
                      {/* Packages */}
                      {matchingPackages.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-[#d96b27] uppercase tracking-wider font-serif border-b border-[#efe2d3] mb-2">
                            <Compass className="w-3.5 h-3.5" />
                            <span>Tour Packages & Circuits ({matchingPackages.length})</span>
                          </div>
                          <div className="space-y-1.5">
                            {matchingPackages.map(pkg => (
                              <div
                                key={pkg.id}
                                onClick={() => handleItemSelect(() => setActivePackage(pkg))}
                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f5eee4] cursor-pointer transition-colors group"
                              >
                                <img src={pkg.heroImage} alt="" className="w-12 h-12 rounded-lg object-cover border border-[#e2d1be] shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-serif font-bold text-xs text-[#3b2314] group-hover:text-[#d96b27] truncate">
                                    {pkg.title}
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] text-stone-600 mt-0.5">
                                    <span>{pkg.durationDays} Days</span>
                                    <span>•</span>
                                    <span className="truncate">{pkg.destinations.join(', ')}</span>
                                  </div>
                                </div>
                                <div className="text-right shrink-0">
                                  <div className="font-serif font-bold text-xs text-[#d96b27]">${pkg.priceUSD.toLocaleString()}</div>
                                  <span className="text-[9px] text-stone-500 uppercase">View Details</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Hotels */}
                      {matchingHotels.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-[#d96b27] uppercase tracking-wider font-serif border-b border-[#efe2d3] mb-2">
                            <Building2 className="w-3.5 h-3.5" />
                            <span>Luxury Lodges & Sanctuary ({matchingHotels.length})</span>
                          </div>
                          <div className="space-y-1.5">
                            {matchingHotels.map(h => (
                              <div
                                key={h.id}
                                onClick={() => handleItemSelect(() => setActiveHotel(h))}
                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f5eee4] cursor-pointer transition-colors group"
                              >
                                <img src={h.heroImage} alt="" className="w-12 h-12 rounded-lg object-cover border border-[#e2d1be] shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-serif font-bold text-xs text-[#3b2314] group-hover:text-[#d96b27] truncate">
                                    {h.name}
                                  </div>
                                  <div className="text-[10px] text-stone-600 flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-3 h-3 text-rose-800 shrink-0" />
                                    <span>{h.location} • {h.brand}</span>
                                  </div>
                                </div>
                                <span className="text-[9px] text-[#d96b27] font-bold uppercase shrink-0">Explore Lodge</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Festivals */}
                      {matchingFestivals.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-[#d96b27] uppercase tracking-wider font-serif border-b border-[#efe2d3] mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Sacred Festivals & Tshechus ({matchingFestivals.length})</span>
                          </div>
                          <div className="space-y-1.5">
                            {matchingFestivals.map(f => (
                              <div
                                key={f.id}
                                onClick={() => handleItemSelect(() => navigate('festivals'))}
                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f5eee4] cursor-pointer transition-colors group"
                              >
                                <img src={f.heroImage} alt="" className="w-12 h-12 rounded-lg object-cover border border-[#e2d1be] shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-serif font-bold text-xs text-[#3b2314] group-hover:text-[#d96b27] truncate">
                                    {f.name}
                                  </div>
                                  <div className="text-[10px] text-stone-600 flex items-center gap-1 mt-0.5">
                                    <Calendar className="w-3 h-3 text-teal-800 shrink-0" />
                                    <span>{f.dates2026} ({f.location})</span>
                                  </div>
                                </div>
                                <span className="text-[9px] text-[#d96b27] font-bold uppercase shrink-0">View Festival</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Brochures */}
                      {matchingBrochures.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-[#d96b27] uppercase tracking-wider font-serif border-b border-[#efe2d3] mb-2">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Brochures & Guides ({matchingBrochures.length})</span>
                          </div>
                          <div className="space-y-1.5">
                            {matchingBrochures.map(b => (
                              <div
                                key={b.id}
                                onClick={() => handleItemSelect(() => setActiveBrochure(b))}
                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f5eee4] cursor-pointer transition-colors group"
                              >
                                <img src={b.coverImage} alt="" className="w-9 h-12 rounded-md object-cover border border-[#e2d1be] shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-serif font-bold text-xs text-[#3b2314] group-hover:text-[#d96b27] truncate">
                                    {b.title}
                                  </div>
                                  <div className="text-[10px] text-stone-600 truncate mt-0.5">
                                    {b.subtitle}
                                  </div>
                                </div>
                                <span className="text-[9px] text-[#d96b27] font-bold uppercase shrink-0">Open Reader</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                  {/* Footer link to full search page */}
                  <div className="p-2.5 bg-[#f5eee4] text-center">
                    <button
                      onClick={() => handleItemSelect(() => navigate('search'))}
                      className="text-xs font-serif font-bold text-[#d96b27] hover:underline cursor-pointer"
                    >
                      View all results on dedicated Search Page →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Language Selector Dropdown Button (Desktop only) */}
            <div className="hidden lg:block relative" ref={langContainerRef}>
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-2.5 py-2 min-h-[44px] text-xs font-serif tracking-[0.05em] text-[#5c3820] hover:text-[#d96b27] border border-[#3b2314]/20 rounded-md bg-[#f5eee4]/40 hover:bg-[#f5eee4] transition-colors cursor-pointer"
                title={t('nav.selectLanguage', 'Select Portal Language')}
              >
                <Globe className="w-4 h-4 text-[#d96b27]" />
                <span className="hidden sm:inline font-bold">{currentLanguage.name}</span>
              </button>

              {/* Language Selector Dropdown Popup */}
              {isLangOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-[#fcf8f2] border-2 border-[#d96b27] rounded-xl shadow-2xl z-50 overflow-hidden py-1 divide-y divide-[#efe2d3] font-serif text-xs">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-[#d96b27] tracking-wider bg-[#f5eee4]">
                    {t('nav.selectLanguage', 'Select Portal Language')}
                  </div>
                  <div className="py-1 max-h-60 overflow-y-auto">
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#f5eee4] hover:text-[#d96b27] transition-colors cursor-pointer ${
                          currentLanguage.code === lang.code ? 'font-bold text-[#d96b27] bg-[#f5eee4]' : 'text-[#3b2314]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{lang.name}</span>
                          <span className="text-[10px] text-stone-500 font-sans">({lang.native})</span>
                        </div>
                        {currentLanguage.code === lang.code && <Check className="w-3.5 h-3.5 text-[#d96b27]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Official Booking Site CTA (Desktop only) */}
            <a
              href="https://www.bhutanlhtours.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex bg-[#d96b27] hover:bg-[#b85116] text-[#fcf8f2] text-[10px] sm:text-[11px] font-bold tracking-[0.15em] uppercase px-3 sm:px-4 py-2.5 min-h-[44px] rounded-md transition-all cursor-pointer shadow-xs whitespace-nowrap items-center justify-center"
            >
              {t('nav.bookTour', 'Book Tour')}
            </a>

            {/* Mobile Hamburger MENU Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setIsSearchExpanded(false);
              }}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 min-h-[44px] text-xs font-bold tracking-[0.15em] uppercase text-[#3b2314] hover:text-[#d96b27] cursor-pointer transition-colors border border-[#3b2314]/30 rounded-md bg-[#f5eee4]/60 hover:bg-[#f5eee4]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#d96b27]" /> : <Menu className="w-5 h-5 text-[#d96b27]" />}
              <span className="font-serif">MENU</span>
            </button>

          </div>

        </div>

        {/* Desktop Sub-navigation Links */}
        <nav className="hidden lg:flex items-center justify-center gap-6 lg:gap-8 py-3 text-xs font-serif tracking-[0.1em] text-[#5c3820]">
          
          {/* HOME */}
          <button 
            onClick={() => navigate('home')}
            className={`flex items-center gap-1 font-serif text-xs tracking-[0.1em] cursor-pointer hover:text-[#d96b27] transition-colors py-1 ${
              currentRoute === 'home' ? 'text-[#d96b27] font-bold border-b-2 border-[#d96b27]' : 'text-[#3b2314]'
            }`}
          >
            <span>HOME</span>
          </button>

          {/* TOUR PACKAGES DROPDOWN */}
          <div 
            className="relative py-1"
            ref={packagesContainerRef}
            onMouseEnter={() => setIsPackagesDropdownOpen(true)}
            onMouseLeave={() => setIsPackagesDropdownOpen(false)}
          >
            <button
              onClick={() => {
                navigate('luxury');
                setIsPackagesDropdownOpen(false);
              }}
              className={`flex items-center gap-1 font-serif text-xs tracking-[0.1em] cursor-pointer transition-colors py-1 ${
                isPackagesActive ? 'text-[#d96b27] font-bold border-b-2 border-[#d96b27]' : 'text-[#5c3820] hover:text-[#d96b27]'
              }`}
            >
              <span>TOUR PACKAGES</span>
              <ChevronDown 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPackagesDropdownOpen(!isPackagesDropdownOpen);
                }}
                className={`w-3.5 h-3.5 transition-transform duration-200 ${isPackagesDropdownOpen ? 'rotate-180 text-[#d96b27]' : 'text-[#5c3820]'}`} 
              />
            </button>

            {isPackagesDropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-80 bg-[#fcf8f2] border-2 border-[#d96b27] rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-200 space-y-1 divide-y divide-[#efe2d3]/80">
                <div 
                  onClick={() => { navigate('luxury', 'cultural'); setIsPackagesDropdownOpen(false); }}
                  className="p-2.5 rounded-xl hover:bg-[#f5eee4] cursor-pointer transition-all group flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#efe2d3] text-[#d96b27] group-hover:bg-[#d96b27] group-hover:text-white flex items-center justify-center shrink-0 transition-colors mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-serif font-bold text-xs text-[#3b2314] group-hover:text-[#d96b27] transition-colors">
                      Cultural Tours
                    </div>
                    <div className="text-[10px] text-stone-600 font-sans mt-0.5 leading-snug">
                      Sacred monasteries, heritage circuits & spiritual odysseys
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => { navigate('adventures', 'trekking'); setIsPackagesDropdownOpen(false); }}
                  className="p-2.5 pt-3 rounded-xl hover:bg-[#f5eee4] cursor-pointer transition-all group flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#efe2d3] text-[#d96b27] group-hover:bg-[#d96b27] group-hover:text-white flex items-center justify-center shrink-0 transition-colors mt-0.5">
                    <Mountain className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-serif font-bold text-xs text-[#3b2314] group-hover:text-[#d96b27] transition-colors">
                      Trekking Packages
                    </div>
                    <div className="text-[10px] text-stone-600 font-sans mt-0.5 leading-snug">
                      Trans-Bhutan Trail & high Himalayan mountain passes
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => { navigate('adventures', 'adventure'); setIsPackagesDropdownOpen(false); }}
                  className="p-2.5 pt-3 rounded-xl hover:bg-[#f5eee4] cursor-pointer transition-all group flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#efe2d3] text-[#d96b27] group-hover:bg-[#d96b27] group-hover:text-white flex items-center justify-center shrink-0 transition-colors mt-0.5">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-serif font-bold text-xs text-[#3b2314] group-hover:text-[#d96b27] transition-colors">
                      Adventure Tours
                    </div>
                    <div className="text-[10px] text-stone-600 font-sans mt-0.5 leading-snug">
                      Helicopter expeditions, mountain biking & wild rafting
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FESTIVALS */}
          <button 
            onClick={() => navigate('festivals')}
            className={`transition-colors cursor-pointer py-1 ${
              currentRoute === 'festivals' ? 'text-[#d96b27] font-bold border-b-2 border-[#d96b27]' : 'text-[#5c3820] hover:text-[#d96b27]'
            }`}
          >
            {t('nav.festivals', 'FESTIVALS')}
          </button>

          {/* LUXURY LODGES */}
          <button 
            onClick={() => navigate('hotels')}
            className={`transition-colors cursor-pointer py-1 ${
              ['hotels', 'hotel-detail'].includes(currentRoute) ? 'text-[#d96b27] font-bold border-b-2 border-[#d96b27]' : 'text-[#5c3820] hover:text-[#d96b27]'
            }`}
          >
            {t('nav.hotels', 'LUXURY LODGES')}
          </button>

          {/* MEDIA DROPDOWN */}
          <div 
            className="relative py-1"
            ref={mediaContainerRef}
            onMouseEnter={() => setIsMediaDropdownOpen(true)}
            onMouseLeave={() => setIsMediaDropdownOpen(false)}
          >
            <button
              onClick={() => setIsMediaDropdownOpen(!isMediaDropdownOpen)}
              className={`flex items-center gap-1 font-serif text-xs tracking-[0.1em] cursor-pointer transition-colors py-1 ${
                isMediaActive ? 'text-[#d96b27] font-bold border-b-2 border-[#d96b27]' : 'text-[#5c3820] hover:text-[#d96b27]'
              }`}
            >
              <span>MEDIA</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMediaDropdownOpen ? 'rotate-180 text-[#d96b27]' : 'text-[#5c3820]'}`} />
            </button>

            {isMediaDropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-72 bg-[#fcf8f2] border-2 border-[#d96b27] rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-200 space-y-1 divide-y divide-[#efe2d3]/80">
                <div 
                  onClick={() => { navigate('brochures'); setIsMediaDropdownOpen(false); }}
                  className="p-2.5 rounded-xl hover:bg-[#f5eee4] cursor-pointer transition-all group flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#efe2d3] text-[#d96b27] group-hover:bg-[#d96b27] group-hover:text-white flex items-center justify-center shrink-0 transition-colors mt-0.5">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-serif font-bold text-xs text-[#3b2314] group-hover:text-[#d96b27] transition-colors">
                      E-Brochures
                    </div>
                    <div className="text-[10px] text-stone-600 font-sans mt-0.5 leading-snug">
                      Interactive digital guides & PDF downloads
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => { navigate('videos'); setIsMediaDropdownOpen(false); }}
                  className="p-2.5 pt-3 rounded-xl hover:bg-[#f5eee4] cursor-pointer transition-all group flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#efe2d3] text-[#d96b27] group-hover:bg-[#d96b27] group-hover:text-white flex items-center justify-center shrink-0 transition-colors mt-0.5">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-serif font-bold text-xs text-[#3b2314] group-hover:text-[#d96b27] transition-colors">
                      Videos
                    </div>
                    <div className="text-[10px] text-stone-600 font-sans mt-0.5 leading-snug">
                      Cinematic films & virtual tours across Bhutan’s valleys
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => { navigate('gallery'); setIsMediaDropdownOpen(false); }}
                  className="p-2.5 pt-3 rounded-xl hover:bg-[#f5eee4] cursor-pointer transition-all group flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#efe2d3] text-[#d96b27] group-hover:bg-[#d96b27] group-hover:text-white flex items-center justify-center shrink-0 transition-colors mt-0.5">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-serif font-bold text-xs text-[#3b2314] group-hover:text-[#d96b27] transition-colors">
                      Photo Gallery
                    </div>
                    <div className="text-[10px] text-stone-600 font-sans mt-0.5 leading-snug">
                      High-resolution Bhutan photo collection
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ABOUT US */}
          <button 
            onClick={() => navigate('about')}
            className={`transition-colors cursor-pointer py-1 ${
              currentRoute === 'about' ? 'text-[#d96b27] font-bold border-b-2 border-[#d96b27]' : 'text-[#5c3820] hover:text-[#d96b27]'
            }`}
          >
            {t('nav.about', 'ABOUT US')}
          </button>

          {/* CONTACT US */}
          <button 
            onClick={() => navigate('contact')}
            className={`transition-colors cursor-pointer py-1 ${
              currentRoute === 'contact' ? 'text-[#d96b27] font-bold border-b-2 border-[#d96b27]' : 'text-[#5c3820] hover:text-[#d96b27]'
            }`}
          >
            {t('nav.contact', 'CONTACT US')}
          </button>

        </nav>
      </div>

      {/* Mobile & Tablet Navigation Drawer Panel */}
      {mobileMenuOpen && (
        <>
          {/* Dark Backdrop Overlay */}
          <div 
            className="lg:hidden fixed inset-0 top-[64px] sm:top-[80px] bg-black/60 z-40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Dropdown Menu Container */}
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#fcf8f2] border-b-4 border-[#d96b27] shadow-2xl z-50 max-h-[80vh] sm:max-h-[85vh] overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
              
              {/* Inline Search Bar inside Mobile Menu */}
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Search lodges, festivals, circuits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#f5eee4] border border-[#e2d1be] py-3 pl-10 pr-4 text-xs font-serif text-[#3b2314] focus:outline-hidden focus:border-[#d96b27] rounded-md"
                />
                <Search className="w-4 h-4 text-[#d96b27] absolute left-3 top-3.5" />
              </div>

              {/* Mobile Menu Live Search Results */}
              {searchQuery.trim() !== '' && (
                <div className="bg-[#f5eee4] p-3 rounded-xl border border-[#d96b27] space-y-2 max-h-60 overflow-y-auto">
                  <div className="text-[10px] font-bold text-[#d96b27] uppercase tracking-wider">Search Results</div>
                  {totalResults === 0 ? (
                    <div className="text-xs text-stone-500 py-1 font-serif">No items found matching "{searchQuery}"</div>
                  ) : (
                    <div className="space-y-2">
                      {matchingPackages.map(pkg => (
                        <div 
                          key={pkg.id} 
                          onClick={() => { handleItemSelect(() => setActivePackage(pkg)); setMobileMenuOpen(false); }}
                          className="flex items-center gap-2 p-1.5 bg-white rounded-lg cursor-pointer text-xs font-serif font-bold text-[#3b2314]"
                        >
                          <Compass className="w-3.5 h-3.5 text-[#d96b27] shrink-0" />
                          <span className="truncate">{pkg.title}</span>
                        </div>
                      ))}
                      {matchingHotels.map(h => (
                        <div 
                          key={h.id} 
                          onClick={() => { handleItemSelect(() => setActiveHotel(h)); setMobileMenuOpen(false); }}
                          className="flex items-center gap-2 p-1.5 bg-white rounded-lg cursor-pointer text-xs font-serif font-bold text-[#3b2314]"
                        >
                          <Building2 className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                          <span className="truncate">{h.name}</span>
                        </div>
                      ))}
                      {matchingFestivals.map(f => (
                        <div 
                          key={f.id} 
                          onClick={() => { handleItemSelect(() => navigate('festivals')); setMobileMenuOpen(false); }}
                          className="flex items-center gap-2 p-1.5 bg-white rounded-lg cursor-pointer text-xs font-serif font-bold text-[#3b2314]"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="truncate">{f.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Language Selector inside Mobile Menu */}
              <div className="pt-2 border-t border-[#efe2d3]">
                <div className="text-[10px] font-bold text-[#d96b27] uppercase tracking-wider font-serif mb-2">
                  {t('nav.portalLanguage', 'Portal Language')}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs font-serif">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`py-2 px-2.5 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-colors ${
                        currentLanguage.code === lang.code 
                          ? 'border-[#d96b27] bg-[#efe2d3] font-bold text-[#d96b27]' 
                          : 'border-[#e2d1be] bg-[#f5eee4] text-[#3b2314] hover:bg-[#efe2d3]'
                      }`}
                    >
                      <span className="truncate">{lang.name}</span>
                      <span className="text-[9px] text-stone-500 font-sans ml-1">({lang.native})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Navigation items */}
              <div className="space-y-2.5 font-serif text-sm text-[#3b2314]">
                
                {/* HOME */}
                <button
                  onClick={() => { navigate('home'); setMobileMenuOpen(false); }}
                  className={`w-full text-left py-3 px-3.5 rounded-lg flex items-center justify-between font-medium cursor-pointer transition-colors ${
                    currentRoute === 'home' ? 'text-[#d96b27] font-bold bg-[#efe2d3]' : 'bg-[#f5eee4] hover:bg-[#efe2d3] hover:text-[#d96b27]'
                  }`}
                >
                  <span>Home</span>
                  <ChevronRight className="w-4 h-4 text-[#d96b27]" />
                </button>

                {/* TOUR PACKAGES ACCORDION */}
                <div className="rounded-xl border border-[#e2d1be] bg-[#f5eee4] overflow-hidden">
                  <button
                    onClick={() => setMobilePackagesOpen(!mobilePackagesOpen)}
                    className="w-full text-left py-3 px-3.5 flex items-center justify-between font-bold text-[#3b2314] hover:text-[#d96b27] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[#d96b27]" />
                      <span>Tour Packages</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[#d96b27] transition-transform duration-200 ${mobilePackagesOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {mobilePackagesOpen && (
                    <div className="px-3 pb-3 space-y-1.5 pt-1 border-t border-[#efe2d3]">
                      <button
                        onClick={() => { navigate('luxury', 'cultural'); setMobileMenuOpen(false); }}
                        className="w-full text-left py-2.5 px-3 rounded-lg bg-white/80 hover:bg-white text-xs font-serif font-bold text-[#3b2314] hover:text-[#d96b27] flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-[#d96b27]" />
                          <span>Cultural Tours</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#d96b27]" />
                      </button>

                      <button
                        onClick={() => { navigate('adventures', 'trekking'); setMobileMenuOpen(false); }}
                        className="w-full text-left py-2.5 px-3 rounded-lg bg-white/80 hover:bg-white text-xs font-serif font-bold text-[#3b2314] hover:text-[#d96b27] flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Mountain className="w-3.5 h-3.5 text-[#d96b27]" />
                          <span>Trekking Packages</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#d96b27]" />
                      </button>

                      <button
                        onClick={() => { navigate('adventures', 'adventure'); setMobileMenuOpen(false); }}
                        className="w-full text-left py-2.5 px-3 rounded-lg bg-white/80 hover:bg-white text-xs font-serif font-bold text-[#3b2314] hover:text-[#d96b27] flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Compass className="w-3.5 h-3.5 text-[#d96b27]" />
                          <span>Adventure Tours</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#d96b27]" />
                      </button>
                    </div>
                  )}
                </div>

                {/* FESTIVALS */}
                <button
                  onClick={() => { navigate('festivals'); setMobileMenuOpen(false); }}
                  className={`w-full text-left py-3 px-3.5 rounded-lg flex items-center justify-between font-medium cursor-pointer transition-colors ${
                    currentRoute === 'festivals' ? 'text-[#d96b27] font-bold bg-[#efe2d3]' : 'bg-[#f5eee4] hover:bg-[#efe2d3] hover:text-[#d96b27]'
                  }`}
                >
                  <span>Festivals</span>
                  <ChevronRight className="w-4 h-4 text-[#d96b27]" />
                </button>

                {/* LUXURY LODGES */}
                <button
                  onClick={() => { navigate('hotels'); setMobileMenuOpen(false); }}
                  className={`w-full text-left py-3 px-3.5 rounded-lg flex items-center justify-between font-medium cursor-pointer transition-colors ${
                    ['hotels', 'hotel-detail'].includes(currentRoute) ? 'text-[#d96b27] font-bold bg-[#efe2d3]' : 'bg-[#f5eee4] hover:bg-[#efe2d3] hover:text-[#d96b27]'
                  }`}
                >
                  <span>Luxury Lodges</span>
                  <ChevronRight className="w-4 h-4 text-[#d96b27]" />
                </button>

                {/* MEDIA ACCORDION */}
                <div className="rounded-xl border border-[#e2d1be] bg-[#f5eee4] overflow-hidden">
                  <button
                    onClick={() => setMobileMediaOpen(!mobileMediaOpen)}
                    className="w-full text-left py-3 px-3.5 flex items-center justify-between font-bold text-[#3b2314] hover:text-[#d96b27] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#d96b27]" />
                      <span>Media</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[#d96b27] transition-transform duration-200 ${mobileMediaOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {mobileMediaOpen && (
                    <div className="px-3 pb-3 space-y-1.5 pt-1 border-t border-[#efe2d3]">
                      <button
                        onClick={() => { navigate('brochures'); setMobileMenuOpen(false); }}
                        className="w-full text-left py-2.5 px-3 rounded-lg bg-white/80 hover:bg-white text-xs font-serif font-bold text-[#3b2314] hover:text-[#d96b27] flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-[#d96b27]" />
                          <span>E-Brochures</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#d96b27]" />
                      </button>

                      <button
                        onClick={() => { navigate('videos'); setMobileMenuOpen(false); }}
                        className="w-full text-left py-2.5 px-3 rounded-lg bg-white/80 hover:bg-white text-xs font-serif font-bold text-[#3b2314] hover:text-[#d96b27] flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Video className="w-3.5 h-3.5 text-[#d96b27]" />
                          <span>Videos</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#d96b27]" />
                      </button>
                    </div>
                  )}
                </div>

                {/* ABOUT US */}
                <button
                  onClick={() => { navigate('about'); setMobileMenuOpen(false); }}
                  className={`w-full text-left py-3 px-3.5 rounded-lg flex items-center justify-between font-medium cursor-pointer transition-colors ${
                    currentRoute === 'about' ? 'text-[#d96b27] font-bold bg-[#efe2d3]' : 'bg-[#f5eee4] hover:bg-[#efe2d3] hover:text-[#d96b27]'
                  }`}
                >
                  <span>About Us</span>
                  <ChevronRight className="w-4 h-4 text-[#d96b27]" />
                </button>

                {/* CONTACT US */}
                <button
                  onClick={() => { navigate('contact'); setMobileMenuOpen(false); }}
                  className={`w-full text-left py-3 px-3.5 rounded-lg flex items-center justify-between font-medium cursor-pointer transition-colors ${
                    currentRoute === 'contact' ? 'text-[#d96b27] font-bold bg-[#efe2d3]' : 'bg-[#f5eee4] hover:bg-[#efe2d3] hover:text-[#d96b27]'
                  }`}
                >
                  <span>Contact Us</span>
                  <ChevronRight className="w-4 h-4 text-[#d96b27]" />
                </button>

              </div>

              {/* Action buttons on Mobile Drawer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    navigate('brochures');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3.5 px-4 text-center text-xs tracking-[0.15em] uppercase border-2 border-[#d96b27] text-[#d96b27] font-bold hover:bg-[#d96b27] hover:text-white transition-all cursor-pointer min-h-[44px] rounded-lg flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{t('nav.viewBrochure', 'View Brochures')}</span>
                </button>

                <a
                  href="https://www.bhutanlhtours.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 text-center text-xs tracking-[0.15em] uppercase bg-[#d96b27] text-white font-bold hover:bg-[#b85116] transition-all cursor-pointer min-h-[44px] shadow-md rounded-lg flex items-center justify-center gap-2"
                >
                  <span>{t('nav.bookTour', 'Book Tour')}</span>
                </a>
              </div>

              <div className="text-center text-[10px] text-[#7c7468] pt-2 font-serif border-t border-[#efe2d3]">
                Bhutan Land Of Happiness Tours • Official Website
              </div>

            </div>
          </div>
        </>
      )}
    </header>
  );
};




