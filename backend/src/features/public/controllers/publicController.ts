import type { NextFunction, Request, Response } from 'express';
import { getDashboardStats } from '../services/publicService.js';

export async function dashboard(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ data: await getDashboardStats() });
  } catch (error) {
    next(error);
  }
}
