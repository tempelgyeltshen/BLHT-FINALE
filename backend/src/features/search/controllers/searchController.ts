import type { NextFunction, Request, Response } from 'express';
import { searchContent } from '../services/searchService.js';

export async function search(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ data: await searchContent(req.query.q as string) });
  } catch (error) {
    next(error);
  }
}
