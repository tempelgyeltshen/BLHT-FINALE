import { homepageRepository } from '../repositories/homepageRepository.js';
import { cacheService } from '../../../shared/services/cacheService.js';
import type { HomepageConfig, HomepageConfigUpdate } from '../types/homepage.types.js';

const CONFIG_CACHE_KEY = 'homepage-config';

const invalidateConfigCache = () => {
  cacheService.delete(CONFIG_CACHE_KEY);
};

export const homepageService = {
  /** Homepage configuration is a single document — return the first one (cached 60s). */
  getConfig: async (): Promise<HomepageConfig | null> => {
    const cached = cacheService.get<HomepageConfig>(CONFIG_CACHE_KEY);
    if (cached) return cached;

    const all = await homepageRepository.list();
    const config = all[0] ?? null;
    if (config) {
      cacheService.set(CONFIG_CACHE_KEY, config);
    }
    return config;
  },

  updateConfig: async (data: HomepageConfigUpdate): Promise<HomepageConfig> => {
    const existing = await homepageService.getConfig();
    let config: HomepageConfig;
    if (existing) {
      config = (await homepageRepository.update(existing.id, data)) ?? existing;
    } else {
      config = await homepageRepository.create(data);
    }
    invalidateConfigCache();
    return config;
  },
};
