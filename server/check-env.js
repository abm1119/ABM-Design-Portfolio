import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('\n📋 Blog System Configuration Check\n');
console.log('=====================================\n');

const checks = [
  {
    name: 'NOTION_API_KEY',
    value: process.env.NOTION_API_KEY,
    required: true
  },
  {
    name: 'NOTION_DATABASE_ID',
    value: process.env.NOTION_DATABASE_ID,
    required: true
  },
  {
    name: 'NODE_ENV',
    value: process.env.NODE_ENV || 'production',
    required: false
  }
];

let allValid = true;

checks.forEach(check => {
  const isSet = !!check.value;
  const status = isSet ? '✅' : (check.required ? '❌' : '⚠️');
  const message = isSet 
    ? `Set (${check.value.substring(0, 20)}${check.value.length > 20 ? '...' : ''})` 
    : 'Not set';
  
  console.log(`${status} ${check.name}: ${message}`);
  
  if (check.required && !isSet) {
    allValid = false;
  }
});

console.log('\n=====================================\n');

if (allValid) {
  console.log('✅ All required configuration is present!\n');
  console.log('You can start the server with: npm run server\n');
} else {
  console.log('❌ Missing required configuration!\n');
  console.log('Please create a server/.env file with:\n');
  console.log('NOTION_API_KEY=your_api_key');
  console.log('NOTION_DATABASE_ID=your_database_id\n');
  console.log('See BLOG_SETUP.md for detailed instructions.\n');
  process.exit(1);
}
