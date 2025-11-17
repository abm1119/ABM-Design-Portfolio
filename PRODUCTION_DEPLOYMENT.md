# Production Deployment Guide

## Prerequisites
- Node.js 18+ installed
- npm/yarn package manager
- Git configured

## Build & Deploy Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Build Production Bundle
```bash
npm run build
```
This creates optimized `dist/` folder with:
- Minified JavaScript (terser)
- Code splitting (react-vendor, notion-vendor chunks)
- No source maps in production

### 3. Run Server
```bash
npm run server
```
Server runs on `http://localhost:3000`

### 4. Preview Production Build Locally
```bash
npm run preview
```
Tests the production build before deployment

## Deployment Platforms

### Vercel (Recommended for React)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### AWS Amplify
```bash
amplify init
amplify publish
```

### GitHub Pages
```bash
npm run build
# Push dist/ to gh-pages branch
```

## Environment Variables
Create `.env` file in project root:
```
VITE_API_URL=https://your-api.com
VITE_NOTION_TOKEN=your_notion_token
```

Create `server/.env`:
```
PORT=3000
NOTION_API_KEY=your_notion_key
```

## Performance Optimization
- ✅ Code splitting enabled
- ✅ Minification enabled
- ✅ Source maps disabled
- ✅ Tree-shaking enabled
- ✅ ES2020 target for modern browsers

## Git Workflow
```bash
# Create feature branch
git checkout -b feature/name

# Commit changes
git add .
git commit -m "feat: description"

# Push to remote
git push origin feature/name

# Create pull request for review
```

## Monitoring
- Check browser DevTools for performance
- Monitor Core Web Vitals
- Test on mobile devices
- Verify API connectivity

## Rollback
```bash
git revert <commit-hash>
npm run build
# Redeploy
```

## Support
Contact: info@abmdesign.com
