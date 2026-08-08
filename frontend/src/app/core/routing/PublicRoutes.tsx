import { Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';

// Homepage & static public pages
import { HomeView } from '../../features/homepage/components/HomeView';
import { AboutView } from '../../features/homepage/components/AboutView';
import { LuxuryView } from '../../features/homepage/components/LuxuryView';
import { AdventuresView } from '../../features/homepage/components/AdventuresView';
import { ContentShowcaseView } from '../../features/homepage/components/ContentShowcaseView';
import { PrivacyTermsView } from '../../features/homepage/components/PrivacyTermsView';
import { CarRentalView } from '../../features/homepage/components/CarRentalView';
import { ThangkaPaintingView } from '../../features/homepage/components/ThangkaPaintingView';

// Feature views
import { FestivalsView } from '../../features/festivals/components/FestivalsView';
import { HotelsView, HotelDetailPage } from '../../features/hotels/components';
import { PackageDetailPage } from '../../features/packages/components/PackageDetailPage';
import { BrochuresView } from '../../features/brochures/components/BrochuresView';
import { PdfViewerModal } from '../../features/brochures/components/PdfViewerModal';
import { GalleryView } from '../../features/gallery/components/GalleryView';
import { VideosView } from '../../features/videos/components/VideosView';
import { ContactView } from '../../features/inquiries/components/ContactView';
import { SearchView } from '../../features/search/components/SearchView';

/**
 * Public site routes, all rendered inside the MainLayout (Navbar + Footer).
 *
 * Invoked as a function by AppRoutes so its output (a <Route> layout with
 * <Route> children) becomes direct children of the root <Routes> — React
 * Router rejects custom components as direct <Routes> children.
 */
export function PublicRoutes() {
  return (
    <>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomeView />} />
        <Route path="/about" element={<AboutView />} />
        <Route path="/luxury" element={<LuxuryView />} />
        <Route path="/adventures" element={<AdventuresView />} />
        <Route path="/festivals" element={<FestivalsView />} />
        <Route path="/hotels" element={<HotelsView />} />
        <Route path="/hotels/:slug" element={<HotelDetailPage />} />
        <Route path="/hotels/id/:id" element={<HotelDetailPage />} />
        <Route path="/packages/:id" element={<PackageDetailPage />} />
        <Route path="/packages" element={<Navigate to="/luxury" replace />} />
        <Route path="/brochures" element={<BrochuresView />} />
        <Route path="/brochures/viewer" element={<PdfViewerModal />} />
        <Route path="/videos" element={<VideosView />} />
        <Route path="/gallery" element={<GalleryView />} />
        <Route path="/showcase" element={<ContentShowcaseView />} />
        <Route path="/search" element={<SearchView />} />
        <Route path="/contact" element={<ContactView />} />
        <Route path="/car-rental" element={<CarRentalView />} />
        <Route path="/thangka-painting" element={<ThangkaPaintingView />} />
        <Route path="/privacy" element={<PrivacyTermsView />} />
        <Route path="/terms" element={<PrivacyTermsView />} />
        <Route path="/privacy-terms" element={<PrivacyTermsView />} />
        <Route path="*" element={<HomeView />} />
      </Route>
    </>
  );
}

export default PublicRoutes;
