# Render Deployment Guide

## Pre-Deployment Checklist

### ✅ Changes Made
1. **Created `render.yaml`** - Render service configuration file
2. **Created `backend/.env.example`** - Environment variables template
3. **Created `backend/Dockerfile.render`** - Optimized Dockerfile for Render
4. **Updated `backend/package.json`** - Fixed start script for production
5. **Updated `backend/.dockerignore`** - Optimized Docker build context
6. **Enhanced `backend/src/app/server.ts`** - Added better logging and graceful shutdown

## Render Deployment Steps

### 1. Push Changes to GitHub
```bash
git add render.yaml backend/.env.example backend/Dockerfile.render backend/package.json backend/.dockerignore backend/src/app/server.ts
git commit -m "Add Render deployment configuration"
git push origin main
```

### 2. Create Render Web Service

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. **IMPORTANT**: Select "Docker" as the runtime environment
5. Use the following settings:
   - **Name**: `blht-backend` (or your preferred name)
   - **Branch**: `main`
   - **Dockerfile Path**: `./backend/Dockerfile.render`
   - **Docker Context**: `./backend`
   - **Region**: Choose the closest region to your users
   - **Plan**: Free (for testing) or Standard (for production)

### 3. Configure Environment Variables

In the Render dashboard, add the following environment variables:

#### Required Variables
```
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_ACCESS_SECRET=your-32-character-or-longer-secret
JWT_REFRESH_SECRET=different-32-character-or-longer-secret
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD_HASH=bcrypt-hash-of-admin-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_ORIGIN=https://your-frontend-domain.com
```

#### Generating Secure Secrets

**JWT Secrets:**
```bash
# Generate 32+ character random strings
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Admin Password Hash:**
```bash
# Generate bcrypt hash for your admin password
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10));"
```

### 4. Database Setup

#### Option A: MongoDB Atlas (Recommended)
1. Create a free MongoDB Atlas account
2. Create a cluster
3. Create a database user
4. Whitelist Render's IP addresses (or use 0.0.0.0/0 for testing)
5. Get your connection string
6. Add to Render as `MONGODB_URI`

#### Option B: Render MongoDB
1. In Render, create a new MongoDB instance
2. Render will automatically provide the connection string
3. Add the connection string to your web service as `MONGODB_URI`

### 5. Cloudinary Setup

1. Create a Cloudinary account
2. Get your cloud name, API key, and API secret from the dashboard
3. Add these to Render environment variables

### 6. Deploy

Once you've configured everything:
1. Click "Create Web Service" in Render
2. Render will automatically build and deploy your application
3. Monitor the deployment logs for any errors

## Troubleshooting

### Common Issues and Solutions

#### 1. Build Failures
**Issue**: Docker build fails during deployment
**Solution**: 
- Check Render logs for specific error messages
- Ensure all dependencies are in `package.json`
- Verify TypeScript compiles locally: `cd backend && npm run build`

#### 2. Database Connection Errors
**Issue**: Application fails to connect to MongoDB
**Solution**:
- Verify `MONGODB_URI` is correct in Render environment variables
- Check MongoDB Atlas IP whitelist (allow Render's IPs)
- Ensure database user has correct permissions

#### 3. Health Check Failures
**Issue**: Render health checks fail
**Solution**:
- Check if the application is starting properly (view logs)
- Verify `/api/health` endpoint is accessible
- Increased health check start period to 40s in Dockerfile

#### 4. Environment Variable Errors
**Issue**: Application fails with "Missing required environment variables"
**Solution**:
- Ensure all required variables are set in Render dashboard
- Verify `JWT_ACCESS_SECRET` is at least 32 characters
- Check that admin credentials are properly set

#### 5. Port Binding Issues
**Issue**: Application fails to start with port errors
**Solution**:
- Render automatically assigns a port via the `PORT` environment variable
- Your application correctly uses `process.env.PORT || 4000`
- No manual port configuration needed

## Verification

### 1. Check Deployment Status
- In Render dashboard, verify your service shows "Live"
- Check that the health check is passing

### 2. Test API Endpoints
```bash
# Health check
curl https://your-service-url.onrender.com/api/health

# Should return:
{
  "status": "ok",
  "timestamp": "2026-08-11T...",
  "uptime": 123.456,
  "environment": "production"
}
```

### 3. Check Logs
- In Render dashboard, view real-time logs
- Look for any error messages or warnings
- Verify database connection is successful

## Post-Deployment Setup

### 1. Update Frontend
Update your frontend's API base URL to point to your Render backend:
```
https://your-service-url.onrender.com
```

### 2. Set Up Monitoring
- Enable Render's monitoring features
- Set up alerts for service failures
- Monitor database performance

### 3. Security Hardening
- Enable HTTPS (automatic on Render)
- Review security headers
- Set up rate limiting limits appropriate for your traffic
- Configure CORS properly for your frontend domain

## Cost Considerations

### Free Tier (Render)
- Web Service: Free tier available (spins down after inactivity)
- MongoDB: Free tier available on MongoDB Atlas
- Cloudinary: Free tier available

### Production Recommendations
- Upgrade to paid Render instance for consistent performance
- Use paid MongoDB Atlas for better performance and features
- Consider Cloudinary paid tier for higher bandwidth needs

## Alternative: Manual Render Configuration

If you prefer not to use `render.yaml`, you can configure manually in Render:

1. Create web service as described above
2. Instead of using render.yaml, manually set:
   - Runtime: Docker
   - Dockerfile: `./backend/Dockerfile.render`
   - Context: `./backend`
   - Add all environment variables manually

## Support

If you encounter issues:
1. Check Render logs first
2. Verify all environment variables are set
3. Test database connectivity
4. Ensure Docker build works locally: `cd backend && docker build -f Dockerfile.render -t test .`

## Next Steps

After successful deployment:
1. Test all API endpoints
2. Verify authentication works
3. Test file uploads to Cloudinary
4. Monitor performance and logs
5. Set up backup procedures for database