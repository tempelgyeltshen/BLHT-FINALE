import { describe, it, expect, vi, beforeEach } from 'vitest';

// In-memory store for the mocked ContentModel
const store = new Map<string, any[]>();

const mockDoc = (collection: string, data: any, idx: number) => ({
  _id: { toString: () => `mock-id-${collection}-${idx}` },
  data,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-02'),
});

vi.mock('../../models/Content.js', () => ({
  ContentModel: {
    find: vi.fn((query: any) => ({
      lean: vi.fn().mockResolvedValue(
        (store.get(query.collection) || []).map((data, idx) => mockDoc(query.collection, data, idx))
      )
    })),
    findOne: vi.fn((query: any) => ({
      lean: vi.fn().mockResolvedValue((() => {
        const items = store.get(query.collection) || [];
        const idx = items.findIndex((_, i) => `mock-id-${query.collection}-${i}` === query._id);
        return idx >= 0 ? mockDoc(query.collection, items[idx], idx) : null;
      })())
    })),
    create: vi.fn((doc: any) => {
      const coll = doc.collection;
      if (!store.has(coll)) store.set(coll, []);
      store.get(coll)!.push(doc.data);
      return Promise.resolve(mockDoc(coll, doc.data, store.get(coll)!.length - 1));
    }),
    findOneAndUpdate: vi.fn((query: any, update: any, _opts: any) => ({
      lean: vi.fn().mockResolvedValue((() => {
        const items = store.get(query.collection) || [];
        const idx = items.findIndex((_, i) => `mock-id-${query.collection}-${i}` === query._id);
        if (idx < 0) return null;
        if (update.$set?.data) items[idx] = { ...items[idx], ...update.$set.data };
        return mockDoc(query.collection, items[idx], idx);
      })())
    })),
    findOneAndDelete: vi.fn((query: any) => {
      const items = store.get(query.collection) || [];
      const idx = items.findIndex((_, i) => `mock-id-${query.collection}-${i}` === query._id);
      if (idx < 0) return Promise.resolve(null);
      store.get(query.collection)!.splice(idx, 1);
      return Promise.resolve(mockDoc(query.collection, items[idx], idx));
    }),
  }
}));

const { MongoRepository } = await import('../MongoRepository.js');

describe('MongoRepository', () => {
  beforeEach(() => {
    store.clear();
    vi.clearAllMocks();
  });

  it('should list items in a collection', async () => {
    store.set('packages', [{ title: 'Alpha' }, { title: 'Beta' }]);
    const repo = new MongoRepository<any>('packages');

    const items = await repo.list();

    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({ title: 'Alpha', id: 'mock-id-packages-0' });
    expect(items[0].createdAt).toBe('2026-01-01T00:00:00.000Z');
  });

  it('should return empty list for empty collection', async () => {
    const repo = new MongoRepository<any>('packages');
    expect(await repo.list()).toEqual([]);
  });

  it('should get an item by id', async () => {
    store.set('packages', [{ title: 'Alpha' }]);
    const repo = new MongoRepository<any>('packages');

    const item = await repo.get('mock-id-packages-0');
    expect(item).toMatchObject({ title: 'Alpha' });

    const missing = await repo.get('does-not-exist');
    expect(missing).toBeNull();
  });

  it('should create an item', async () => {
    const repo = new MongoRepository<any>('packages');

    const created = await repo.create({ title: 'New Package' });

    expect(created).toMatchObject({ title: 'New Package', id: 'mock-id-packages-0' });
    expect(store.get('packages')).toHaveLength(1);
  });

  it('should update an existing item and return null for missing', async () => {
    store.set('packages', [{ title: 'Alpha', price: 100 }]);
    const repo = new MongoRepository<any>('packages');

    const updated = await repo.update('mock-id-packages-0', { price: 200 });
    expect(updated).toMatchObject({ title: 'Alpha', price: 200 });

    const missing = await repo.update('nope', { price: 300 });
    expect(missing).toBeNull();
  });

  it('should delete an item and return true/false', async () => {
    store.set('packages', [{ title: 'Alpha' }]);
    const repo = new MongoRepository<any>('packages');

    expect(await repo.delete('mock-id-packages-0')).toBe(true);
    expect(store.get('packages')).toHaveLength(0);
    expect(await repo.delete('mock-id-packages-0')).toBe(false);
  });
});
