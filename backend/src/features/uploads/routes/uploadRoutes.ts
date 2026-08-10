import { Router } from 'express';
import { uploadFile } from '../controllers/uploadController.js';
import { requireAdmin } from '../../../core/middleware/auth.js';
import { upload } from '../../../core/middleware/upload.js';

export const uploadRouter = Router();
uploadRouter.post(
    '/', 
    requireAdmin,
    upload.single('file'),  
    uploadFile
);
