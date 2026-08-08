import { videoRepository } from '../repositories/videoRepository.js';
import type { VideoItem, VideoItemCreateRequest, VideoItemUpdateRequest } from '../types/video.types.js';

export const videoService = {
  list: async () => {
    return videoRepository.list();
  },

  get: async (id: string) => {
    return videoRepository.get(id);
  },

  getFeatured: async () => {
    const all = await videoRepository.list();
    return all.filter(v => v.featured);
  },

  create: async (data: VideoItemCreateRequest) => {
    return videoRepository.create(data);
  },

  update: async (id: string, data: VideoItemUpdateRequest) => {
    return videoRepository.update(id, data);
  },

  delete: async (id: string) => {
    return videoRepository.delete(id);
  },
};
