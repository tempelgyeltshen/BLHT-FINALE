import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate as useReactNavigate } from 'react-router-dom';
import { 
  TourPackage, Hotel, Festival, Brochure, GalleryItem, VideoItem, 
  ContactInquiry, HomepageConfig, ViewRoute 
} from '../types';
import { 
  initialPackages, initialHotels, initialFestivals, initialBrochures, 
  initialGallery, initialVideos, initialInquiries, initialHomepageConfig 
} from '../data/initialData';
import { useLanguage } from './LanguageContext';
import { 
  translatePackage, translateHotel, translateFestival, translateBrochure 
} from '../data/translations';
import { api } from '../api/client';
import { useAuth } from '../auth/useAuth';

interface AppContextType {
  // Navigation
  currentRoute: ViewRoute;
  selectedParam: string | null;
  navigate: (route: ViewRoute, param?: string | null) => void;
  isNavigating: boolean;
  navLoadingText: string | null;

  // Data Collections
  packages: TourPackage[];
  hotels: Hotel[];
  festivals: Festival[];
  brochures: Brochure[];
  gallery: GalleryItem[];
  videos: VideoItem[];
  inquiries: ContactInquiry[];
  homepageConfig: HomepageConfig;

  // Selected item states for detail views/modals
  activeBrochure: Brochure | null;
  setActiveBrochure: (b: Brochure | null, overrideReturnRoute?: ViewRoute) => void;
  brochureReturnRoute: ViewRoute;
  activePackage: TourPackage | null;
  setActivePackage: (p: TourPackage | null) => void;
  activeHotel: Hotel | null;
  setActiveHotel: (h: Hotel | null) => void;

  // Admin state
  isAdminLoggedIn: boolean;
  adminUser: { name: string; email: string; role: string } | null;
  loginAdmin: (email: string, password: string) => Promise<boolean>;
  logoutAdmin: () => Promise<void>;

  // CRUD Operations
  addPackage: (pkg: Omit<TourPackage, 'id'>) => Promise<void>;
  updatePackage: (id: string, pkg: Partial<TourPackage>) => Promise<void>;
  deletePackage: (id: string) => Promise<void>;

  addHotel: (hotel: Omit<Hotel, 'id'>) => Promise<void>;
  updateHotel: (id: string, hotel: Partial<Hotel>) => Promise<void>;
  deleteHotel: (id: string) => Promise<void>;

  addFestival: (fest: Omit<Festival, 'id'>) => Promise<void>;
  updateFestival: (id: string, fest: Partial<Festival>) => Promise<void>;
  deleteFestival: (id: string) => Promise<void>;

  addBrochure: (brochure: Omit<Brochure, 'id' | 'downloadCount'>) => Promise<void>;
  deleteBrochure: (id: string) => Promise<void>;
  logBrochureDownload: (brochureId: string, email?: string) => void;

  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => Promise<void>;
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;

  addVideoItem: (item: Omit<VideoItem, 'id'>) => Promise<void>;
  updateVideoItem: (id: string, item: Partial<VideoItem>) => Promise<void>;
  deleteVideoItem: (id: string) => Promise<void>;

