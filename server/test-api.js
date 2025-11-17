#!/usr/bin/env node

/**
 * Blog API Test Utility
 * Tests the blog API endpoints to ensure everything is working
 */

import http from 'http';
import https from 'https';

const BASE_URL = 'http://localhost:3000';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(color, text) {
  console.log(`${color}${text}${colors.reset}`);
}

function request(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, body: data });
      });
    }).on('error', reject);
  });
}

async function test() {
  log(colors.cyan, '\n📋 Blog API Test Suite\n');
  log(colors.cyan, '='.repeat(50) + '\n');

  let passed = 0;
  let failed = 0;

  // Test 1: Health Check
  log(colors.blue, 'Test 1: Health Check');
  try {
    const res = await request(`${BASE_URL}/`);
    if (res.status === 200) {
      log(colors.green, `✅ PASS - Server is running (status ${res.status})\n`);
      passed++;
    } else {
      log(colors.red, `❌ FAIL - Unexpected status ${res.status}\n`);
      failed++;
    }
  } catch (err) {
    log(colors.red, `❌ FAIL - Cannot connect to server`);
    log(colors.yellow, `   Make sure the server is running: npm run server\n`);
    failed++;
  }

  // Test 2: Get Blogs
  log(colors.blue, 'Test 2: Get Blogs List');
  try {
    const res = await request(`${BASE_URL}/blogs`);
    if (res.status === 200) {
      const blogs = JSON.parse(res.body);
      log(colors.green, `✅ PASS - Got ${blogs.length} blog(s)`);
      if (Array.isArray(blogs) && blogs.length > 0) {
        log(colors.cyan, `   First blog: "${blogs[0].title}" (slug: ${blogs[0].slug})`);
      } else {
        log(colors.yellow, `   No published blogs yet. Create one in Notion!`);
      }
      log(colors.reset, '');
      passed++;
    } else if (res.status === 500) {
      log(colors.red, `❌ FAIL - Server error (status 500)`);
      try {
        const error = JSON.parse(res.body);
        log(colors.yellow, `   Error: ${error.message}`);
      } catch (e) {
        // Parse error
      }
      log(colors.reset, '');
      failed++;
    } else {
      log(colors.red, `❌ FAIL - Unexpected status ${res.status}\n`);
      failed++;
    }
  } catch (err) {
    log(colors.red, `❌ FAIL - ${err.message}\n`);
    failed++;
  }

  // Test 3: Get Single Blog
  log(colors.blue, 'Test 3: Get Single Blog (if any exist)');
  try {
    const listRes = await request(`${BASE_URL}/blogs`);
    if (listRes.status === 200) {
      const blogs = JSON.parse(listRes.body);
      if (blogs.length > 0) {
        const slug = blogs[0].slug;
        const blogRes = await request(`${BASE_URL}/blog/${slug}`);
        if (blogRes.status === 200) {
          const blog = JSON.parse(blogRes.body);
          log(colors.green, `✅ PASS - Retrieved blog: "${blog.title}"`);
          log(colors.cyan, `   Content: ${blog.content?.substring(0, 50)}...`);
          log(colors.reset, '');
          passed++;
        } else {
          log(colors.red, `❌ FAIL - Status ${blogRes.status}\n`);
          failed++;
        }
      } else {
        log(colors.yellow, `⊘ SKIP - No blogs available yet\n`);
      }
    }
  } catch (err) {
    log(colors.red, `❌ FAIL - ${err.message}\n`);
    failed++;
  }

  // Summary
  log(colors.cyan, '='.repeat(50));
  log(colors.bright, `\nTest Results: ${passed} passed, ${failed} failed\n`);

  if (failed === 0) {
    log(colors.green, '✅ All tests passed! Your blog system is working perfectly.\n');
  } else {
    log(colors.red, '❌ Some tests failed. See details above.\n');
  }
}

test().catch(err => {
  log(colors.red, `Fatal error: ${err.message}`);
  process.exit(1);
});
