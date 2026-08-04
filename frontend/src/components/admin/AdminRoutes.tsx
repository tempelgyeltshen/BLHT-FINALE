import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminRoute } from '../../auth/AdminRoute';
import { AdminLoginView } from './AdminLoginView';
import { AdminDashboardView } from './AdminDashboardView';
import { AdminPackagesView } from './AdminPackagesView';
import { AdminBrochuresView } from './AdminBrochuresView';
import { AdminHotelsView } from './AdminHotelsView';
import { AdminContactsView } from './AdminContactsView';
import { AdminHomepageView } from './AdminHomepageView';
import { AdminVideosView } from './AdminVideosView';
import { AdminGalleryView } from './AdminGalleryView';
import { AdminFestivalsView } from './AdminFestivalsView';
import { PdfViewerModal } from '../brochure/PdfViewerModal';

export const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLoginView />} />
      <Route path="" element={<Navigate to="dashboard" replace />} />

      <Route
        path="dashboard"
        element={(
          <AdminRoute>
            <AdminDashboardView />
          </AdminRoute>
        )}
      />

      <Route
        path="packages"
        element={(
          <AdminRoute>
            <AdminPackagesView />
          </AdminRoute>
        )}
      />

      <Route
        path="categories"
        element={(
          <AdminRoute>
            <AdminPackagesView />
          </AdminRoute>
        )}
      />

      <Route
        path="festivals"
        element={(
          <AdminRoute>
            <AdminFestivalsView />
          </AdminRoute>
        )}
      />

      <Route
        path="brochures"
        element={(
          <AdminRoute>
            <AdminBrochuresView />
          </AdminRoute>
        )}
      />

      <Route
        path="brochure-viewer"
        element={(
          <AdminRoute>
            <PdfViewerModal />
          </AdminRoute>
        )}
      />

      <Route
        path="hotels"
        element={(
          <AdminRoute>
            <AdminHotelsView />
          </AdminRoute>
        )}
      />

      <Route
        path="contacts"
        element={(
          <AdminRoute>
            <AdminContactsView />
          </AdminRoute>
        )}
      />

      <Route
        path="videos"
        element={(
          <AdminRoute>
            <AdminVideosView />
          </AdminRoute>
        )}
      />

      <Route
        path="gallery"
        element={(
          <AdminRoute>
            <AdminGalleryView />
          </AdminRoute>
        )}
      />

      <Route
        path="homepage"
        element={(
          <AdminRoute>
            <AdminHomepageView />
          </AdminRoute>
        )}
      />

      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
