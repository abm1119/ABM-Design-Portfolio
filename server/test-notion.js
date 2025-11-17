import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config({ path: './server/.env' });

console.log('Testing Notion Client...\n');

// Test 1: Check if @notionhq/client is available
console.log('1. Checking @notionhq/client import...');
console.log('   ✓ @notionhq/client imported successfully\n');

// Test 2: Create client
console.log('2. Creating Notion client...');
try {
  const notion = new Client({
    auth: process.env.NOTION_API_KEY,
  });
  console.log('   ✓ Client created successfully');
  console.log('   Client type:', typeof notion);
  console.log('   Client keys:', Object.keys(notion).slice(0, 10));
  
  // Test 3: Check databases property
  console.log('\n3. Checking notion.databases...');
  if (notion.databases) {
    console.log('   ✓ notion.databases exists');
    console.log('   Type:', typeof notion.databases);
    console.log('   Methods:', Object.keys(notion.databases));
  } else {
    console.log('   ✗ notion.databases NOT found');
  }
  
} catch (error) {
  console.error('   ✗ Failed to create client:');
  console.error('   Error:', error.message);
  console.error('   Stack:', error.stack);
}
