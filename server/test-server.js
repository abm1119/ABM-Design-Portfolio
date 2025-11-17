import express from 'express';
import cors from 'cors';
import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config({ path: './server/.env' });

console.log('🧪 Testing server startup...\n');

const app = express();
const PORT = process.env.PORT || 3000;

// Check environment
console.log('✓ Checking environment variables...');
if (!process.env.NOTION_API_KEY) {
  console.error('✗ NOTION_API_KEY not set');
  process.exit(1);
}
if (!process.env.NOTION_DATABASE_ID) {
  console.error('✗ NOTION_DATABASE_ID not set');
  process.exit(1);
}
console.log('✓ All environment variables present\n');

// Initialize Notion client
console.log('✓ Initializing Notion client...');
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});
console.log('✓ Notion client ready\n');

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'Blog API Server is running',
    status: 'healthy',
    endpoints: ['/blogs', '/blog/:slug', '/test'],
    timestamp: new Date().toISOString(),
  });
});

// Test endpoint
app.get('/test', async (req, res) => {
  try {
    console.log('\n📡 Testing Notion API connection...');
    
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
    });
    
    console.log(`✅ Success! Found ${response.results.length} items in database`);
    
    res.json({
      success: true,
      message: 'Notion API connection successful',
      databaseId: DATABASE_ID,
      itemsFound: response.results.length,
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ Test server running at http://localhost:${PORT}`);
  console.log(`📍 Test endpoint: http://localhost:${PORT}/test\n`);
});

// Auto-shutdown after 10 seconds
setTimeout(() => {
  console.log('\n⏰ Test complete. Shutting down...');
  server.close();
  process.exit(0);
}, 10000);
