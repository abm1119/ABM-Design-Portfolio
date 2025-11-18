// Test function to check environment variables
export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const envVars = {
      NOTION_API_KEY: process.env.NOTION_API_KEY ? 'SET' : 'NOT SET',
      NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'not set',
      // Show first few characters of actual values for debugging
      NOTION_API_KEY_PREVIEW: process.env.NOTION_API_KEY ? process.env.NOTION_API_KEY.substring(0, 10) + '...' : 'not found',
      NOTION_DATABASE_ID_PREVIEW: process.env.NOTION_DATABASE_ID ? process.env.NOTION_DATABASE_ID.substring(0, 10) + '...' : 'not found',
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Environment variables test',
        environment: envVars,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Test failed',
        message: error.message,
      }),
    };
  }
};
