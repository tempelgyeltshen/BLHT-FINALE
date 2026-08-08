import type { NextFunction, Request, Response } from 'express';
import { brochureService } from '../services/brochureService.js';

export const listBrochures = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { featured } = req.query;
    res.json({
      data: featured === 'true' ? await brochureService.getFeatured() : await brochureService.list()
    });
  } catch (e) {
    next(e);
  }
};

export const getBrochure = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const brochure = await brochureService.get(req.params.id);
    if (!brochure) {
      return res.status(404).json({ error: { message: 'Brochure not found.' } });
    }
    res.json({ data: brochure });
  } catch (e) {
    next(e);
  }
};

export const createBrochure = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const brochure = await brochureService.create(req.body);
    res.status(201).json({ data: brochure });
  } catch (e) {
    next(e);
  }
};

export const updateBrochure = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const brochure = await brochureService.update(req.params.id, req.body);
    if (!brochure) {
      return res.status(404).json({ error: { message: 'Brochure not found.' } });
    }
    res.json({ data: brochure });
  } catch (e) {
    next(e);
  }
};

export const deleteBrochure = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await brochureService.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: { message: 'Brochure not found.' } });
    }
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};
