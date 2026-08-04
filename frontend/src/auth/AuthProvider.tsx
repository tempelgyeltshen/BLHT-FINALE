import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { setAccessToken, setRefreshFailedHandler } from './axios';

export interface AuthUser {
  name: string;
  email: string;
  role: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  role: string | null;
  accessToken: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
    setAccessToken(null);
  }, []);

  const handleRefreshFailed = useCallback(() => {
    clearSession();
    navigate('/admin/login', { replace: true });
  }, [clearSession, navigate]);

  useEffect(() => {
    setRefreshFailedHandler(handleRefreshFailed);
  }, [handleRefreshFailed]);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      // Refresh will set httpOnly cookies on success; ask backend for current user
      await api.refresh();
      const me = await api.me();
      const authUser = me.data.user;
      if (!authUser) throw new Error('Unable to refresh session');

      const normalizedUser: AuthUser = {
        name: authUser.email,
        email: authUser.email,
        role: authUser.role
      };

      setUser(normalizedUser);
      setToken(null);
      setAccessToken(null);
      return true;
    } catch {
      clearSession();
      return false;
    }
  }, [clearSession]);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      await refreshSession();
      setLoading(false);
    })();
  }, [refreshSession]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      await api.getCsrfToken();
      // Backend sets httpOnly cookies; call login then /me to obtain user
      await api.login(email, password);
      const me = await api.me();
      const authUser = me.data.user;
      if (!authUser) return false;

      const normalizedUser: AuthUser = {
        name: authUser.email,
        email: authUser.email,
        role: authUser.role
      };

      setUser(normalizedUser);
      setToken(null);
      setAccessToken(null);
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
      await api.logout();
    } catch {
      // Ignore logout errors and clear state anyway
    } finally {
      clearSession();
      setLoading(false);
      navigate('/', { replace: true });
    }
  }, [clearSession, navigate]);

  const value = useMemo(
    () => ({
      user,
      role: user?.role ?? null,
      accessToken: null,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      login,
      logout,
      refreshSession
    }),
    [user, accessToken, loading, login, logout, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
