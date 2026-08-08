import type { Entity } from '../types/entity.js';

/**
 * Base contract every repository in the project implements.
 * Entities extend the shared `Entity` interface (id/createdAt/updatedAt).
 */
export interface BaseRepository<T extends Entity> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | null>;
  create(data: Omit<T, keyof Entity>): Promise<T>;
  update(id: string, data: Partial<Omit<T, keyof Entity>>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
