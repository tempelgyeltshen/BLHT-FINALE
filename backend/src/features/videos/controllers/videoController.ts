import type { NextFunction, Request, Response } from 'express';
import { videoService } from '../services/videoService.js';

export const listVideos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { featured } = req.query;
    res.json({
      data: featured === 'true' ? await videoService.getFeatured() : await videoService.list()
    });
  } catch (e) {
    next(e);
  }
};

export const getVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const video = await videoService.get(req.params.id);
    if (!video) {
      return res.status(404).json({ error: { message: 'Video not found.' } });
    }
    res.json({ data: video });
  } catch (e) {
    next(e);
  }
};

export const createVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const video = await videoService.create(req.body);
    res.status(201).json({ data: video });
  } catch (e) {
    next(e);
  }
};

export const updateVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const video = await videoService.update(req.params.id, req.body);
    if (!video) {
      return res.status(404).json({ error: { message: 'Video not found.' } });
    }
    res.json({ data: video });
  } catch (e) {
    next(e);
  }
};

export const deleteVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await videoService.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: { message: 'Video not found.' } });
    }
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};
