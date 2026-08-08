import { MongoRepository } from '../../../shared/repositories/MongoRepository.js';
import type { VideoItem } from '../types/video.types.js';

export const videoRepository = new MongoRepository<VideoItem>('videos');
