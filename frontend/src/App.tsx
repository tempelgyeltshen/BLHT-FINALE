import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './app/core/providers/AppProvider';
import { AuthProvider } from './app/core/providers/AuthProvider';
import { AppRoutes } from './app/core/routing/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
