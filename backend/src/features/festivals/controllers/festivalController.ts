import type { NextFunction, Request, Response } from 'express';
import { festivalService } from '../services/festivalService.js';

export const listFestivals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { featured } = req.query;
    res.json({
      data: featured === 'true' ? await festivalService.getFeatured() : await festivalService.list()
    });
  } catch (e) {
    next(e);
  }
};

export const getFestival = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const festival = await festivalService.get(req.params.id);
    if (!festival) {
      return res.status(404).json({ error: { message: 'Festival not found.' } });
    }
    res.json({ data: festival });
  } catch (e) {
    next(e);
  }
};

export const getFestivalBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const festival = await festivalService.getBySlug(req.params.slug);
    if (!festival) {
      return res.status(404).json({ error: { message: 'Festival not found.' } });
    }
    res.json({ data: festival });
  } catch (e) {
    next(e);
  }
};

export const createFestival = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const festival = await festivalService.create(req.body);
    res.status(201).json({ data: festival });
  } catch (e) {
    next(e);
  }
};

export const updateFestival = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const festival = await festivalService.update(req.params.id, req.body);
    if (!festival) {
      return res.status(404).json({ error: { message: 'Festival not found.' } });
    }
    res.json({ data: festival });
  } catch (e) {
    next(e);
  }
};

export const deleteFestival = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await festivalService.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: { message: 'Festival not found.' } });
    }
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};
