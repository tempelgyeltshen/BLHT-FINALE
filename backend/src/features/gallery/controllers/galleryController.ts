import type { NextFunction, Request, Response } from 'express';
import { galleryService } from '../services/galleryService.js';

export const listGalleryItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.query;
    res.json({
      data: category && typeof category === 'string'
        ? await galleryService.getByCategory(category)
        : await galleryService.list()
    });
  } catch (e) {
    next(e);
  }
};

export const getGalleryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await galleryService.get(req.params.id);
    if (!item) {
      return res.status(404).json({ error: { message: 'Gallery item not found.' } });
    }
    res.json({ data: item });
  } catch (e) {
    next(e);
  }
};

export const createGalleryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await galleryService.create(req.body);
    res.status(201).json({ data: item });
  } catch (e) {
    next(e);
  }
};

export const updateGalleryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await galleryService.update(req.params.id, req.body);
    if (!item) {
      return res.status(404).json({ error: { message: 'Gallery item not found.' } });
    }
    res.json({ data: item });
  } catch (e) {
    next(e);
  }
};

export const deleteGalleryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await galleryService.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: { message: 'Gallery item not found.' } });
    }
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};
