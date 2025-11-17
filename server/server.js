import express from 'express';
import cors from 'cors';
import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config({ path: './server/.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Validate environment
if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
  console.error('❌ Missing required environment variables');
  if (!process.env.NOTION_API_KEY) console.error('   - NOTION_API_KEY');
  if (!process.env.NOTION_DATABASE_ID) console.error('   - NOTION_DATABASE_ID');
  process.exit(1);
}

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

// Middleware
app.use(cors());
app.use(express.json());

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    return null;
  }
};

const extractText = (richText) => {
  if (!richText || !Array.isArray(richText)) return '';
  return richText.map((t) => t?.plain_text || '').join('');
};

const extractTagsFromMultiSelect = (multiSelect) => {
  if (!multiSelect || !Array.isArray(multiSelect)) return [];
  return multiSelect.map((tag) => tag?.name).filter(Boolean);
};

const getPropertyValue = (properties, name) => {
  if (!properties) return null;
  const prop = properties[name];
  if (!prop) return null;

  try {
    switch (prop.type) {
      case 'title':
        return extractText(prop.title);
      case 'rich_text':
        return extractText(prop.rich_text);
      case 'date':
        return prop.date?.start || null;
      case 'select':
        return prop.select?.name || null;
      case 'status':
        return prop.status?.name || null;
      case 'multi_select':
        return extractTagsFromMultiSelect(prop.multi_select);
      case 'files':
        if (prop.files && prop.files.length > 0) {
          const file = prop.files[0];
          return file.type === 'external' ? file.external?.url : file.file?.url;
        }
        return null;
      default:
        return null;
    }
  } catch (error) {
    console.error(`Error extracting property ${name}:`, error.message);
    return null;
  }
};

const blockToHtml = (block) => {
  try {
    const { type } = block;
    const blockContent = block[type];

    if (!blockContent) return '';

    switch (type) {
      case 'paragraph':
        return `<p>${extractText(blockContent.rich_text || [])}</p>`;
      case 'heading_1':
        return `<h1>${extractText(blockContent.rich_text || [])}</h1>`;
      case 'heading_2':
        return `<h2>${extractText(blockContent.rich_text || [])}</h2>`;
      case 'heading_3':
        return `<h3>${extractText(blockContent.rich_text || [])}</h3>`;
      case 'bulleted_list_item':
        return `<li>${extractText(blockContent.rich_text || [])}</li>`;
      case 'numbered_list_item':
        return `<li>${extractText(blockContent.rich_text || [])}</li>`;
      case 'quote':
        return `<blockquote>${extractText(blockContent.rich_text || [])}</blockquote>`;
      case 'code':
        const language = blockContent.language || 'text';
        return `<pre><code class="language-${language}">${extractText(blockContent.rich_text || [])}</code></pre>`;
      case 'image':
        const imageUrl = blockContent.type === 'external' 
          ? blockContent.external?.url 
          : blockContent.file?.url;
        if (!imageUrl) return '';
        return `<figure><img src="${imageUrl}" alt="Blog image" loading="lazy"><figcaption>${extractText(blockContent.caption || [])}</figcaption></figure>`;
      case 'divider':
        return '<hr />';
      case 'callout':
        return `<div class="callout">${extractText(blockContent.rich_text || [])}</div>`;
      case 'toggle':
        return `<details><summary>${extractText(blockContent.rich_text || [])}</summary></details>`;
      case 'bookmark':
        return `<a href="${blockContent.url}" target="_blank" rel="noopener noreferrer">${blockContent.url}</a>`;
      case 'video':
        if (blockContent.type === 'external' && blockContent.external?.url) {
          return `<iframe src="${blockContent.external.url}" width="100%" height="400" allow="autoplay"></iframe>`;
        }
        return '';
      case 'table':
        return '<table><tr><td>Table content</td></tr></table>';
      default:
        return '';
    }
  } catch (error) {
    console.error(`Error converting block to HTML:`, error.message);
    return '';
  }
};

const getBlocksContent = async (pageId) => {
  try {
    const response = await notion.blocks.children.list({ 
      block_id: pageId,
      page_size: 100
    });
    
    let htmlContent = '';
    if (response.results && Array.isArray(response.results)) {
      for (const block of response.results) {
        htmlContent += blockToHtml(block);
      }
    }
    return htmlContent;
  } catch (error) {
    console.error(`Error fetching blocks for page ${pageId}:`, error.message);
    return '';
  }
};

const formatBlogPost = async (page) => {
  if (!page || !page.properties) {
    return null;
  }

  const properties = page.properties;

  const title = getPropertyValue(properties, 'Title');
  const slug = getPropertyValue(properties, 'Slug');
  const status = getPropertyValue(properties, 'Status');
  const createdAt = getPropertyValue(properties, 'Created At');
  const category = getPropertyValue(properties, 'Category');
  const tags = getPropertyValue(properties, 'Tags') || [];
  const metaDescription = getPropertyValue(properties, 'Meta Description');
  const coverImage = getPropertyValue(properties, 'Cover') || null;

  // Get content from blocks
  const content = await getBlocksContent(page.id);

  // Create snippet from first 200 chars of content or use meta description
  const stripHtml = (html) => html.replace(/<[^>]*>/g, '');
  const contentSnippet = stripHtml(content).substring(0, 200);

  return {
    id: page.id,
    title: title || 'Untitled',
    slug: slug || (title ? title.toLowerCase().replace(/\s+/g, '-') : 'untitled'),
    status: status || 'Draft',
    coverImage: coverImage,
    pubDate: createdAt,
    pubDateFormatted: formatDate(createdAt),
    created: createdAt,
    createdFormatted: formatDate(createdAt),
    category: category || '',
    tags: Array.isArray(tags) ? tags : [],
    contentSnippet: metaDescription || contentSnippet,
    content: content,
    creator: 'Author',
    link: `/blog/${slug || 'untitled'}`,
    medium: 'notion',
  };
};

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'Blog API Server is running',
    status: 'healthy',
    endpoints: ['/blogs', '/blog/:slug'],
    timestamp: new Date().toISOString(),
  });
});

// Get all published blogs
app.get('/blogs', async (req, res) => {
  try {
    console.log('📡 Fetching blogs from Notion database...');

    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: 'Status',
        status: {
          equals: 'Published',
        },
      },
      sorts: [
        {
          property: 'Created At',
          direction: 'descending',
        },
      ],
    });

    console.log(`✅ Found ${response.results.length} published blogs`);

    const blogs = [];
    for (const page of response.results) {
      const blog = await formatBlogPost(page);
      if (blog) {
        blogs.push(blog);
      }
    }

    console.log(`✅ Successfully formatted ${blogs.length} blogs`);

    res.json(blogs);
  } catch (error) {
    console.error('❌ Error fetching blogs:', error.message);
    res.status(500).json({
      error: 'Failed to fetch blogs',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

// Get single blog by slug
app.get('/blog/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        and: [
          {
            property: 'Status',
            status: {
              equals: 'Published',
            },
          },
          {
            property: 'Slug',
            rich_text: {
              equals: slug,
            },
          },
        ],
      },
    });

    if (!response.results || response.results.length === 0) {
      return res.status(404).json({
        error: 'Blog post not found',
      });
    }

    const blog = await formatBlogPost(response.results[0]);

    res.json(blog);
  } catch (error) {
    console.error('❌ Error fetching blog:', error.message);
    res.status(500).json({
      error: 'Failed to fetch blog',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📖 Blog API ready: GET http://localhost:${PORT}/blogs`);
});
