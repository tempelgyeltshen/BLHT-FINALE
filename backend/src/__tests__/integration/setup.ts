import { vi } from 'vitest';
import bcrypt from 'bcryptjs';

// Set test environment variables BEFORE any imports
process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = 'test-integration-secret-key-that-is-at-least-32-chars!';
process.env.ADMIN_EMAIL = 'admin@test.com';
process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync('password123', 10);
process.env.FRONTEND_ORIGIN = 'http://localhost:3000';

// Mock MongoDB - create in-memory store
const collections: Record<string, any[]> = {};

// Helper to create mock document
function createMockDoc(collection: string, data: any, idx: number) {
  return {
    _id: { toString: () => `mock-id-${collection}-${idx}` },
    data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Helper to find index by mock ID
function findIndexById(collection: string, id: string): number {
  const items = collections[collection] || [];
  return items.findIndex((_, i) => `mock-id-${collection}-${i}` === id);
}

const mockContentModel = {
  find: vi.fn((query: any) => {
    const items = collections[query.collection] || [];
    const docs = items.map((data, idx) => createMockDoc(query.collection, data, idx));
    return {
      lean: vi.fn().mockReturnValue(Promise.resolve(docs))
    };
  }),
  
  findOne: vi.fn((query: any) => {
    const items = collections[query.collection] || [];
    const idx = findIndexById(query.collection, query._id);
    const doc = idx >= 0 ? createMockDoc(query.collection, items[idx], idx) : null;
    return {
      lean: vi.fn().mockReturnValue(Promise.resolve(doc))
    };
  }),
  
  countDocuments: vi.fn((query: any) => {
    return Promise.resolve((collections[query.collection] || []).length);
  }),
  
  create: vi.fn((doc: any) => {
    const coll = doc.collection;
    if (!collections[coll]) collections[coll] = [];
    const data = typeof doc.data === 'object' ? doc.data : doc;
    collections[coll].push(data);
    const idx = collections[coll].length - 1;
    return Promise.resolve(createMockDoc(coll, data, idx));
  }),
  
  findOneAndUpdate: vi.fn((query: any, update: any, options?: any) => {
    const items = collections[query.collection] || [];
    const idx = findIndexById(query.collection, query._id);
    
    if (idx >= 0) {
      // Apply the update
      if (update.$set?.data) {
        items[idx] = { ...items[idx], ...update.$set.data };
      }
      const doc = createMockDoc(query.collection, items[idx], idx);
      
      // Return with lean() if that's the pattern
      if (options?.new) {
        return {
          lean: vi.fn().mockReturnValue(Promise.resolve(doc))
        };
      }
      return {
        lean: vi.fn().mockReturnValue(Promise.resolve(doc))
      };
    }
    
    return {
      lean: vi.fn().mockReturnValue(Promise.resolve(null))
    };
  }),
  
  findOneAndDelete: vi.fn((query: any) => {
    const items = collections[query.collection] || [];
    const idx = findIndexById(query.collection, query._id);
    
    if (idx >= 0) {
      const deleted = items.splice(idx, 1)[0];
      return Promise.resolve(createMockDoc(query.collection, deleted, idx));
    }
    return Promise.resolve(null);
  }),
};

vi.mock('../../shared/models/Content.js', () => ({
  ContentModel: mockContentModel
}));

// Mock mongoose connection
vi.mock('mongoose', async () => {
  return {
    default: {
      connect: vi.fn().mockResolvedValue(true),
      connection: {
        readyState: 1,
        on: vi.fn(),
        close: vi.fn(),
      },
      Schema: vi.fn().mockImplementation(() => ({})),
      model: vi.fn().mockReturnValue(mockContentModel),
      models: {},
    },
    Schema: vi.fn().mockImplementation(() => ({})),
  };
});

// Helper to clear all collections between tests
export function clearCollections() {
  for (const key of Object.keys(collections)) {
    collections[key] = [];
  }
}

// Helper to seed a collection
export function seedCollection(name: string, items: any[]) {
  collections[name] = [...items];
}

// Helper to get collection data
export function getCollection(name: string) {
  return collections[name] || [];
}
