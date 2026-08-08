/**
 * Lightweight in-memory TTL cache used by services to avoid repeated
 * database lookups for hot, slowly-changing data (e.g. homepage config).
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class CacheService {
  private store = new Map<string, CacheEntry<unknown>>();
  private defaultTtlMs: number;

  constructor(defaultTtlMs = 60_000) {
    this.defaultTtlMs = defaultTtlMs;
  }

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;

    if (entry.expiresAt < Date.now()) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs = this.defaultTtlMs): void {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  /** Remove all expired entries. Returns how many were removed. */
  prune(): number {
    const now = Date.now();
    let removed = 0;
    for (const [key, entry] of this.store.entries()) {
      if (entry.expiresAt < now) {
        this.store.delete(key);
        removed += 1;
      }
    }
    return removed;
  }

  get size(): number {
    return this.store.size;
  }
}

/** App-wide shared cache instance (default TTL 60s). */
export const cacheService = new CacheService();
