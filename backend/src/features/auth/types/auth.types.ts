export interface Admin {
  id: string;
  email: string;
  role: 'admin';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: Admin;
}

export interface MeResponse {
  data: {
    user: {
      id: string;
      email: string;
      role: 'admin';
    };
  };
}

export interface AdminRepository {
  findByEmail(email: string): Promise<(Admin & { passwordHash: string }) | null>;
}
