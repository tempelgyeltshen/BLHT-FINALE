import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate as useReactNavigate, useLocation } from 'react-router-dom';
import { 
  TourPackage, Hotel, Festival, Brochure, GalleryItem, VideoItem, 
  ContactInquiry, HomepageConfig, ViewRoute 
} from '../../../types';
import { 
  initialPackages, initialHotels, initialFestivals, initialBrochures, 
  initialGallery, initialVideos, initialInquiries, initialHomepageConfig 
} from '../../../data/initialData';
import { api } from '../../../lib/api/client';
import { analyticsService } from '../../../lib/services/analytics.service';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { hotelService } from '../../features/hotels/services/hotelService';
import { loadBrochuresFromStorage } from './brochureStorage';

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

// Map a ViewRoute to a real URL path (React Router).
const routeToPath = (route: ViewRoute): string => {
  switch (route) {
    case 'home':
      return '/';
    case 'about':
      return '/about';
    case 'luxury':
      return '/luxury';
    case 'adventures':
      return '/adventures';
    case 'festivals':
      return '/festivals';
    case 'hotels':
      return '/hotels';
    case 'brochures':
      return '/brochures';
    case 'brochure-viewer':
      return '/brochures/viewer';
    case 'videos':
      return '/videos';
    case 'gallery':
      return '/gallery';
    case 'showcase':
      return '/showcase';
    case 'search':
      return '/search';
    case 'contact':
      return '/contact';
    case 'privacy':
    case 'terms':
    case 'privacy-terms':
      return '/privacy-terms';
    case 'car-rental':
      return '/car-rental';
    case 'thangka-painting':
      return '/thangka-painting';
    case 'package-detail':
      return '/packages';
    case 'hotel-detail':
      return '/hotels';
    case 'admin-login':
      return '/admin/login';
    case 'admin-dashboard':
      return '/admin/dashboard';
    case 'admin-packages':
    case 'admin-categories':
      return '/admin/packages';
    case 'admin-brochures':
      return '/admin/brochures';
    case 'admin-brochure-viewer':
      return '/admin/brochure-viewer';
    case 'admin-hotels':
      return '/admin/hotels';
    case 'admin-festivals':
      return '/admin/festivals';
    case 'admin-videos':
      return '/admin/videos';
    case 'admin-gallery':
      return '/admin/gallery';
    case 'admin-homepage':
      return '/admin/homepage';
    case 'admin-contacts':
      return '/admin/contacts';
  }
};

