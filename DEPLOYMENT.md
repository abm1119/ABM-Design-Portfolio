# Deployment Guide - ABM Design Portfolio

This guide covers deploying the ABM Design Portfolio to Netlify with full blog functionality.

## 🚀 Quick Deploy to Netlify

### Option 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Netlify will automatically detect the build settings from `netlify.toml`

3. **Set Environment Variables**
   In Netlify Dashboard → Site Settings → Environment Variables, add:
   ```
   NOTION_API_KEY=your_notion_integration_token
   NOTION_DATABASE_ID=your_notion_database_id
   VITE_API_BASE_URL=/.netlify/functions
   VITE_ENABLE_BLOG=true
   VITE_API_TIMEOUT=10000
   ```

4. **Deploy**
   - Click "Deploy site"
   - Your site will be available at `https://your-site-name.netlify.app`

### Option 2: Manual Deploy

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to Netlify
   - Or use Netlify CLI:
     ```bash
     npm install -g netlify-cli
     netlify deploy --prod --dir=dist
     ```

## 🔧 Configuration Details

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NOTION_API_KEY` | ✅ | Notion integration token | `ntn_...` |
| `NOTION_DATABASE_ID` | ✅ | Notion database ID | `2a52275d...` |
| `VITE_API_BASE_URL` | ❌ | API base URL | `/.netlify/functions` |
| `VITE_ENABLE_BLOG` | ❌ | Enable/disable blog | `true` |
| `VITE_API_TIMEOUT` | ❌ | API timeout (ms) | `10000` |

### Netlify Functions

The blog API is handled by Netlify Functions located in `netlify/functions/`:
- `blogs.js` - Fetches all published blog posts
- `blog.js` - Fetches a single blog post by slug

### Build Configuration

The `netlify.toml` file contains:
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables for different contexts
- Redirects for SPA routing
- Security headers
- Caching rules

## 🔒 Security Setup

### Notion Integration

1. **Create Notion Integration**
   - Go to [Notion Integrations](https://www.notion.so/my-integrations)
   - Click "New integration"
   - Name it "ABM Portfolio Blog"
   - Copy the "Internal Integration Token"

2. **Share Database with Integration**
   - Open your Notion database
   - Click "Share" → "Invite"
   - Paste your integration name and invite

3. **Get Database ID**
   - Copy the database URL
   - Extract the ID: `https://notion.so/[DATABASE_ID]?v=...`

### Environment Security

- Never commit `.env` files to Git
- Use Netlify's environment variables for production
- The `.env.example` files show the required format

## 📊 Performance Optimizations

### Build Optimizations
- Code splitting with manual chunks
- Asset optimization and naming
- Tree shaking for unused code
- Minification with esbuild

### Runtime Optimizations
- Font preloading and display swap
- Image optimization
- Lazy loading for blog content
- API request caching

### SEO Optimizations
- Meta tags for social sharing
- Structured data
- Canonical URLs
- Proper heading hierarchy

## 🔍 Troubleshooting

### Common Issues

**Blog posts not loading:**
- Check environment variables in Netlify
- Verify Notion integration has access to database
- Check Netlify Functions logs

**Build failures:**
- Ensure all dependencies are installed
- Check TypeScript errors
- Verify environment variables format

**404 errors on refresh:**
- Redirects are configured in `netlify.toml` and `public/_redirects`
- Ensure SPA routing is working

### Debug Commands

```bash
# Test build locally
npm run build
npm run preview

# Test Netlify Functions locally
netlify dev

# Test Netlify Functions
netlify functions:invoke blogs
```

## 📈 Monitoring

### Analytics
- Add Google Analytics or similar
- Monitor Core Web Vitals
- Track user engagement

### Error Monitoring
- Use Sentry or similar service
- Monitor Netlify Functions logs
- Set up uptime monitoring

## 🔄 Updates and Maintenance

### Content Updates
- Blog posts are automatically synced from Notion
- No deployment needed for content changes

### Code Updates
- Push to main branch triggers automatic deployment
- Use deploy previews for testing changes

### Dependencies
- Regularly update npm packages
- Monitor security vulnerabilities
- Test updates in deploy previews

## 📞 Support

For deployment issues:
1. Check Netlify build logs
2. Review environment variables
3. Test locally with production build
4. Check Notion API status

---

**Made with ❤ by Abdul Basit - ABM**
