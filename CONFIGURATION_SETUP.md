# Configuration Setup Guide

## 🔐 Admin Credentials

- **Username**: `admin`
- **Password**: `admin@123`

## 📧 Inquiry Emails

New inquiry-form submissions are:
1. **Stored** on the backend (`backend/data/inquiries.json`) and shown in **Admin → Customer Inquiries**.
2. **Emailed** to the admin inbox (default: `tempelgyeltshen12345@gmail.com`) via Resend.

Set these in `backend/.env` / `docker-compose.env`:

```bash
# Admin inbox that receives inquiry notifications
ADMIN_EMAIL=tempelgyeltshen12345@gmail.com

# Resend API key (https://resend.com — free tier) — actually delivers the emails
RESEND_API_KEY=re_xxxxxxxx
EMAIL_FROM=Inquiries <onboarding@resend.dev>
```

Fallbacks when `RESEND_API_KEY` is not set: `EMAIL_WEBHOOK_URL` (generic JSON webhook) → server console log (development).

When an admin sends a proposal from **Admin → Customer Inquiries**, the client is emailed the proposal and the status is set to `quoted`.

## ☁️ Cloudinary Configuration

- **Cloud Name**: `oh6ks8gw`
- **API Key**: `246562165822639`
- **API Secret**: `C6UQiBlvB_EOeRG6S70j5NRypUU`

## 📋 Configuration Files Updated

### Backend Configuration
- ✅ `backend/.env` - Development environment with your credentials
- ✅ `backend/.env.example` - Example template (your credentials already added)
- ✅ `docker-compose.env` - Docker environment with your credentials
- ✅ `docker-compose.env.example` - Docker template (your credentials already added)

### Development Mode Configuration
The system is configured to work in development mode without MongoDB:
- ✅ **No MongoDB required** - System will run without database in development
- ✅ **Environment admin credentials** - Uses env variables for admin login
- ✅ **Cloudinary ready** - File uploads will work with your Cloudinary account

## 🚀 Running the Application

### Option 1: Development Mode (Recommended for Testing)

**Start Backend:**
```bash
cd backend
npm run dev
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```

**Access:**
- Frontend: http://localhost:3005
- Backend API: http://localhost:4002 (currently running)
- Admin Login: Use `admin` / `admin@123`

### Option 2: Docker Mode (Production)

**Start all services:**
```bash
docker-compose up -d
```

**Access:**
- Frontend: http://localhost
- Backend API: http://localhost:4000
- Admin Login: Use `admin` / `admin@123`

## 🔧 Key Features Configured

### ✅ File Upload Limits
- **PDF Uploads**: Up to 5GB (for brochures)
- **Image Uploads**: Up to 1GB (for photos)
- **Video Uploads**: Up to 1GB (for media)

### ✅ Auto-Calculated Metadata
- **File Size**: Automatically calculated from uploaded files
- **Video Duration**: Auto-calculated from YouTube URLs
- **Page Count**: Auto-calculated from PDF files (when available)

### ✅ localStorage Management
- **Safe Storage**: Handles quota errors gracefully
- **Large File Support**: Strips base64 data before saving to localStorage
- **No Errors**: System continues working even if localStorage is full

### ✅ Admin Interface
- **Clean UI**: No sparkles or decorative icons
- **Professional Layout**: Clean metadata displays
- **Better Brochure UI**: Removed flip book, replaced with details view
- **Video & Image Support**: Upload both from desktop

## 🎯 Using the Admin Panel

1. **Navigate to Admin**: Go to http://localhost:3000 and click "Admin Portal"
2. **Login**: Use credentials `admin` / `admin@123`
3. **Upload Content**: 
   - Upload PDFs for brochures (up to 5GB)
   - Upload images/videos for galleries (up to 1GB)
   - Add YouTube videos (auto-calculates duration/thumbnail)
4. **Manage Content**: Full CRUD for packages, hotels, brochures, videos

## 📝 Notes

- **MongoDB Optional**: Development mode works without MongoDB for testing
- **Cloudinary Required**: File uploads require the Cloudinary configuration
- **Security**: All credentials are in `.gitignore` protected files
- **Production**: For production, set up MongoDB and use `NODE_ENV=production`

## 🔒 Security Best Practices

- ✅ Credentials stored in `.env` files (gitignored)
- ✅ Docker compose env file gitignored
- ✅ Password hashed with bcrypt
- ✅ JWT secrets are 32+ characters
- ✅ MongoDB ports not exposed in docker-compose

## 🚨 Important for Production

Before deploying to production:
1. Set up MongoDB Atlas or MongoDB server
2. Update `MONGODB_URI` in production environment
3. Change admin password to something secure
4. Regenerate JWT secrets with truly random values
5. Ensure Cloudinary account has proper permissions
6. Set `NODE_ENV=production` in docker-compose.env