// Derive the current ViewRoute from the browser location (React Router only).
const pathToRoute = (pathname: string): ViewRoute => {
  if (pathname.startsWith('/admin')) {
    const seg = pathname.replace(/^\/admin\/?/, '').split('/')[0];
    switch (seg) {
      case 'login':
        return 'admin-login';
      case 'dashboard':
        return 'admin-dashboard';
      case 'packages':
      case 'categories':
        return 'admin-packages';
      case 'brochures':
        return 'admin-brochures';
      case 'brochure-viewer':
      case 'brochure':
        return 'admin-brochure-viewer';
      case 'hotels':
        return 'admin-hotels';
      case 'festivals':
        return 'admin-festivals';
      case 'videos':
        return 'admin-videos';
      case 'gallery':
        return 'admin-gallery';
      case 'homepage':
        return 'admin-homepage';
      case 'contacts':
        return 'admin-contacts';
      default:
        return 'admin-login';
    }
  }
  const seg = pathname.replace(/^\//, '').split('/')[0];
  switch (seg) {
    case '':
      return 'home';
    case 'about':
      return 'about';
    case 'luxury':
      return 'luxury';
    case 'adventures':
      return 'adventures';
    case 'festivals':
      return 'festivals';
    case 'hotels':
      return pathname.split('/')[2] ? 'hotel-detail' : 'hotels';
    case 'packages':
      return pathname.split('/')[2] ? 'package-detail' : 'luxury';
    case 'brochures':
      return pathname.split('/')[2] ? 'brochure-viewer' : 'brochures';
    case 'videos':
      return 'videos';
    case 'gallery':
      return 'gallery';
    case 'showcase':
      return 'showcase';
    case 'search':
      return 'search';
    case 'contact':
      return 'contact';
    case 'privacy':
    case 'terms':
    case 'privacy-terms':
      return 'privacy-terms';
    case 'car-rental':
      return 'car-rental';
    case 'thangka-painting':
      return 'thangka-painting';
    default:
      return 'home';
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const reactNavigate = useReactNavigate();
  const location = useLocation();
  const currentRoute = useMemo(() => pathToRoute(location.pathname), [location.pathname]);
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

  const [brochures, setBrochures] = useState<Brochure[]>(() =>
    loadBrochuresFromStorage(`${LOCAL_STORAGE_KEY}_brochures`)
  );

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

  // Fetch CMS data from API on mount, falling back to localStorage/initialData
  useEffect(() => {
    const fetchCollections = async () => {
      type CollectionDef = { name: string; setter: (v: any[]) => void };
      const collections: CollectionDef[] = [
        { name: 'packages', setter: setPackages },
        { name: 'hotels', setter: setHotels },
        { name: 'festivals', setter: setFestivals },
        { name: 'brochures', setter: setBrochures },
        { name: 'gallery', setter: setGallery },
        { name: 'videos', setter: setVideos },
      ];

      for (const { name, setter } of collections) {
        try {
          let data;
          if (name === 'hotels') {
            // Use the new hotel-specific API
            data = await hotelService.list();
          } else {
            // Use the generic CMS API
            const res = await api.cmsList<any>(name);
            data = res.data;
          }
          if (Array.isArray(data) && data.length > 0) {
            if (name === 'festivals') {
              // The backend may hold an older/partial festival seed. Merge the
              // server data on top of the full initial calendar so admin edits
              // win, but the complete 44-festival schedule is always shown.
              const apiFestivals = data as Festival[];
              const merged: Festival[] = [...initialFestivals];
              apiFestivals.forEach(apiFest => {
                const idx = merged.findIndex(
                  f => (apiFest.id && f.id === apiFest.id) || (apiFest.slug && f.slug === apiFest.slug)
                );
                if (idx >= 0) {
                  merged[idx] = { ...merged[idx], ...apiFest };
                } else {
                  merged.push(apiFest);
                }
              });
              setter(merged);
            } else {
              setter(data);
            }
          }
        } catch {
          // API unreachable — keep existing localStorage data
        }
      }

      // Homepage config (single document)
      try {
        const res = await api.cmsList<any>('homepage');
        if (Array.isArray(res.data) && res.data.length > 0) {
          setHomepageConfig(res.data[0]);
        }
      } catch {
        // keep localStorage fallback
      }
      // Note: the admin inquiry inbox is intentionally NOT fetched here —
      // GET /api/inquiries requires admin auth and would 401 for public
      // visitors (logged in the browser console). It is fetched by the
      // dedicated effect below whenever an admin session is active.
    };

    fetchCollections();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const auth = useAuth() as any;
  const isAdminLoggedIn = auth.isAuthenticated && auth.isAdmin;
  const adminUser = auth.user;

  // When the admin logs in, pull the real inquiry inbox from the server (the
  // initial mount fetch runs before login and would 401).
  useEffect(() => {
    if (!isAdminLoggedIn) return;
    api.listInquiries<ContactInquiry>()
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setInquiries(res.data);
        }
      })
      .catch(() => {
        // keep existing data when the API is unreachable
      });
  }, [isAdminLoggedIn]);

  const [activeBrochureState, setActiveBrochureState] = useState<Brochure | null>(null);
  const [brochureReturnRoute, setBrochureReturnRoute] = useState<ViewRoute>('brochures');
  const [activePackage, setActivePackageState] = useState<TourPackage | null>(null);
  const [activeHotel, setActiveHotelState] = useState<Hotel | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [navLoadingText, setNavLoadingText] = useState<string | null>(null);

  // Keep the last selected item ids so navigation helpers resolve detail routes
  // synchronously (state updates are async).
  const activePackageIdRef = useRef<string | null>(null);
  const activeHotelIdRef = useRef<string | null>(null);

  const triggerLoading = (_text: string = 'Loading Sanctuary...') => {
    setIsNavigating(false);
    setNavLoadingText(null);
  };

  const setActiveBrochure = (b: Brochure | null, overrideReturnRoute?: ViewRoute) => {
    setActiveBrochureState(b);
    if (b) {
      triggerLoading('Opening PDF Brochure...');
      const fromAdmin = location.pathname.startsWith('/admin');
      const returnRoute = overrideReturnRoute || (fromAdmin ? 'admin-brochures' : 'brochures');
      setBrochureReturnRoute(returnRoute);
      navigate(fromAdmin ? 'admin-brochure-viewer' : 'brochure-viewer');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const setActivePackage = (p: TourPackage | null) => {
    setActivePackageState(p);
    if (p) {
      triggerLoading(`Curating ${p.title}...`);
      const target = p.id || p.slug;
      activePackageIdRef.current = target;
      reactNavigate(`/packages/${target}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const setActiveHotel = (h: Hotel | null) => {
    setActiveHotelState(h);
    if (h) {
      triggerLoading(`Loading ${h.name}...`);
      const target = h.slug || h.id;
      activeHotelIdRef.current = target;
      reactNavigate(`/hotels/${target}`);
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
    setSelectedParam(param);
    // Resolve detail routes to their real URLs when a selection is active.
    let path = routeToPath(route);
    if (route === 'package-detail' && activePackageIdRef.current) {
      path = `/packages/${activePackageIdRef.current}`;
    } else if (route === 'hotel-detail' && activeHotelIdRef.current) {
      path = `/hotels/${activeHotelIdRef.current}`;
    }
    reactNavigate(path);
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
      navigate('admin-login');
    }
  };

  // CRUD
  const addPackage = async (pkgData: Omit<TourPackage, 'id'>): Promise<void> => {
    if (!requireAdminAction('create a package')) return;
    try {
      const res = await api.cmsCreate('packages', pkgData);
      const created = res.data;
      setPackages(prev => [created as TourPackage, ...prev]);
      showToast('New Tour Package created successfully!');
    } catch (err) {
      console.error('Create package failed', err);
      showToast(err instanceof Error ? `Failed to create package: ${err.message}` : 'Failed to create package');
    }
  };

  const updatePackage = async (id: string, pkgData: Partial<TourPackage>): Promise<void> => {
    if (!requireAdminAction('update a package')) return;
    try {
      const res = await api.cmsUpdate('packages', id, pkgData);
      const updated = res.data;
      setPackages(prev => prev.map(p => p.id === id ? (updated as TourPackage) : p));
      showToast('Package updated successfully!');
    } catch (err) {
      console.error('Update package failed', err);
      showToast(err instanceof Error ? `Failed to update package: ${err.message}` : 'Failed to update package');
    }
  };

  const deletePackage = async (id: string): Promise<void> => {
    if (!requireAdminAction('delete a package')) return;
    try {
      await api.cmsDelete('packages', id);
      setPackages(prev => prev.filter(p => p.id !== id));
      showToast('Package deleted');
    } catch (err) {
      console.error('Delete package failed', err);
      showToast(err instanceof Error ? `Failed to delete package: ${err.message}` : 'Failed to delete package');
    }
  };

  const addHotel = async (hotelData: Omit<Hotel, 'id'>): Promise<void> => {
    if (!requireAdminAction('create a hotel listing')) return;
    try {
      const newHotel = await hotelService.create(hotelData);
      setHotels(prev => [newHotel, ...prev]);
      showToast('Hotel listing added successfully!');
    } catch (err) {
      console.error('Create hotel failed', err);
      showToast(err instanceof Error ? `Failed to create hotel: ${err.message}` : 'Failed to create hotel');
    }
  };

  const updateHotel = async (id: string, hotelData: Partial<Hotel>): Promise<void> => {
    if (!requireAdminAction('update a hotel listing')) return;
    try {
      const updatedHotel = await hotelService.update(id, hotelData);
      setHotels(prev => prev.map(h => h.id === id ? updatedHotel : h));
      showToast('Hotel listing updated!');
    } catch (err) {
      console.error('Update hotel failed', err);
      showToast(err instanceof Error ? `Failed to update hotel: ${err.message}` : 'Failed to update hotel');
    }
  };

  const deleteHotel = async (id: string): Promise<void> => {
    if (!requireAdminAction('delete a hotel listing')) return;
    try {
      await hotelService.delete(id);
      setHotels(prev => prev.filter(h => h.id !== id));
      showToast('Hotel listing removed');
    } catch (err) {
      console.error('Delete hotel failed', err);
      showToast(err instanceof Error ? `Failed to delete hotel: ${err.message}` : 'Failed to delete hotel');
    }
  };

  const addFestival = async (festData: Omit<Festival, 'id'>): Promise<void> => {
    if (!requireAdminAction('create a festival event')) return;
    try {
      const res = await api.cmsCreate('festivals', festData);
      setFestivals(prev => [res.data as Festival, ...prev]);
      showToast('New Festival event added successfully!');
    } catch (err) {
      console.error('Create festival failed', err);
      showToast(err instanceof Error ? `Failed to create festival: ${err.message}` : 'Failed to create festival');
    }
  };

  const updateFestival = async (id: string, festData: Partial<Festival>): Promise<void> => {
    if (!requireAdminAction('update a festival event')) return;
    try {
      const res = await api.cmsUpdate('festivals', id, festData);
      setFestivals(prev => prev.map(f => f.id === id ? (res.data as Festival) : f));
      showToast('Festival details updated!');
    } catch (err) {
      console.error('Update festival failed', err);
      showToast(err instanceof Error ? `Failed to update festival: ${err.message}` : 'Failed to update festival');
    }
  };

  const deleteFestival = async (id: string): Promise<void> => {
    if (!requireAdminAction('delete a festival event')) return;
    try {
      await api.cmsDelete('festivals', id);
      setFestivals(prev => prev.filter(f => f.id !== id));
      showToast('Festival removed');
    } catch (err) {
      console.error('Delete festival failed', err);
      showToast(err instanceof Error ? `Failed to delete festival: ${err.message}` : 'Failed to delete festival');
    }
  };

  const addBrochure = async (bData: Omit<Brochure, 'id' | 'downloadCount'>): Promise<void> => {
    if (!requireAdminAction('upload a brochure')) return;
    try {
      const res = await api.cmsCreate('brochures', bData);
      setBrochures(prev => [res.data as Brochure, ...prev]);
      showToast('New PDF Brochure uploaded to collection!');
    } catch (err) {
      console.error('Create brochure failed', err);
      showToast(err instanceof Error ? `Failed to create brochure: ${err.message}` : 'Failed to create brochure');
    }
  };

  const deleteBrochure = async (id: string): Promise<void> => {
    if (!requireAdminAction('delete a brochure')) return;
    try {
      await api.cmsDelete('brochures', id);
      setBrochures(prev => prev.filter(b => b.id !== id));
      showToast('Brochure deleted');
    } catch (err) {
      console.error('Delete brochure failed', err);
      showToast(err instanceof Error ? `Failed to delete brochure: ${err.message}` : 'Failed to delete brochure');
    }
  };

  const logBrochureDownload = (brochureId: string) => {
    setBrochures(prev => prev.map(b => b.id === brochureId ? { ...b, downloadCount: b.downloadCount + 1 } : b));
    analyticsService.trackEvent('brochure_download', { brochureId });
  };

  const addGalleryItem = async (itemData: Omit<GalleryItem, 'id'>): Promise<void> => {
    if (!requireAdminAction('add a gallery photo')) return;
    try {
      const res = await api.cmsCreate('gallery', itemData);
      setGallery(prev => [res.data as GalleryItem, ...prev]);
      showToast('Gallery image published!');
    } catch (err) {
      console.error('Create gallery item failed', err);
      showToast(err instanceof Error ? `Failed to create gallery item: ${err.message}` : 'Failed to create gallery item');
    }
  };

  const updateGalleryItem = async (id: string, itemData: Partial<GalleryItem>): Promise<void> => {
    if (!requireAdminAction('update a gallery photo')) return;
    try {
      const res = await api.cmsUpdate('gallery', id, itemData);
      setGallery(prev => prev.map(g => g.id === id ? (res.data as GalleryItem) : g));
      showToast('Gallery photo updated!');
    } catch (err) {
      console.error('Update gallery item failed', err);
      showToast(err instanceof Error ? `Failed to update gallery item: ${err.message}` : 'Failed to update gallery item');
    }
  };

  const deleteGalleryItem = async (id: string): Promise<void> => {
    if (!requireAdminAction('delete a gallery photo')) return;
    try {
      await api.cmsDelete('gallery', id);
      setGallery(prev => prev.filter(g => g.id !== id));
      showToast('Gallery image removed');
    } catch (err) {
      console.error('Delete gallery item failed', err);
      showToast(err instanceof Error ? `Failed to delete gallery item: ${err.message}` : 'Failed to delete gallery item');
    }
  };

  const addVideoItem = async (vData: Omit<VideoItem, 'id'>): Promise<void> => {
    if (!requireAdminAction('add a video')) return;
    try {
      const res = await api.cmsCreate('videos', vData);
      setVideos(prev => [res.data as VideoItem, ...prev]);
      showToast('Video tour added successfully');
    } catch (err) {
      console.error('Create video failed', err);
      showToast(err instanceof Error ? `Failed to create video: ${err.message}` : 'Failed to create video');
    }
  };

  const updateVideoItem = async (id: string, vData: Partial<VideoItem>): Promise<void> => {
    if (!requireAdminAction('update a video')) return;
    try {
      const res = await api.cmsUpdate('videos', id, vData);
      setVideos(prev => prev.map(v => v.id === id ? (res.data as VideoItem) : v));
      showToast('Video updated successfully!');
    } catch (err) {
      console.error('Update video failed', err);
      showToast(err instanceof Error ? `Failed to update video: ${err.message}` : 'Failed to update video');
    }
  };

  const deleteVideoItem = async (id: string): Promise<void> => {
    if (!requireAdminAction('delete a video')) return;
    try {
      await api.cmsDelete('videos', id);
      setVideos(prev => prev.filter(v => v.id !== id));
      showToast('Video tour deleted');
    } catch (err) {
      console.error('Delete video failed', err);
      showToast(err instanceof Error ? `Failed to delete video: ${err.message}` : 'Failed to delete video');
    }
  };

  const submitInquiry = async (inquiryData: Omit<ContactInquiry, 'id' | 'createdAt' | 'status'>): Promise<void> => {
    try {
      const res = await api.submitInquiry(inquiryData as any);
      const created = res.inquiry || res;
      setInquiries(prev => [created as ContactInquiry, ...prev]);
      showToast('Thank you! Your custom tour inquiry has been submitted to Dasho Tashi Wangchuk & Team.');
    } catch (err) {
      console.error('Submit inquiry failed', err);
      showToast(err instanceof Error ? `Failed to submit inquiry: ${err.message}` : 'Failed to submit inquiry');
    }
  };

  const updateInquiryStatus = async (id: string, status: ContactInquiry['status'], notes?: string): Promise<void> => {
    if (!requireAdminAction('update inquiry status')) return;
    try {
      const res = await api.updateInquiry<ContactInquiry>(id, { status, adminNotes: notes });
      const updated = res.data;
      setInquiries(prev => prev.map(inq => inq.id === id ? (updated as ContactInquiry) : inq));
      showToast(`Inquiry status updated to ${status}`);
    } catch (err) {
      console.error('Update inquiry status failed', err);
      // Keep local state consistent even if the API is unreachable.
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status, adminNotes: notes !== undefined ? notes : inq.adminNotes } : inq));
      showToast(err instanceof Error ? `Failed to update inquiry status: ${err.message}` : 'Failed to update inquiry status');
    }
  };

  const updateHomepageConfig = async (cfg: Partial<HomepageConfig>): Promise<void> => {
    if (!requireAdminAction('update the homepage')) return;
    try {
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
      showToast(err instanceof Error ? `Failed to update homepage: ${err.message}` : 'Failed to update homepage');
    }
  };

  return (
    <AppContext.Provider value={{
      currentRoute,
      selectedParam,
      navigate,
      isNavigating,
      navLoadingText,
      packages,
      hotels,
      festivals,
      brochures,
      gallery,
      videos,
      inquiries,
      homepageConfig,
      activeBrochure: activeBrochureState,
      setActiveBrochure,
      brochureReturnRoute,
      activePackage,
      setActivePackage,
      activeHotel,
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
