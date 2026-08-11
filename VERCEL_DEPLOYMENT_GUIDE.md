# Vercel Deployment Guide

## Overview
This guide will help you deploy your React + Vite frontend to Vercel and connect it to your Render backend.

## Pre-Deployment Setup

### 1. Update Backend URL in Render
Make sure your Render backend is deployed and note the URL:
- Your backend URL: `https://your-service-name.onrender.com`

### 2. Update Environment Variables
You'll need to set the `VITE_API_URL` environment variable in Vercel to point to your Render backend.

## Vercel Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up (you can use your GitHub account)

2. **Import Your Repository**
   - Click "Add New Project"
   - Select your GitHub repository: `tempelgyeltshen/BLHT-FINALE`
   - Vercel will automatically detect it's a Vite project

3. **Configure Project Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `./frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-backend-url.onrender.com`
   - Replace `your-backend-url.onrender.com` with your actual Render backend URL

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Vercel will provide you with a URL like `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy from Frontend Directory**
```bash
cd frontend
vercel
```

4. **Follow the Prompts**
   - Set up and deploy? → Yes
   - Which scope? → Your account
   - Link to existing project? → No
   - Project name → (accept default or choose one)
   - Directory → ./ (current directory)
   - Override settings? → No

5. **Add Environment Variable**
```bash
vercel env add VITE_API_URL production
```
When prompted, enter your Render backend URL: `https://your-backend-url.onrender.com`

6. **Redeploy with Environment Variable**
```bash
vercel --prod
```

## Post-Deployment Configuration

### 1. Update Render Backend CORS
Your Render backend needs to allow requests from your Vercel frontend:

1. Go to your Render dashboard
2. Find your backend service
3. Add/Update environment variable:
   - `FRONTEND_ORIGIN` = `https://your-vercel-app.vercel.app`
4. Render will automatically redeploy with the new CORS setting

### 2. Test the Connection
```bash
# Test backend health
curl https://your-backend-url.onrender.com/api/health

# Test frontend
# Visit your Vercel URL and check if API calls work
```

### 3. Update Vercel Environment Variable if Needed
If you need to change the backend URL:
```bash
vercel env rm VITE_API_URL production
vercel env add VITE_API_URL production
vercel --prod
```

## Troubleshooting

### Common Issues

#### 1. CORS Errors
**Problem**: Browser shows CORS errors when making API requests
**Solution**:
- Update `FRONTEND_ORIGIN` in Render environment variables
- Make sure it matches your Vercel URL exactly (including https://)
- Wait for Render to redeploy

#### 2. API Connection Failed
**Problem**: Frontend can't connect to backend
**Solution**:
- Check `VITE_API_URL` is set correctly in Vercel
- Verify backend is running: `curl https://your-backend-url.onrender.com/api/health`
- Check browser console for specific error messages

#### 3. Build Failures
**Problem**: Vercel build fails
**Solution**:
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Test locally: `cd frontend && npm run build`

#### 4. Environment Variables Not Working
**Problem**: Changes to environment variables don't take effect
**Solution**:
- Redeploy after changing environment variables: `vercel --prod`
- Environment variables only apply to new deployments
- Check Vercel dashboard to confirm variables are set

#### 5. 404 Errors on Refresh
**Problem**: Refreshing a page shows 404 error
**Solution**:
- The `vercel.json` file we created handles this with rewrites
- Ensure `vercel.json` is in the frontend directory
- Redeploy if you made changes

## Custom Domain (Optional)

### Add Custom Domain to Vercel
1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS instructions provided by Vercel

### Update CORS for Custom Domain
1. Update `FRONTEND_ORIGIN` in Render
2. Set it to your custom domain URL
3. Redeploy backend

## Performance Optimization

### Enable Vercel Analytics
1. Go to project settings in Vercel
2. Enable "Analytics"
3. Add the Vercel Analytics script to your app if needed

### Image Optimization
- Vercel automatically optimizes images
- Consider using Vercel's Image Optimization API for better performance

## Monitoring

### Vercel Dashboard
- Monitor build status
- View deployment logs
- Check analytics and performance

### Render Dashboard
- Monitor backend health
- View API logs
- Check database connections

## Cost

### Vercel Free Tier
- 100GB bandwidth per month
- Unlimited deployments
- Automatic SSL
- Great for development and small projects

### Vercel Pro Tier ($20/month)
- 1TB bandwidth
- Faster builds
- Priority support
- Advanced analytics

## Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **API Keys**: Store sensitive data in environment variables
3. **HTTPS**: Both Vercel and Render provide automatic HTTPS
4. **CORS**: Properly configure allowed origins
5. **Rate Limiting**: Backend has rate limiting enabled

## Continuous Deployment

Both Vercel and Render support automatic deployments:

### Vercel
- Automatically deploys when you push to GitHub
- Can configure branch-specific deployments
- Preview deployments for pull requests

### Render
- Automatically deploys when you push to main branch
- Can configure branch-specific deployments
- Good for staging environments

## Next Steps

1. ✅ Deploy backend to Render (completed)
2. ✅ Deploy frontend to Vercel (in progress)
3. Update CORS settings in Render
4. Test the full application
5. Set up custom domains (optional)
6. Configure monitoring and analytics

## Support

- Vercel Documentation: https://vercel.com/docs
- Render Documentation: https://render.com/docs
- React Router: https://reactrouter.com/
- Vite: https://vitejs.dev/