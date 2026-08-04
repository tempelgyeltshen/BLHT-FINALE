import { Router } from 'express';
import { uploadFile } from '../controllers/uploadController.js';
import { requireAdmin } from '../middleware/auth.js';
import { csrfProtection } from '../middleware/csrf.js';
import { upload } from '../middleware/upload.js';

export const uploadRouter = Router();
uploadRouter.post(
    '/', 
    requireAdmin,
    upload.single('file'),  
    csrfProtection, 
    uploadFile
);
