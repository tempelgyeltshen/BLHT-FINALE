import type { NextFunction, Request, Response } from 'express';
import { uploadProvider } from '../services/uploadService.js';
import { formatFileSize } from '../../../core/utils/autoCalculate.js';
import { AppError } from '../../../core/errors/AppError.js';

export async function uploadFile(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: { message: 'A valid file is required.' } });
    }
    
    // Check file size limit (5GB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB
    if (req.file.size > MAX_FILE_SIZE) {
      return res.status(413).json({ 
        error: { 
          message: `File size ${formatFileSize(req.file.size)} exceeds maximum allowed size of ${formatFileSize(MAX_FILE_SIZE)}.` 
        } 
      });
    }
    
    const result = await uploadProvider.store(req.file, String(req.body.folder || 'misc'));
    
    // Auto-calculate file size
    const fileSize = formatFileSize(req.file.size);
    
    res.status(201).json({
      data: {
        ...result,
        fileSize, // Auto-calculated file size
        originalSize: req.file.size // Original size in bytes for reference
      }
    });
  } catch (error) {
    // Handle specific upload errors
    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
        return next(new AppError(408, 'Upload timeout. The file may be too large or your connection is slow.'));
      }
      if (error.message.includes('ENOSPC') || error.message.includes('memory')) {
        return next(new AppError(507, 'Server storage full. Please try with a smaller file.'));
      }
    }
    next(error);
  }
}
