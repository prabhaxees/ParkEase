# ParkEase Backend - Render Deployment Guide

## Prerequisites
- Render account (free tier available at render.com)
- MongoDB Atlas URI
- Cloudinary credentials

## Environment Variables
Before deploying, set up these environment variables in Render dashboard:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
PORT=5000
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

## Deployment Steps

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Create Backend Service on Render
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Fill in the details:
   - **Name**: parkease-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid)

### 3. Add Environment Variables
1. In Render dashboard, go to your service
2. Click "Environment" tab
3. Add all the environment variables listed above

### 4. Deploy
- Click "Create Web Service"
- Render will automatically deploy whenever you push to main
- Your backend will be available at: `https://parkease-backend.onrender.com`

## Important Notes
- Free tier services spin down after 15 minutes of inactivity (cold start)
- Use paid tier for production to avoid cold starts
- Update frontend's API endpoint to your backend URL
- Keep sensitive data in environment variables, never commit to git

## Monitoring
- View logs: Service Dashboard → Logs tab
- Check status: Service Dashboard → Events tab

## Troubleshooting
- **Connection errors**: Check MONGO_URI and network access
- **Missing dependencies**: Ensure all packages in package.json are correctly listed
- **Cold start issues**: Consider upgrading to paid tier
