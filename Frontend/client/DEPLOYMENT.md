# ParkEase Frontend - Render Deployment Guide

## Prerequisites
- Render account (free tier available at render.com)
- Backend service already deployed on Render

## Environment Variables
Before deploying, set up these environment variables in Render dashboard:

```
VITE_API_URL=https://your-backend-service.onrender.com
```

## Deployment Steps

### 1. Update API Configuration
1. Create `.env.production` file:
```
VITE_API_URL=https://parkease-backend.onrender.com
```

2. Or add environment variable in Render dashboard

### 2. Push Code to GitHub
```bash
git add .
git commit -m "Prepare frontend for Render deployment"
git push origin main
```

### 3. Create Frontend Service on Render
1. Go to https://dashboard.render.com
2. Click "New +" → "Static Site" (for React apps) OR "Web Service" (for Node server)
3. Connect your GitHub repository

#### Option A: Static Site (Recommended for React)
1. **Name**: parkease-frontend
2. **Build Command**: `npm run build`
3. **Publish Directory**: `dist`
4. Click "Create Static Site"

#### Option B: Web Service (Node Server)
1. **Name**: parkease-frontend
2. **Environment**: Node
3. **Build Command**: `cd Frontend/client && npm run build`
4. **Start Command**: `npm run start`
5. Add environment variable: `VITE_API_URL`
6. Click "Create Web Service"

### 4. Add Environment Variables (if using Web Service)
1. In Render dashboard, go to your service
2. Click "Environment" tab
3. Add `VITE_API_URL=https://parkease-backend.onrender.com`

### 5. Deploy
- Render will automatically deploy when you push to main
- Your frontend will be available at: `https://parkease-frontend.onrender.com`

## Important Notes
- Update all API calls to use the environment variable
- Ensure your backend service is deployed and running before frontend
- Add CORS headers in backend to allow frontend domain
- For Static Site: very fast, no server costs. For Web Service: more control, can add server logic

## Recommended Setup
- Frontend: Static Site (free, fast)
- Backend: Web Service (free tier with auto-wake, or paid for production)

## Troubleshooting
- **CORS errors**: Add frontend URL to CORS whitelist in backend
- **API not found**: Check VITE_API_URL is correct and backend is running
- **Build fails**: Ensure npm dependencies are correct and all import paths are valid
- **Blank page**: Check browser console for errors

## Monitoring
- Static Site: View deployment logs
- Web Service: Check Logs and Events tabs
