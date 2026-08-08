import type { NextFunction, Request, Response } from 'express';
import { hotelService } from '../services/hotelService.js';

export const listHotels = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { region, featured } = req.query;
    
    let hotels;
    if (featured === 'true') {
      hotels = await hotelService.getFeatured();
    } else if (region && typeof region === 'string') {
      hotels = await hotelService.getByRegion(region);
    } else {
      hotels = await hotelService.list();
    }
    
    res.json({ data: hotels });
  } catch (e) {
    next(e);
  }
};

export const getHotel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const hotel = await hotelService.get(id);
    
    if (!hotel) {
      return res.status(404).json({ error: { message: 'Hotel not found.' } });
    }
    
    res.json({ data: hotel });
  } catch (e) {
    next(e);
  }
};

export const getHotelBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const hotel = await hotelService.getBySlug(slug);
    
    if (!hotel) {
      return res.status(404).json({ error: { message: 'Hotel not found.' } });
    }
    
    res.json({ data: hotel });
  } catch (e) {
    next(e);
  }
};

export const createHotel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hotel = await hotelService.create(req.body);
    res.status(201).json({ data: hotel });
  } catch (e) {
    next(e);
  }
};

export const updateHotel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const hotel = await hotelService.update(id, req.body);
    
    if (!hotel) {
      return res.status(404).json({ error: { message: 'Hotel not found.' } });
    }
    
    res.json({ data: hotel });
  } catch (e) {
    next(e);
  }
};

export const deleteHotel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = await hotelService.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: { message: 'Hotel not found.' } });
    }
    
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};
