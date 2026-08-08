import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../../core/config/env.js';
import { ACCESS_TOKEN } from '../../../core/config/constants.js';
import { AppError } from '../../../core/errors/AppError.js';
import { ConfigAdminRepository } from '../../../shared/repositories/ConfigAdminRepository.js';
import type { Admin } from '../types/auth.types.js';

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

export const issueAccessToken = (admin: Admin) => {
  const payload = {
    sub: admin.id,
    email: admin.email,
    role: admin.role
  };

  return jwt.sign(payload, env.jwtAccessSecret, { expiresIn: ACCESS_TOKEN.ttl });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.jwtAccessSecret) as {
    sub: string;
    email: string;
    role: 'admin'
  };
};
