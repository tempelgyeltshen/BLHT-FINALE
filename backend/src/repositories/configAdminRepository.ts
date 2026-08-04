import { env } from '../config/env.js';
import type { AdminRepository } from '../types/admin.js';

export class ConfigAdminRepository implements AdminRepository {
  async findByEmail(email: string) {
    // Only use environment variables if they are set
    if (!env.adminEmail || !env.adminPasswordHash) {
      return null;
    }
    
    if (email.toLowerCase() !== env.adminEmail.toLowerCase()) {
      return null;
    }
    
    return {
      id: 'blht-admin',
      email: env.adminEmail,
      role: 'admin' as const,
      passwordHash: env.adminPasswordHash
    };
  }
}
