import type { NextFunction, Request, Response } from 'express';
import { packageService } from '../services/packageService.js';

export const listPackages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, featured } = req.query;

    if (featured === 'true') {
      return res.json({ data: await packageService.getFeatured() });
    }
    if (category && typeof category === 'string') {
      return res.json({ data: await packageService.getByCategory(category) });
    }

    res.json({ data: await packageService.list() });
  } catch (e) {
    next(e);
  }
};

export const getPackage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pkg = await packageService.get(req.params.id);
    if (!pkg) {
      return res.status(404).json({ error: { message: 'Package not found.' } });
    }
    res.json({ data: pkg });
  } catch (e) {
    next(e);
  }
};

export const createPackage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pkg = await packageService.create(req.body);
    res.status(201).json({ data: pkg });
  } catch (e) {
    next(e);
  }
};

export const updatePackage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pkg = await packageService.update(req.params.id, req.body);
    if (!pkg) {
      return res.status(404).json({ error: { message: 'Package not found.' } });
    }
    res.json({ data: pkg });
  } catch (e) {
    next(e);
  }
};

export const deletePackage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await packageService.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: { message: 'Package not found.' } });
    }
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};
