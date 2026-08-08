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
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: "admin";
  };
}

export interface MeResponse {
  data: {
    user: {
      id: string;
      email: string;
      role: "admin";
    };
  };
}
