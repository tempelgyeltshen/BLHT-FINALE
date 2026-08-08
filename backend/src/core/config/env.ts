import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT || 4000),
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || '',
  adminEmail: process.env.ADMIN_EMAIL || '',
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || '',
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || '',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
};