  submitInquiry: (inquiry: Omit<ContactInquiry, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateInquiryStatus: (id: string, status: ContactInquiry['status'], notes?: string) => Promise<void>;

  updateHomepageConfig: (cfg: Partial<HomepageConfig>) => Promise<void>;
  

  // Toast
  toast: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'blht_bhutan_portal_v1';

const parseAdminPathname = (pathname: string): ViewRoute | null => {
  const normalized = pathname.replace(/^\/+/g, '').replace(/\/+$/g, '').toLowerCase();
  switch (normalized) {
    case 'admin':
    case 'admin/login':
    case 'admin-login':
      return 'admin-login';
    case 'admin/dashboard':
    case 'admin-dashboard':
      return 'admin-dashboard';
    case 'admin/packages':
      return 'admin-packages';
    case 'admin/categories':
      return 'admin-categories';
    case 'admin/brochures':
      return 'admin-brochures';
    case 'admin/brochure-viewer':
    case 'admin/brochure':
      return 'admin-brochure-viewer';
    case 'admin/hotels':
      return 'admin-hotels';
    case 'admin/festivals':
      return 'admin-festivals';
    case 'admin/videos':
      return 'admin-videos';
    case 'admin/gallery':
      return 'admin-gallery';
    case 'admin/homepage':
      return 'admin-homepage';
    case 'admin/contacts':
      return 'admin-contacts';
    default:
      return null;
  }
};

const getRouteFromLocation = (): ViewRoute => {
  const adminPathRoute = parseAdminPathname(window.location.pathname);
  if (adminPathRoute) {
    return adminPathRoute;
  }

  const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
  if (rawHash === 'admin' || rawHash === 'admin-login') return 'admin-login';

  const validPublicRoutes: ViewRoute[] = [
    'home', 'about', 'luxury', 'package-detail', 'adventures', 'festivals', 'hotels', 'hotel-detail',
    'brochures', 'brochure-viewer', 'videos', 'gallery', 'showcase', 'search', 'contact',
    'privacy', 'terms', 'privacy-terms'
  ];

  const validAdminRoutes: ViewRoute[] = [
    'admin-login', 'admin-dashboard', 'admin-packages', 'admin-categories', 'admin-brochures',
    'admin-brochure-viewer', 'admin-hotels', 'admin-festivals', 'admin-videos', 'admin-gallery',
    'admin-homepage', 'admin-contacts'
  ];

  if (validPublicRoutes.includes(rawHash as ViewRoute)) {
    return rawHash as ViewRoute;
  }

  if (validAdminRoutes.includes(rawHash as ViewRoute)) {
    return rawHash as ViewRoute;
  }

  return 'home';
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const reactNavigate = useReactNavigate();
  const [currentRoute, setCurrentRoute] = useState<ViewRoute>(() => getRouteFromLocation());
  const [selectedParam, setSelectedParam] = useState<string | null>(null);

  // Initialize from LocalStorage or Fallbacks
  const [packages, setPackages] = useState<TourPackage[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_packages`);
    return saved ? JSON.parse(saved) : initialPackages;
  });

  const [hotels, setHotels] = useState<Hotel[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_hotels`);
    return saved ? JSON.parse(saved) : initialHotels;
  });

