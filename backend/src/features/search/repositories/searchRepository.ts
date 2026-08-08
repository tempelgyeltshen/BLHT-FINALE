import { MongoRepository } from '../../../shared/repositories/MongoRepository.js';
import type { Entity } from '../../../shared/types/entity.js';
import { SEARCHABLE_COLLECTIONS } from '../../../core/config/constants.js';

type Resource = Entity & { [key: string]: unknown };

/** Collections included in global site search. */
export { SEARCHABLE_COLLECTIONS };

const resources = new Map<string, MongoRepository<Resource>>();

export const getSearchRepository = (name: string) => {
  if (!resources.has(name)) {
    resources.set(name, new MongoRepository<Resource>(name));
  }
  return resources.get(name)!;
};
