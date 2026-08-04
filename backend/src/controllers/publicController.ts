import type { NextFunction, Request, Response } from 'express';
import { getDashboardStats, searchContent } from '../services/dashboardService.js';

export async function search(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ data: await searchContent(req.query.q as string) });
  } catch (error) {
    next(error);
  }
}

export async function dashboard(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ data: await getDashboardStats() });
  } catch (error) {
    next(error);
  }
}
