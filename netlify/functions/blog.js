// Netlify Function for fetching a single blog post by slug
import { Client } from '@notionhq/client';

// Get environment variables with fallbacks
const NOTION_API_KEY = process.env.NOTION_API_KEY || 'ntn_f92503707891vwW3OMbIXBEWQB7aGHAsDv67u0EXOYM0vk';
const DATABASE_ID = process.env.NOTION_DATABASE_ID || '2a52275d74e581a8bddfe2634ee7f58d';

// Initialize Notion client
const notion = new Client({
  auth: NOTION_API_KEY,
});

// Helper function to format blog post with content
const formatBlogPost = async (page) => {
  try {
    const properties = page.properties;
    
    // Extract properties safely
    const title = properties.Title?.title?.[0]?.plain_text || 'Untitled';
    const slug = properties.Slug?.rich_text?.[0]?.plain_text || '';
    const excerpt = properties.Excerpt?.rich_text?.[0]?.plain_text || '';
    const status = properties.Status?.status?.name || 'Draft';
    const createdAt = properties['Created At']?.created_time || page.created_time;
    const tags = properties.Tags?.multi_select?.map(tag => tag.name) || [];
    
    // Get cover image
    let coverImage = null;
    if (page.cover) {
      if (page.cover.type === 'external') {
        coverImage = page.cover.external.url;
      } else if (page.cover.type === 'file') {
        coverImage = page.cover.file.url;
      }
    }

    // Get page content (blocks)
    let content = '';
    try {
      const blocks = await notion.blocks.children.list({
        block_id: page.id,
      });

      content = blocks.results.map(block => {
        if (block.type === 'paragraph' && block.paragraph.rich_text) {
          return block.paragraph.rich_text.map(text => text.plain_text).join('');
        }
        if (block.type === 'heading_1' && block.heading_1.rich_text) {
          return '# ' + block.heading_1.rich_text.map(text => text.plain_text).join('');
        }
        if (block.type === 'heading_2' && block.heading_2.rich_text) {
          return '## ' + block.heading_2.rich_text.map(text => text.plain_text).join('');
        }
        if (block.type === 'heading_3' && block.heading_3.rich_text) {
          return '### ' + block.heading_3.rich_text.map(text => text.plain_text).join('');
        }
        return '';
      }).filter(text => text.length > 0).join('\n\n');
    } catch (error) {
      console.error('Error fetching page content:', error);
      content = excerpt || 'Content not available';
    }

    return {
      id: page.id,
      title,
      slug,
      excerpt,
      content,
      status,
      createdAt,
      tags,
      coverImage,
      url: `/blog/${slug}`,
    };
  } catch (error) {
    console.error('Error formatting blog post:', error);
    return null;
  }
};

export const handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Extract slug from path
    const slug = event.path.split('/').pop();
    
    if (!slug) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Slug is required' }),
      };
    }

    // Validate environment variables
    if (!NOTION_API_KEY || !DATABASE_ID) {
      throw new Error('Missing required environment variables');
    }

    console.log(`📡 Fetching blog post with slug: ${slug}`);

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
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          error: 'Blog post not found',
        }),
      };
    }

    const blog = await formatBlogPost(response.results[0]);

    if (!blog) {
      throw new Error('Failed to format blog post');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(blog),
    };

  } catch (error) {
    console.error('❌ Error fetching blog:', error.message);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch blog',
        message: error.message,
      }),
    };
  }
};
