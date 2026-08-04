import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../errors/AppError.js';
import { ConfigAdminRepository } from '../repositories/configAdminRepository.js';
import type { Admin } from '../types/admin.js';

const repository = new ConfigAdminRepository();

export const authenticateAdmin = async (email: string, password: string) => {
  // Try database first
  const account = await repository.findByEmail(email);
  
  if (account) {
    if (!(await bcrypt.compare(password, account.passwordHash))) {
      throw new AppError(401, 'Invalid email or password.');
    }
    
    return {
      id: account.id,
      email: account.email,
      role: account.role
    } satisfies Admin;
  }
  
  // Fallback to environment variables for development
  if (env.nodeEnv !== 'production' && env.adminEmail && env.adminPasswordHash) {
    if (email === env.adminEmail && await bcrypt.compare(password, env.adminPasswordHash)) {
      return {
        id: 'env-admin',
        email: env.adminEmail,
        role: 'admin'
      } satisfies Admin;
    }
  }
  
  throw new AppError(401, 'Invalid email or password.');
};

export const issueTokens = (admin: Admin) => {
  const payload = {
    sub: admin.id,
    email: admin.email,
    role: admin.role
  };
  
  return {
    accessToken: jwt.sign(payload, env.jwtAccessSecret, { expiresIn: '15m' }),
    refreshToken: jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: '7d' })
  };
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.jwtAccessSecret) as {
    sub: string;
    email: string;
    role: 'admin'
  };
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.jwtRefreshSecret) as {
    sub: string;
    email: string;
    role: 'admin'
  };
};
