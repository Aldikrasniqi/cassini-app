#!/usr/bin/env node

/**
 * Mapbox Token Validator
 * Tests if your Mapbox access token is valid and working
 *
 * Usage: node test-mapbox.js
 */

const https = require('https');

// Load .env.local file manually
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
let token = '';

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=(.+)/);
  if (match && match[1]) {
    token = match[1].trim();
  }
} catch (error) {
  console.error('❌ Error reading .env.local:', error.message);
  process.exit(1);
}

console.log('\n🔍 Mapbox Token Validator\n');
console.log('━'.repeat(50));

// Validate token format
console.log('\n1️⃣  Checking token format...');
if (!token) {
  console.error('   ❌ Token is empty or missing');
  console.error('   💡 Add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to .env.local');
  process.exit(1);
}

if (!token.startsWith('pk.')) {
  console.error('   ❌ Token has invalid format (should start with "pk.")');
  console.error('   💡 Get a valid token from: https://account.mapbox.com/access-tokens/');
  process.exit(1);
}

console.log('   ✅ Token format is valid');
console.log(`   📋 Token: ${token.substring(0, 20)}...`);

// Test API connectivity
console.log('\n2️⃣  Testing Mapbox API connectivity...');
const testUrl = `https://api.mapbox.com/styles/v1/mapbox/dark-v11?access_token=${token}`;

https.get(testUrl, (res) => {
  console.log(`   📡 HTTP Status: ${res.statusCode} ${res.statusMessage}`);

  if (res.statusCode === 200) {
    console.log('   ✅ API connection successful!');
    console.log('   ✅ Token is valid and working');
    console.log('\n━'.repeat(50));
    console.log('✅ All checks passed! Your Mapbox setup is correct.\n');
    console.log('If the map still doesn\'t load, check:');
    console.log('  1. Browser console for errors (F12)');
    console.log('  2. Network tab for blocked requests');
    console.log('  3. Disable browser extensions (ad blockers)');
    console.log('  4. Try incognito/private mode');
    console.log('  5. Restart your dev server (npm run dev)\n');
  } else if (res.statusCode === 401) {
    console.error('   ❌ Unauthorized (401)');
    console.error('   💡 Token is invalid or expired');
    console.error('   💡 Get a new token: https://account.mapbox.com/access-tokens/');
  } else if (res.statusCode === 403) {
    console.error('   ❌ Forbidden (403)');
    console.error('   💡 Token may have URL restrictions');
    console.error('   💡 Check token settings: https://account.mapbox.com/access-tokens/');
  } else if (res.statusCode === 429) {
    console.error('   ⚠️  Rate limited (429)');
    console.error('   💡 Wait 60 seconds and try again');
  } else {
    console.error(`   ❌ Unexpected status: ${res.statusCode}`);
  }

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.log('\n   📄 Response body:', data.substring(0, 200));
    }
  });
}).on('error', (error) => {
  console.error('   ❌ Network error:', error.message);
  console.error('   💡 Check your internet connection');
  console.error('   💡 Check if api.mapbox.com is accessible');
  process.exit(1);
});

console.log('   ⏳ Waiting for response...');
