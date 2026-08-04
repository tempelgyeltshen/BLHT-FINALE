export interface Admin { id: string; email: string; role: 'admin'; }
export interface AdminRepository { findByEmail(email: string): Promise<(Admin & { passwordHash: string }) | null>; }
