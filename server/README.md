# Blog API Server

A Node.js/Express server that integrates with Notion to serve blog posts as a REST API.

## Quick Start

### 1. Environment Setup

Copy `.env.example` to `.env` and fill in your Notion credentials:

```bash
cp .env.example .env
```

Then edit `server/.env`:

```env
NOTION_API_KEY=your_internal_integration_token
NOTION_DATABASE_ID=your_database_id
NODE_ENV=production
```

### 2. Verify Configuration

```bash
node server/check-env.js
```

### 3. Start the Server

```bash
npm run server
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check

```http
GET /
```

Returns server status and available endpoints.

**Example**:
```bash
curl http://localhost:3000/
```

**Response**:
```json
{
  "message": "Blog API Server is running",
  "status": "healthy",
  "endpoints": ["/blogs", "/blog/:slug"],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### List All Blogs

```http
GET /blogs
```

Returns all published blog posts.

**Query Parameters**: None

**Example**:
```bash
curl http://localhost:3000/blogs
```

**Response**:
```json
[
  {
    "id": "page-id",
    "title": "My First Blog Post",
    "slug": "my-first-blog-post",
    "pubDate": "2024-01-15",
    "contentSnippet": "This is a preview of my blog post...",
    "coverImage": "https://...",
    "tags": ["tech", "tutorial"],
    "category": "Tutorial",
    "creator": "Your Name",
    "status": "Published",
    "created": "2024-01-10"
  }
]
```

### Get Single Blog Post

```http
GET /blog/:slug
```

Returns a complete blog post with full HTML content.

**Parameters**:
- `slug` (string, required): The URL-friendly blog slug

**Example**:
```bash
curl http://localhost:3000/blog/my-first-blog-post
```

**Response**:
```json
{
  "id": "page-id",
  "title": "My First Blog Post",
  "slug": "my-first-blog-post",
  "pubDate": "2024-01-15",
  "contentSnippet": "This is a preview of my blog post...",
  "content": "<h1>My First Blog Post</h1><p>Full HTML content...</p>",
  "coverImage": "https://...",
  "tags": ["tech", "tutorial"],
  "category": "Tutorial",
  "creator": "Your Name",
  "status": "Published",
  "created": "2024-01-10"
}
```

## Error Handling

The server provides helpful error messages:

### 500 - Server Error

```json
{
  "error": "Failed to fetch blogs",
  "message": "Invalid Notion API key. Please check your credentials.",
  "details": "Error details (only in development mode)"
}
```

### 404 - Not Found

```json
{
  "error": "Blog post not found"
}
```

## Server Features

- ✅ Full CORS support
- ✅ Automatic retry logic on the frontend
- ✅ Comprehensive error messages
- ✅ Request logging to console
- ✅ HTML generation from Notion blocks
- ✅ Support for rich text formatting
- ✅ Image lazy loading
- ✅ Security: HTML escaping for code blocks
- ✅ Production-ready

## Notion Block Support

The server converts Notion blocks to semantic HTML:

| Block Type | Output |
|---|---|
| Paragraph | `<p>` |
| Heading 1/2/3 | `<h1>`, `<h2>`, `<h3>` |
| Bulleted List Item | `<li>` (in lists) |
| Numbered List Item | `<li>` (in lists) |
| To-Do | `<input type="checkbox">` |
| Code | `<pre><code class="language-...">` |
| Quote | `<blockquote>` |
| Image | `<figure><img><figcaption>` |
| Video | `<iframe>` |
| Callout | `<div class="callout">` |
| Toggle | `<details><summary>` |
| Divider | `<hr />` |
| Bookmark | `<a href="...">` |
| Table | `<table><tr><td>` |

## Configuration

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NOTION_API_KEY` | Yes | Your Notion Internal Integration Token |
| `NOTION_DATABASE_ID` | Yes | Your Notion database ID |
| `NODE_ENV` | No | Set to "development" for verbose logs |

### Database Schema

Your Notion database should have these properties:

```
Title (Title)
Status (Select with "Published" option)
Slug (Rich Text)
Published (Date)
Created (Date)
Meta Description (Rich Text)
Category (Select)
Tags (Multi-select)
Author (Rich Text)
```

## Logging

The server logs all operations:

```
✅ Server running at http://localhost:3000
📡 Fetching blogs from Notion database...
✅ Found 5 published blogs
✅ Successfully formatted 5 blogs
```

Errors are logged with context:
```
❌ Error fetching blogs: Invalid API key
```

## Security

- API keys are stored only in environment variables
- Code blocks are HTML-escaped to prevent injection
- External links open in new tabs with `rel="noopener noreferrer"`
- CORS is enabled for development

## Performance

- Posts are cached by the browser
- Images use lazy loading
- Only published posts are served
- Database queries are optimized with filters and sorting

## Troubleshooting

### Server won't start

Check `.env` file exists with valid credentials:
```bash
node server/check-env.js
```

### Blogs not appearing

1. Verify blog Status is "Published"
2. Check that Slug property is filled
3. Run `curl http://localhost:3000/blogs` to test API directly
4. Check browser console for network errors

### Images not loading

Ensure Notion images are accessible from your browser. External URLs must be HTTPS.

### Slow performance

- Check Notion API rate limits
- Consider caching responses on the frontend
- Reduce number of posts fetched

## Development

### Enable verbose logging

Set in `.env`:
```env
NODE_ENV=development
```

### Monitor API requests

Use browser DevTools (F12) → Network tab to see all requests.

### Test API directly

```bash
# List all blogs
curl http://localhost:3000/blogs

# Get single blog
curl http://localhost:3000/blog/my-slug

# Pretty print JSON
curl http://localhost:3000/blogs | jq
```

## Deployment

For production:

1. Set environment variables on your hosting provider
2. Install dependencies: `npm install`
3. Start server: `node server/server.js`
4. Update frontend API URL to your production domain

Example with PM2:
```bash
pm2 start server/server.js --name "blog-api"
pm2 save
pm2 startup
```

## Related Files

- `server/.env` - Configuration (not in git)
- `server/.env.example` - Configuration template
- `server/check-env.js` - Configuration validator
- `/BLOG_SETUP.md` - Full setup guide
- `src/components/Blog/Blog.tsx` - Frontend list component
- `src/components/Blog/BlogDetail.tsx` - Frontend detail component
