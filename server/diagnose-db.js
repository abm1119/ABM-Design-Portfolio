import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config({ path: './server/.env' });

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

console.log('🔍 Diagnosing Notion Database...\n');

async function diagnose() {
  try {
    // Get database info
    console.log('1️⃣  Getting database schema...');
    const database = await notion.databases.retrieve({
      database_id: DATABASE_ID,
    });

    console.log('\n📋 Database Properties Found:\n');
    
    const properties = database.properties;
    Object.entries(properties).forEach(([key, prop]) => {
      console.log(`   • "${key}"`);
      console.log(`     Type: ${prop.type}`);
      if (prop.type === 'select' && prop.select?.options) {
        console.log(`     Options: ${prop.select.options.map(o => o.name).join(', ')}`);
      }
      if (prop.type === 'multi_select' && prop.multi_select?.options) {
        console.log(`     Options: ${prop.multi_select.options.map(o => o.name).join(', ')}`);
      }
      console.log();
    });

    // Get first page to see data
    console.log('2️⃣  Checking database contents...');
    const pages = await notion.databases.query({
      database_id: DATABASE_ID,
      page_size: 1,
    });

    console.log(`   Found ${pages.results.length} page(s) in database\n`);

    if (pages.results.length > 0) {
      const page = pages.results[0];
      console.log('3️⃣  Sample Page Properties:\n');
      
      Object.entries(page.properties).forEach(([key, prop]) => {
        console.log(`   "${key}" (${prop.type}):`);
        
        switch (prop.type) {
          case 'title':
            console.log(`     Value: "${prop.title.map(t => t.plain_text).join('')}"`);
            break;
          case 'rich_text':
            console.log(`     Value: "${prop.rich_text.map(t => t.plain_text).join('')}"`);
            break;
          case 'select':
            console.log(`     Value: ${prop.select ? `"${prop.select.name}"` : 'empty'}`);
            break;
          case 'multi_select':
            console.log(`     Value: ${prop.multi_select.length > 0 ? prop.multi_select.map(s => `"${s.name}"`).join(', ') : 'empty'}`);
            break;
          case 'date':
            console.log(`     Value: ${prop.date ? prop.date.start : 'empty'}`);
            break;
          case 'files':
            console.log(`     Value: ${prop.files.length} file(s)`);
            break;
          default:
            console.log(`     Value: [${prop.type} type]`);
        }
        console.log();
      });
    }

    console.log('✅ Diagnosis complete!\n');
    console.log('Update your server.js to match these property names and types.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nMake sure:');
    console.error('  1. NOTION_API_KEY is correct');
    console.error('  2. NOTION_DATABASE_ID is correct');
    console.error('  3. The integration has access to this database');
  }
}

diagnose();
