import { api } from '../../../../lib/api/client';
import { getAccessToken, setAccessToken } from '../../../../lib/api/interceptors';
import type { LoginCredentials, LoginResponse, MeResponse } from '../types/auth.types';

export const authService = {
  getToken: (): string | null => {
    return getAccessToken();
  },

  setToken: (token: string | null): void => {
    setAccessToken(token);
  },

  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.login(credentials.email, credentials.password);
    return response;
  },

  logout: async (): Promise<void> => {
    try {
      await api.logout();
    } catch {
      // Ignore logout errors and clear state anyway
    }
  },

  getCurrentUser: async (): Promise<MeResponse> => {
    const response = await api.me();
    return response;
  },
};