  const [festivals, setFestivals] = useState<Festival[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_festivals`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= initialFestivals.length) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    return initialFestivals;
  });

  const [brochures, setBrochures] = useState<Brochure[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_brochures`);
    return saved ? JSON.parse(saved) : initialBrochures;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_gallery`);
    return saved ? JSON.parse(saved) : initialGallery;
  });

  const [videos, setVideos] = useState<VideoItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_videos`);
    return saved ? JSON.parse(saved) : initialVideos;
  });

  const [inquiries, setInquiries] = useState<ContactInquiry[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_inquiries`);
    return saved ? JSON.parse(saved) : initialInquiries;
  });


  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_homepageConfig`);
    return saved ? JSON.parse(saved) : initialHomepageConfig;
  });

  const auth = useAuth() as any;
  const isAdminLoggedIn = auth.isAuthenticated && auth.isAdmin;
  const adminUser = auth.user;

  // Sync location changes (hash or history) to internal currentRoute
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentRoute(getRouteFromLocation());
    };
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const [activeBrochureState, setActiveBrochureState] = useState<Brochure | null>(null);
  const [brochureReturnRoute, setBrochureReturnRoute] = useState<ViewRoute>('brochures');
  const [activePackage, setActivePackageState] = useState<TourPackage | null>(null);
  const [activeHotel, setActiveHotelState] = useState<Hotel | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [navLoadingText, setNavLoadingText] = useState<string | null>(null);

  const triggerLoading = (_text: string = 'Loading Sanctuary...') => {
    setIsNavigating(false);
    setNavLoadingText(null);
  };

  const setActiveBrochure = (b: Brochure | null, overrideReturnRoute?: ViewRoute) => {
    setActiveBrochureState(b);
    if (b) {
      triggerLoading('Opening PDF Brochure...');
      const fromAdmin = currentRoute.startsWith('admin');
      const returnRoute = overrideReturnRoute || (fromAdmin ? 'admin-brochures' : 'brochures');
      const targetRoute: ViewRoute = fromAdmin ? 'admin-brochure-viewer' : 'brochure-viewer';
      setBrochureReturnRoute(returnRoute);
      setCurrentRoute(targetRoute);
      if (fromAdmin) {
        // navigate to admin path
        const adminSegment = targetRoute.replace(/^admin-/, '').replace(/-/g, '/');
        reactNavigate(`/admin/${adminSegment}`);
      } else {
        if (window.location.pathname !== '/') {
          reactNavigate('/#' + targetRoute);
        } else {
          window.location.hash = targetRoute;
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const setActivePackage = (p: TourPackage | null) => {
    setActivePackageState(p);
    if (p) {
      triggerLoading(`Curating ${p.title}...`);
      setCurrentRoute('package-detail');
      if (window.location.pathname !== '/') {
        reactNavigate('/#package-detail');
      } else {
        window.location.hash = 'package-detail';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const setActiveHotel = (h: Hotel | null) => {
    setActiveHotelState(h);
    if (h) {
      triggerLoading(`Loading ${h.name}...`);
      setCurrentRoute('hotel-detail');
      if (window.location.pathname !== '/') {
        reactNavigate('/#hotel-detail');
      } else {
        window.location.hash = 'hotel-detail';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Sync state changes to local storage
  useEffect(() => {
    // Remove large data from packages before saving
    const packagesToSave = packages.map(p => ({
      ...p,
      heroImage: p.heroImage?.startsWith('data:') ? '[BASE64_IMAGE]' : p.heroImage,
      galleryImages: p.galleryImages?.map(img => img?.startsWith('data:') ? '[BASE64_IMAGE]' : img)
    }));
    safeSetItem(`${LOCAL_STORAGE_KEY}_packages`, JSON.stringify(packagesToSave));
  }, [packages]);

  // Safe localStorage wrapper with quota error handling
  const safeSetItem = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn(`localStorage quota exceeded for ${key}, skipping save`);
    }
  };

  useEffect(() => {
    // Remove large data from hotels before saving
    const hotelsToSave = hotels.map(h => ({
      ...h,
      heroImage: h.heroImage?.startsWith('data:') ? '[BASE64_IMAGE]' : h.heroImage,
      images: h.images?.map(img => img?.startsWith('data:') ? '[BASE64_IMAGE]' : img)
    }));
    safeSetItem(`${LOCAL_STORAGE_KEY}_hotels`, JSON.stringify(hotelsToSave));
  }, [hotels]);

  useEffect(() => {
    safeSetItem(`${LOCAL_STORAGE_KEY}_festivals`, JSON.stringify(festivals));
  }, [festivals]);

  useEffect(() => {
    // Persist brochure data, including uploaded PDF data URLs, so files remain usable after refresh.
    const brochuresToSave = brochures.map(b => ({
      ...b,
      coverImage: b.coverImage?.startsWith('data:') ? '[BASE64_IMAGE]' : b.coverImage,
      galleryImages: b.galleryImages?.map(img => img?.startsWith('data:') ? '[BASE64_IMAGE]' : img),
      pdfUrl: b.pdfUrl
    }));
    safeSetItem(`${LOCAL_STORAGE_KEY}_brochures`, JSON.stringify(brochuresToSave));
  }, [brochures]);

  useEffect(() => {
    // Remove large data from gallery before saving
    const galleryToSave = gallery.map(g => ({
      ...g,
      imageUrl: g.imageUrl?.startsWith('data:') ? '[BASE64_IMAGE]' : g.imageUrl
    }));
    safeSetItem(`${LOCAL_STORAGE_KEY}_gallery`, JSON.stringify(galleryToSave));
  }, [gallery]);

  useEffect(() => {
    safeSetItem(`${LOCAL_STORAGE_KEY}_videos`, JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    safeSetItem(`${LOCAL_STORAGE_KEY}_inquiries`, JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    safeSetItem(`${LOCAL_STORAGE_KEY}_homepageConfig`, JSON.stringify(homepageConfig));
  }, [homepageConfig]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Auth is handled by AuthProvider; AppContext reads derived admin state from it.

  const requireAdminAction = (actionLabel: string): boolean => {
    if (!isAdminLoggedIn) {
      showToast(`Administrator access required to ${actionLabel}.`);
      return false;
    }
    return true;
  };

  const navigate = (route: ViewRoute, param: string | null = null) => {
    if (route === 'package-detail') {
      triggerLoading('Curating Itinerary Details...');
    } else if (route === 'hotel-detail') {
      triggerLoading('Loading Luxury Sanctuary...');
    } else if (route === 'luxury') {
      triggerLoading('Loading Luxury Collection...');
    } else if (route === 'hotels') {
      triggerLoading('Loading 5-Star Sanctuaries...');
    } else {
      triggerLoading();
    }
    setCurrentRoute(route);
    setSelectedParam(param);
    // If navigating to admin route, prefer path-based admin URLs
    if (route.startsWith('admin')) {
      const adminSegment = route.replace(/^admin-/, '').replace(/-/g, '/');
      reactNavigate(`/admin/${adminSegment}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (window.location.pathname !== '/') {
      reactNavigate('/' + (route === 'home' ? '' : `#${route}`));
    } else {
      if (window.location.hash !== `#${route}`) {
        window.location.hash = route === 'home' ? '' : route;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginAdmin = async (email: string, password: string) => {
    try {
      const ok = await auth.login(email, password);
      if (ok) {
        showToast('Welcome to BLHT Admin Portal');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logoutAdmin = async () => {
    try {
      await auth.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      showToast('Logged out of Admin Portal');
      navigate('home');
    }
  };

  // CRUD
  const addPackage = async (pkgData: Omit<TourPackage, 'id'>): Promise<void> => {
    if (!requireAdminAction('create a package')) return;
    try {
      await api.getCsrfToken();
      const res = await api.cmsCreate('packages', pkgData);
      const created = res.data;
      setPackages(prev => [created as TourPackage, ...prev]);
      showToast('New Tour Package created successfully!');
    } catch (err) {
      console.error('Create package failed', err);
      showToast('Failed to create package');
    }
  };

  const updatePackage = async (id: string, pkgData: Partial<TourPackage>): Promise<void> => {
    if (!requireAdminAction('update a package')) return;
    try {
      await api.getCsrfToken();
      const res = await api.cmsUpdate('packages', id, pkgData);
      const updated = res.data;
      setPackages(prev => prev.map(p => p.id === id ? (updated as TourPackage) : p));
      showToast('Package updated successfully!');
    } catch (err) {
      console.error('Update package failed', err);
      showToast('Failed to update package');
    }
  };

  const deletePackage = async (id: string): Promise<void> => {
    if (!requireAdminAction('delete a package')) return;
    try {
      await api.getCsrfToken();
      await api.cmsDelete('packages', id);
      setPackages(prev => prev.filter(p => p.id !== id));
      showToast('Package deleted');
    } catch (err) {
      console.error('Delete package failed', err);
      showToast('Failed to delete package');
    }
  };

  const addHotel = async (hotelData: Omit<Hotel, 'id'>): Promise<void> => {
    if (!requireAdminAction('create a hotel listing')) return;
    try {
      await api.getCsrfToken();
      const res = await api.cmsCreate('hotels', hotelData);
      setHotels(prev => [res.data as Hotel, ...prev]);
      showToast('Hotel listing added successfully!');
    } catch (err) {
      console.error('Create hotel failed', err);
      showToast('Failed to create hotel listing');
    }
  };

  const updateHotel = async (id: string, hotelData: Partial<Hotel>): Promise<void> => {
    if (!requireAdminAction('update a hotel listing')) return;
    try {
      await api.getCsrfToken();
      const res = await api.cmsUpdate('hotels', id, hotelData);
      setHotels(prev => prev.map(h => h.id === id ? (res.data as Hotel) : h));
      showToast('Hotel listing updated!');
    } catch (err) {
      console.error('Update hotel failed', err);
      showToast('Failed to update hotel listing');
    }
  };

  const deleteHotel = async (id: string): Promise<void> => {
    if (!requireAdminAction('delete a hotel listing')) return;
    try {
      await api.getCsrfToken();
      await api.cmsDelete('hotels', id);
      setHotels(prev => prev.filter(h => h.id !== id));
      showToast('Hotel listing removed');
    } catch (err) {
      console.error('Delete hotel failed', err);
      showToast('Failed to remove hotel listing');
    }
  };

  const addFestival = async (festData: Omit<Festival, 'id'>): Promise<void> => {
    if (!requireAdminAction('create a festival event')) return;
    try {
      await api.getCsrfToken();
      const res = await api.cmsCreate('festivals', festData);
      setFestivals(prev => [res.data as Festival, ...prev]);
      showToast('New Festival event added successfully!');
    } catch (err) {
      console.error('Create festival failed', err);
      showToast('Failed to add festival event');
    }
  };

  const updateFestival = async (id: string, festData: Partial<Festival>): Promise<void> => {
    if (!requireAdminAction('update a festival event')) return;
    try {
      await api.getCsrfToken();
      const res = await api.cmsUpdate('festivals', id, festData);
      setFestivals(prev => prev.map(f => f.id === id ? (res.data as Festival) : f));
      showToast('Festival details updated!');
    } catch (err) {
      console.error('Update festival failed', err);
      showToast('Failed to update festival');
    }
  };

  const deleteFestival = async (id: string): Promise<void> => {
    if (!requireAdminAction('delete a festival event')) return;
    try {
      await api.getCsrfToken();
      await api.cmsDelete('festivals', id);
      setFestivals(prev => prev.filter(f => f.id !== id));
      showToast('Festival removed');
    } catch (err) {
      console.error('Delete festival failed', err);
      showToast('Failed to remove festival');
    }
  };

  const addBrochure = async (bData: Omit<Brochure, 'id' | 'downloadCount'>): Promise<void> => {
    if (!requireAdminAction('upload a brochure')) return;
    try {
      await api.getCsrfToken();
      const res = await api.cmsCreate('brochures', bData);
      setBrochures(prev => [res.data as Brochure, ...prev]);
      showToast('New PDF Brochure uploaded to collection!');
    } catch (err) {
      console.error('Create brochure failed', err);
      showToast('Failed to upload brochure');
    }
  };

  const deleteBrochure = async (id: string): Promise<void> => {
    if (!requireAdminAction('delete a brochure')) return;
    try {
      await api.getCsrfToken();
      await api.cmsDelete('brochures', id);
      setBrochures(prev => prev.filter(b => b.id !== id));
      showToast('Brochure deleted');
    } catch (err) {
      console.error('Delete brochure failed', err);
      showToast('Failed to delete brochure');
    }
  };

  const logBrochureDownload = (brochureId: string, email?: string) => {
    setBrochures(prev => prev.map(b => b.id === brochureId ? { ...b, downloadCount: b.downloadCount + 1 } : b));
  };

  const addGalleryItem = async (itemData: Omit<GalleryItem, 'id'>): Promise<void> => {
    if (!requireAdminAction('add a gallery photo')) return;
    try {
      await api.getCsrfToken();
      const res = await api.cmsCreate('gallery', itemData);
      setGallery(prev => [res.data as GalleryItem, ...prev]);
      showToast('Gallery image published!');
    } catch (err) {
      console.error('Create gallery item failed', err);
      showToast('Failed to publish gallery image');
    }
  };

  const updateGalleryItem = async (id: string, itemData: Partial<GalleryItem>): Promise<void> => {
    if (!requireAdminAction('update a gallery photo')) return;
    try {
      await api.getCsrfToken();
      const res = await api.cmsUpdate('gallery', id, itemData);
      setGallery(prev => prev.map(g => g.id === id ? (res.data as GalleryItem) : g));
      showToast('Gallery photo updated!');
    } catch (err) {
      console.error('Update gallery item failed', err);
      showToast('Failed to update gallery photo');
    }
  };

  const deleteGalleryItem = async (id: string): Promise<void> => {
    if (!requireAdminAction('delete a gallery photo')) return;
    try {
      await api.getCsrfToken();
      await api.cmsDelete('gallery', id);
      setGallery(prev => prev.filter(g => g.id !== id));
      showToast('Gallery image removed');
    } catch (err) {
      console.error('Delete gallery item failed', err);
      showToast('Failed to remove gallery image');
    }
  };

  const addVideoItem = async (vData: Omit<VideoItem, 'id'>): Promise<void> => {
    if (!requireAdminAction('add a video')) return;
    try {
      await api.getCsrfToken();
      const res = await api.cmsCreate('videos', vData);
      setVideos(prev => [res.data as VideoItem, ...prev]);
      showToast('Video tour added successfully');
    } catch (err) {
      console.error('Create video failed', err);
      showToast('Failed to add video tour');
    }
  };

  const updateVideoItem = async (id: string, vData: Partial<VideoItem>): Promise<void> => {
    if (!requireAdminAction('update a video')) return;
    try {
      await api.getCsrfToken();
      const res = await api.cmsUpdate('videos', id, vData);
      setVideos(prev => prev.map(v => v.id === id ? (res.data as VideoItem) : v));
      showToast('Video updated successfully!');
    } catch (err) {
      console.error('Update video failed', err);
      showToast('Failed to update video');
    }
  };

  const deleteVideoItem = async (id: string): Promise<void> => {
    if (!requireAdminAction('delete a video')) return;
    try {
      await api.getCsrfToken();
      await api.cmsDelete('videos', id);
      setVideos(prev => prev.filter(v => v.id !== id));
      showToast('Video tour deleted');
    } catch (err) {
      console.error('Delete video failed', err);
      showToast('Failed to delete video tour');
    }
  };

  const submitInquiry = async (inquiryData: Omit<ContactInquiry, 'id' | 'createdAt' | 'status'>): Promise<void> => {
    try {
      await api.getCsrfToken();
      const res = await api.submitInquiry(inquiryData as any);
      const created = res.inquiry || res;
      setInquiries(prev => [created as ContactInquiry, ...prev]);
      showToast('Thank you! Your custom tour inquiry has been submitted to Dasho Tashi Wangchuk & Team.');
    } catch (err) {
      console.error('Submit inquiry failed', err);
      showToast('Failed to submit inquiry');
    }
  };

  const updateInquiryStatus = async (id: string, status: ContactInquiry['status'], notes?: string): Promise<void> => {
    if (!requireAdminAction('update inquiry status')) return;
    try {
      await api.getCsrfToken();
      // There is no dedicated endpoint in the client for inquiries' status; use cmsUpdate if inquiries exposed via CMS, otherwise update locally
      // For now, update local state and show toast; ideally, implement server endpoint and call it here.
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status, adminNotes: notes !== undefined ? notes : inq.adminNotes } : inq));
      showToast(`Inquiry status updated to ${status}`);
    } catch (err) {
      console.error('Update inquiry status failed', err);
      showToast('Failed to update inquiry status');
    }
  };

  const updateHomepageConfig = async (cfg: Partial<HomepageConfig>): Promise<void> => {
    if (!requireAdminAction('update the homepage')) return;
    try {
      await api.getCsrfToken();
      // Fetch existing homepage entries
      const list = await api.cmsList<HomepageConfig>('homepage');
      if (Array.isArray(list.data) && list.data.length > 0) {
        const id = (list.data[0] as any).id;
        const res = await api.cmsUpdate('homepage', id, cfg);
        setHomepageConfig(res.data as HomepageConfig);
      } else {
        const res = await api.cmsCreate('homepage', cfg);
        setHomepageConfig(res.data as HomepageConfig);
      }
      showToast('Homepage sections updated!');
    } catch (err) {
      console.error('Update homepage config failed', err);
      showToast('Failed to update homepage');
    }
  };

  const { currentLanguage } = useLanguage();
  const langCode = currentLanguage.code;

  const translatedPackages = useMemo(() => {
    return packages.map(p => translatePackage(p, langCode));
  }, [packages, langCode]);

  const translatedHotels = useMemo(() => {
    return hotels.map(h => translateHotel(h, langCode));
  }, [hotels, langCode]);

  const translatedFestivals = useMemo(() => {
    return festivals.map(f => translateFestival(f, langCode));
  }, [festivals, langCode]);

  const translatedBrochures = useMemo(() => {
    return brochures.map(b => translateBrochure(b, langCode));
  }, [brochures, langCode]);

  const translatedActivePackage = useMemo(() => {
    return activePackage ? translatePackage(activePackage, langCode) : null;
  }, [activePackage, langCode]);

  const translatedActiveHotel = useMemo(() => {
    return activeHotel ? translateHotel(activeHotel, langCode) : null;
  }, [activeHotel, langCode]);

  const translatedActiveBrochure = useMemo(() => {
    return activeBrochureState ? translateBrochure(activeBrochureState, langCode) : null;
  }, [activeBrochureState, langCode]);

  return (
    <AppContext.Provider value={{
      currentRoute,
      selectedParam,
      navigate,
      isNavigating,
      navLoadingText,
      packages: translatedPackages,
      hotels: translatedHotels,
      festivals: translatedFestivals,
      brochures: translatedBrochures,
      gallery,
      videos,
      inquiries,
      homepageConfig,
      activeBrochure: translatedActiveBrochure,
      setActiveBrochure,
      brochureReturnRoute,
      activePackage: translatedActivePackage,
      setActivePackage,
      activeHotel: translatedActiveHotel,
      setActiveHotel,
      isAdminLoggedIn,
      adminUser,
      loginAdmin,
      logoutAdmin,
      addPackage,
      updatePackage,
      deletePackage,
      addHotel,
      updateHotel,
      deleteHotel,
      addFestival,
      updateFestival,
      deleteFestival,
      addBrochure,
      deleteBrochure,
      logBrochureDownload,
      addGalleryItem,
      updateGalleryItem,
      deleteGalleryItem,
      addVideoItem,
      updateVideoItem,
      deleteVideoItem,
      submitInquiry,
      updateInquiryStatus,
      updateHomepageConfig,
      toast,
      showToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
