# Eventra - Deployment Guide

This guide will help you deploy Eventra to production.

## Prerequisites

1. **GitHub Account** - To host your code
2. **MongoDB Atlas Account** - For database (free tier)
3. **Cloudinary Account** - For image uploads (free tier)
4. **Render Account** - For backend hosting (free tier)
5. **Vercel Account** - For frontend hosting (free tier)

---

## Part 1: Setup MongoDB Atlas (Database)

### Step 1: Create MongoDB Atlas Account
1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Choose the **FREE** tier (M0 Sandbox)

### Step 2: Create a Cluster
1. Click "Build a Database"
2. Choose **FREE** shared cluster
3. Select a cloud provider and region (choose one closest to you)
4. Click "Create Cluster"

### Step 3: Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and strong password (SAVE THESE!)
5. Set user privileges to "Read and write to any database"
6. Click "Add User"

### Step 4: Whitelist IP Address
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
5. Replace `<password>` with your actual password
6. Add `/eventra` before the `?` to specify database name

**Your final connection string should look like:**
```
mongodb+srv://username:yourpassword@cluster0.xxxxx.mongodb.net/eventra?retryWrites=true&w=majority
```

---

## Part 2: Setup Cloudinary (Image Storage)

### Step 1: Create Cloudinary Account
1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up for a free account

### Step 2: Get API Credentials
1. Go to your Dashboard
2. You'll see:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
3. Save these credentials

---

## Part 3: Push Code to GitHub

### Step 1: Initialize Git Repository
```bash
cd /Users/nirajnillawar/Downloads/Eve/eventra
git init
git add .
git commit -m "Initial commit - Eventra"
```

### Step 2: Create GitHub Repository
1. Go to [https://github.com/new](https://github.com/new)
2. Name it: `eventra`
3. Make it **Public**
4. Don't initialize with README
5. Click "Create repository"

### Step 3: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/eventra.git
git branch -M main
git push -u origin main
```

---

## Part 4: Deploy Backend to Render

### Step 1: Create Render Account
1. Go to [https://render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select `eventra` repository
4. Configure:
   - **Name**: `eventra-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### Step 3: Add Environment Variables
Click "Advanced" and add these environment variables:

```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_random_secret_key_here_make_it_long_and_secure
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5001
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**Note:** We'll update `FRONTEND_URL` after deploying the frontend.

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Copy your backend URL (e.g., `https://eventra-backend.onrender.com`)

---

## Part 5: Deploy Frontend to Vercel

### Step 1: Update Frontend Environment Variable
1. Create `.env.local` in frontend folder with:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
```

2. Commit and push:
```bash
git add .
git commit -m "Add production API URL"
git push
```

### Step 2: Create Vercel Account
1. Go to [https://vercel.com/signup](https://vercel.com/signup)
2. Sign up with GitHub

### Step 3: Deploy Frontend
1. Click "Add New" → "Project"
2. Import your `eventra` repository
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 4: Add Environment Variable
1. Go to "Environment Variables"
2. Add:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
3. Click "Deploy"

### Step 5: Get Frontend URL
1. After deployment, copy your frontend URL (e.g., `https://eventra.vercel.app`)

---

## Part 6: Update Backend with Frontend URL

1. Go back to Render dashboard
2. Select your backend service
3. Go to "Environment"
4. Update `FRONTEND_URL` to your Vercel URL
5. Save changes (this will redeploy)

---

## Part 7: Seed Database (Optional)

If you want to add sample data:

1. In Render dashboard, go to your backend service
2. Click "Shell" tab
3. Run: `node seeder.js`

---

## Testing Your Deployment

1. Visit your frontend URL
2. Try:
   - Browsing vendors
   - Registering a new account
   - Logging in
   - Uploading images
   - Chat functionality

---

## Troubleshooting

### Backend Issues
- Check Render logs: Dashboard → Your Service → Logs
- Verify all environment variables are set correctly
- Ensure MongoDB IP whitelist includes 0.0.0.0/0

### Frontend Issues
- Check Vercel deployment logs
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check browser console for errors

### Database Connection Issues
- **Verify MongoDB Connection String**: Ensure it follows the format `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority`.
- **Check IP Whitelist**: This is the #1 cause of errors. Go to MongoDB Atlas -> Network Access -> Add IP Address -> Allow Access from Anywhere (0.0.0.0/0).
- **Check Password**: If your password has special characters (like @, :, #), you must URL encode them.
- **Run Diagnostic Script**:
    1. In Render Dashboard, go to your backend service.
    2. Click on the "Shell" tab.
    3. Run: `node check-db.js`
    4. This script will test the connection and give you specific hints.

---

## Free Tier Limitations

**Render Free Tier:**
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free

**Vercel Free Tier:**
- Unlimited deployments
- 100 GB bandwidth/month
- Serverless function execution limits

**MongoDB Atlas Free Tier:**
- 512 MB storage
- Shared RAM
- No backups

---

## Next Steps After Deployment

1. **Custom Domain**: Add your own domain in Vercel settings
2. **Monitoring**: Set up error tracking (Sentry)
3. **Analytics**: Add Google Analytics
4. **Performance**: Monitor with Vercel Analytics
5. **Backups**: Set up MongoDB backups (paid feature)

---

## Support

If you encounter issues:
1. Check the logs in Render/Vercel
2. Verify all environment variables
3. Test API endpoints directly
4. Check MongoDB Atlas connection

---

**Congratulations! Eventra is now live! 🎉**
