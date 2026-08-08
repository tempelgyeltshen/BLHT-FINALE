import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockEnv = {
  adminEmail: 'admin@test.com',
  adminPasswordHash: '$2a$10$hashhashhash',
};

vi.mock('../../../core/config/env.js', () => ({ env: mockEnv }));

const { ConfigAdminRepository } = await import('../ConfigAdminRepository.js');

describe('ConfigAdminRepository', () => {
  const repo = new ConfigAdminRepository();

  beforeEach(() => {
    mockEnv.adminEmail = 'admin@test.com';
    mockEnv.adminPasswordHash = '$2a$10$hashhashhash';
  });

  it('should return null when env vars are not set', async () => {
    mockEnv.adminEmail = '';
    mockEnv.adminPasswordHash = '';
    expect(await repo.findByEmail('admin@test.com')).toBeNull();
  });

  it('should return null when password hash is missing', async () => {
    mockEnv.adminPasswordHash = '';
    expect(await repo.findByEmail('admin@test.com')).toBeNull();
  });

  it('should return null for unknown email', async () => {
    expect(await repo.findByEmail('other@test.com')).toBeNull();
  });

  it('should return admin for matching email (case-insensitive)', async () => {
    const admin = await repo.findByEmail('ADMIN@TEST.COM');
    expect(admin).not.toBeNull();
    expect(admin!.email).toBe('admin@test.com');
    expect(admin!.role).toBe('admin');
    expect(admin!.passwordHash).toBe('$2a$10$hashhashhash');
    expect(admin!.id).toBe('blht-admin');
  });
});
