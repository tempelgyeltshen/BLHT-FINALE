import type { Entity } from '../../../shared/types/entity.js';
import { MongoRepository } from '../../../shared/repositories/MongoRepository.js';

type Resource = Entity & { [key: string]: unknown };

const resources = new Map<string, MongoRepository<Resource>>();

export const getCmsRepository = (name: string) => {
  if (!resources.has(name)) {
    resources.set(name, new MongoRepository<Resource>(name));
  }
  return resources.get(name)!;
};
