import { FileRepository, type Entity } from '../repositories/fileRepository.js';

type Resource = Entity & { [key: string]: unknown };

const collections = ['packages', 'hotels', 'festivals', 'brochures', 'gallery', 'videos', 'inquiries'];

export async function getDashboardStats() {
  const counts = await Promise.all(
    collections.map(async (name) => [
      name,
      (await new FileRepository<Resource>(name).list()).length
    ] as const)
  );
  
  return Object.fromEntries(counts);
}

export async function searchContent(query: string) {
  const normalized = query.toLowerCase();
  
  const results = await Promise.all(
    collections
      .filter((name) => name !== 'inquiries')
      .map(async (collection) => ({
        collection,
        items: (await new FileRepository<Resource>(collection).list())
          .filter((item) => JSON.stringify(item).toLowerCase().includes(normalized))
          .slice(0, 20)
      }))
  );
  
  return results.flatMap(({ collection, items }) =>
    items.map((item) => ({ collection, item }))
  );
}
