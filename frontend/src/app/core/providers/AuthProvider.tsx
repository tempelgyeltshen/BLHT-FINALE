import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../features/auth/services/authService';
import { api, setCsrfToken } from '../../../lib/api/client';
import type { AuthUser, AuthContextType } from '../../features/auth/types/auth.types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const clearSession = useCallback(() => {
    setUser(null);
    setTokenState(null);
    authService.setToken(null);
  }, []);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const storedToken = authService.getToken();

      if (storedToken) {
        try {
          const me = await authService.getCurrentUser();
          const authUser = me.data.user;
          if (authUser) {
            const normalizedUser: AuthUser = {
              name: authUser.email,
              email: authUser.email,
              role: authUser.role
            };
            setUser(normalizedUser);
            setTokenState(storedToken);
            
            // Fetch CSRF token for authenticated user
            try {
              await api.getCsrfToken();
            } catch {
              console.warn('Failed to fetch CSRF token');
            }
          } else {
            clearSession();
          }
        } catch {
          clearSession();
        }
      }

      setLoading(false);
    })();
  }, [clearSession]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      const token = response.token;
      const authUser = response.user;

      if (!token || !authUser) return false;

      const normalizedUser: AuthUser = {
        name: authUser.email,
        email: authUser.email,
        role: authUser.role
      };

      setUser(normalizedUser);
      setTokenState(token);
      authService.setToken(token);
      
      // Fetch CSRF token after successful login
      try {
        await api.getCsrfToken();
      } catch {
        console.warn('Failed to fetch CSRF token after login');
      }
      
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.logout();
    } catch {
      // Ignore logout errors and clear state anyway
    } finally {
      setCsrfToken(null);
      clearSession();
      setLoading(false);
      navigate('/admin/login', { replace: true });
    }
  }, [clearSession, navigate]);

  const value = useMemo(
    () => ({
      user,
      role: user?.role ?? null,
      accessToken,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      login,
      logout
    }),
    [user, accessToken, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
