import { Router } from 'express';
import { z } from 'zod';
import { search } from '../controllers/searchController.js';

export const searchRouter = Router();

searchRouter.get('/', (req, res, next) => {
  const result = z.object({
    q: z.string().trim().min(1).max(100)
  }).safeParse(req.query);

  if (!result.success) {
    return res.status(400).json({
      error: { message: 'A search query is required.' }
    });
  }

  req.query.q = result.data.q;
  return search(req, res, next);
});
