import { MongoRepository } from '../../../shared/repositories/MongoRepository.js';
import type { Entity } from '../../../shared/types/entity.js';
import { SEARCHABLE_COLLECTIONS } from '../../../core/config/constants.js';
import type { DashboardStats } from '../types/public.types.js';

type Resource = Entity & { [key: string]: unknown };

const getRepository = (name: string) => new MongoRepository<Resource>(name);

export async function getDashboardStats(): Promise<DashboardStats> {
  const counts = await Promise.all(
    SEARCHABLE_COLLECTIONS.map(async (name) => [
      name,
      (await getRepository(name).list()).length
    ] as const)
  );

  return Object.fromEntries(counts) as unknown as DashboardStats;
}
