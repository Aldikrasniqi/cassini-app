#!/usr/bin/env node

const { execSync } = require('child_process');
const os = require('os');

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();

console.log('🚀 Starting Next.js PWA for mobile testing...');
console.log(`📱 Access from mobile: http://${localIP}:3000`);
console.log('📋 Make sure your mobile device is on the same network');
console.log('');

// Start Next.js development server
try {
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to start development server:', error.message);
  process.exit(1);
}
