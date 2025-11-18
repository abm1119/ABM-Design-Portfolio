// Netlify Function for fetching all blog posts
import { Client } from '@notionhq/client';

// Get environment variables with fallbacks
const NOTION_API_KEY = process.env.NOTION_API_KEY || 'ntn_f92503707891vwW3OMbIXBEWQB7aGHAsDv67u0EXOYM0vk';
const DATABASE_ID = process.env.NOTION_DATABASE_ID || '2a52275d74e581a8bddfe2634ee7f58d';

// Initialize Notion client
const notion = new Client({
  auth: NOTION_API_KEY,
});

// Helper function to format blog post
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

    return {
      id: page.id,
      title,
      slug,
      excerpt,
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
    // Validate environment variables
    if (!NOTION_API_KEY || !DATABASE_ID) {
      throw new Error('Missing required environment variables');
    }

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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(blogs),
    };

  } catch (error) {
    console.error('❌ Error fetching blogs:', error.message);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch blogs',
        message: error.message,
      }),
    };
  }
};
