import { getSearchRepository, SEARCHABLE_COLLECTIONS } from '../repositories/searchRepository.js';
import { SEARCH_LIMIT_PER_COLLECTION } from '../../../core/config/constants.js';
import type { SearchResult } from '../types/search.types.js';

export async function searchContent(query: string): Promise<SearchResult[]> {
  const normalized = query.toLowerCase();

  const results = await Promise.all(
    SEARCHABLE_COLLECTIONS.map(async (collection) => ({
      collection,
      items: (await getSearchRepository(collection).list())
        .filter((item) => JSON.stringify(item).toLowerCase().includes(normalized))
        .slice(0, SEARCH_LIMIT_PER_COLLECTION)
    }))
  );

  return results.flatMap(({ collection, items }) =>
    items.map((item) => ({ collection, item }))
  );
}
