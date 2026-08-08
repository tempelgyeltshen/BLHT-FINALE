import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the MongoRepository before importing the modules under test
const mockList = vi.fn();
vi.mock('../../../../shared/repositories/MongoRepository.js', () => ({
  MongoRepository: class MockMongoRepository {
    list = mockList;
    get = vi.fn();
    create = vi.fn();
    update = vi.fn();
    delete = vi.fn();
  }
}));

const { getDashboardStats } = await import('../../../public/services/publicService.js');
const { searchContent } = await import('../searchService.js');

describe('dashboardService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getDashboardStats', () => {
    it('should return counts for all collections', async () => {
      // Set up return values for each collection call
      mockList
        .mockResolvedValueOnce([{ id: '1' }, { id: '2' }])  // packages: 2
        .mockResolvedValueOnce([{ id: '1' }])                 // hotels: 1
        .mockResolvedValueOnce([])                             // festivals: 0
        .mockResolvedValueOnce([{ id: '1' }])                 // brochures: 1
        .mockResolvedValueOnce([{ id: '1' }, { id: '2' }, { id: '3' }]) // gallery: 3
        .mockResolvedValueOnce([]);                            // videos: 0

      const stats = await getDashboardStats();

      expect(stats).toEqual({
        packages: 2,
        hotels: 1,
        festivals: 0,
        brochures: 1,
        gallery: 3,
        videos: 0
      });
    });

    it('should handle all empty collections', async () => {
      mockList
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const stats = await getDashboardStats();

      expect(stats).toEqual({
        packages: 0,
        hotels: 0,
        festivals: 0,
        brochures: 0,
        gallery: 0,
        videos: 0
      });
    });
  });

  describe('searchContent', () => {
    it('should find matching items across collections', async () => {
      mockList
        .mockResolvedValueOnce([{ id: '1', title: 'Bhutan Tour', description: 'Luxury tour' }])  // packages
        .mockResolvedValueOnce([])  // hotels
        .mockResolvedValueOnce([{ id: '1', name: 'Bhutan Festival', description: 'Sacred dance' }])  // festivals
        .mockResolvedValueOnce([])  // brochures
        .mockResolvedValueOnce([])  // gallery
        .mockResolvedValueOnce([]); // videos

      const results = await searchContent('Bhutan');

      expect(results).toHaveLength(2);
      expect(results.some(r => r.collection === 'packages')).toBe(true);
      expect(results.some(r => r.collection === 'festivals')).toBe(true);
    });

    it('should return empty array for no matches', async () => {
      mockList
        .mockResolvedValueOnce([{ id: '1', title: 'Something Else' }])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const results = await searchContent('zzzznonexistent');

      expect(results).toHaveLength(0);
    });

    it('should be case-insensitive', async () => {
      mockList
        .mockResolvedValueOnce([{ id: '1', title: 'BHUTAN TOUR' }])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const results = await searchContent('bhutan');

      expect(results).toHaveLength(1);
    });

    it('should limit results to 20 per collection', async () => {
      const manyItems = Array.from({ length: 25 }, (_, i) => ({ id: String(i), title: 'match' }));
      // Return manyItems for each of the 6 collections
      for (let i = 0; i < 6; i++) {
        mockList.mockResolvedValueOnce(manyItems);
      }

      const results = await searchContent('match');

      // 6 collections × 20 max = 120 results
      expect(results).toHaveLength(120);
    });
  });
});
