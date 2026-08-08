import type { NextFunction, Request, Response } from 'express';
import { homepageService } from '../services/homepageService.js';

export const getHomepageConfig = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const config = await homepageService.getConfig();
    res.json({ data: config });
  } catch (e) {
    next(e);
  }
};

export const updateHomepageConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const config = await homepageService.updateConfig(req.body);
    res.json({ data: config });
  } catch (e) {
    next(e);
  }
};
