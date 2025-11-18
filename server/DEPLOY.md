# Server Deployment Guide

This Express server provides the blog API functionality for the ABM Design Portfolio.

## 🚀 Deployment Options

### Option 1: Railway (Recommended - Free)

1. **Create Railway Account**
   - Go to [Railway](https://railway.app)
   - Sign up with GitHub

2. **Deploy from GitHub**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Choose the `server` folder as the root directory

3. **Set Environment Variables**
   ```
   NOTION_API_KEY=ntn_f92503707891vwW3OMbIXBEWQB7aGHAsDv67u0EXOYM0vk
   NOTION_DATABASE_ID=2a52275d74e581a8bddfe2634ee7f58d
   NODE_ENV=production
   PORT=3000
   ```

4. **Deploy**
   - Railway will automatically detect the Node.js app
   - Your API will be available at: `https://your-app-name.railway.app`

### Option 2: Render (Free Tier)

1. **Create Render Account**
   - Go to [Render](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Set root directory to `server`

3. **Configuration**
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment: Node

4. **Environment Variables**
   ```
   NOTION_API_KEY=ntn_f92503707891vwW3OMbIXBEWQB7aGHAsDv67u0EXOYM0vk
   NOTION_DATABASE_ID=2a52275d74e581a8bddfe2634ee7f58d
   NODE_ENV=production
   ```

### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App**
   ```bash
   heroku login
   heroku create abm-design-blog-api
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NOTION_API_KEY=ntn_f92503707891vwW3OMbIXBEWQB7aGHAsDv67u0EXOYM0vk
   heroku config:set NOTION_DATABASE_ID=2a52275d74e581a8bddfe2634ee7f58d
   heroku config:set NODE_ENV=production
   ```

4. **Deploy**
   ```bash
   git subtree push --prefix server heroku main
   ```

## 🔧 Local Testing

Before deploying, test locally:

```bash
cd server
npm install
npm run check-env
npm start
```

## 📡 API Endpoints

Once deployed, your server will provide:

- `GET /` - Health check
- `GET /blogs` - Get all published blog posts
- `GET /blog/:slug` - Get single blog post by slug

## 🔄 Update Frontend

After deploying the server, update your frontend environment variables:

```env
VITE_API_BASE_URL=https://your-server-url.railway.app
```

Then redeploy your Netlify site.

## 🎯 Why Deploy Both?

- **Netlify Functions**: Integrated with your frontend, serverless
- **Standalone Server**: More control, easier debugging, can be used by other apps

Choose the option that best fits your needs!
