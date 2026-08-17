import { Route, Navigate } from 'react-router-dom';
import { AdminRoute } from '../../features/auth/components/AdminRoute';
import { AdminLoginView } from '../../features/auth/components/AdminLoginView';
import { AdminDashboardView } from '../../features/admin/components/dashboard/AdminDashboardView';
import { AdminPackagesView } from '../../features/packages/components/AdminPackagesView';
import { AdminBrochuresView } from '../../features/admin/components/brochures/AdminBrochuresView';
import { AdminHotelsView } from '../../features/hotels/components';
import { AdminContactsView } from '../../features/admin/components/contacts/AdminContactsView';
import { AdminHomepageView } from '../../features/admin/components/homepage/AdminHomepageView';
import { AdminVideosView } from '../../features/admin/components/videos/AdminVideosView';
import { AdminGalleryView } from '../../features/admin/components/gallery/AdminGalleryView';
import { AdminFestivalsView } from '../../features/admin/components/festivals/AdminFestivalsView';
import { PdfFullScreenView } from '../../features/brochures/components/PdfFullScreenView';

/**
 * Admin portal routes.
 *
 * Invoked as a function by AppRoutes so its output (plain <Route> elements
 * with absolute /admin/* paths) becomes direct children of the root <Routes>.
 * Routes that require a session are wrapped in <AdminRoute> so authentication
 * is preserved.
 */
export function AdminRoutes() {
  return (
    <>
      <Route path="/admin/login" element={<AdminLoginView />} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

      <Route
        path="/admin/dashboard"
        element={(
          <AdminRoute>
            <AdminDashboardView />
          </AdminRoute>
        )}
      />

      <Route
        path="/admin/packages"
        element={(
          <AdminRoute>
            <AdminPackagesView />
          </AdminRoute>
        )}
      />

      <Route
        path="/admin/categories"
        element={(
          <AdminRoute>
            <AdminPackagesView />
          </AdminRoute>
        )}
      />

      <Route
        path="/admin/festivals"
        element={(
          <AdminRoute>
            <AdminFestivalsView />
          </AdminRoute>
        )}
      />

      <Route
        path="/admin/brochures"
        element={(
          <AdminRoute>
            <AdminBrochuresView />
          </AdminRoute>
        )}
      />

      <Route
        path="/admin/brochure-viewer"
        element={(
          <AdminRoute>
            {/* Same standalone PDF-only page as the public site; the Back
                control returns to the admin brochure library. */}
            <PdfFullScreenView />
          </AdminRoute>
        )}
      />

      <Route
        path="/admin/hotels"
        element={(
          <AdminRoute>
            <AdminHotelsView />
          </AdminRoute>
        )}
      />

      <Route
        path="/admin/contacts"
        element={(
          <AdminRoute>
            <AdminContactsView />
          </AdminRoute>
        )}
      />

      <Route
        path="/admin/videos"
        element={(
          <AdminRoute>
            <AdminVideosView />
          </AdminRoute>
        )}
      />

      <Route
        path="/admin/gallery"
        element={(
          <AdminRoute>
            <AdminGalleryView />
          </AdminRoute>
        )}
      />

      <Route
        path="/admin/homepage"
        element={(
          <AdminRoute>
            <AdminHomepageView />
          </AdminRoute>
        )}
      />

      <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />
    </>
  );
}

export default AdminRoutes;
