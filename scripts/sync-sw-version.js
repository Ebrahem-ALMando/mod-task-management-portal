/**
 * Sync Service Worker Version Script
 * 
 * This script reads CACHE_VERSION from src/lib/pwa/sw.constants.ts
 * and updates it in public/sw.js to ensure they stay in sync.
 * 
 * Run this script before building or when updating the version.
 */

const fs = require('fs');
const path = require('path');

// Paths
const constantsPath = path.join(__dirname, '../src/lib/pwa/sw.constants.ts');
const swPath = path.join(__dirname, '../public/sw.js');

try {
  // Read sw.constants.ts
  const constantsContent = fs.readFileSync(constantsPath, 'utf8');
  
  // Extract CACHE_VERSION using regex
  const versionMatch = constantsContent.match(/export const CACHE_VERSION = ['"](.+)['"]/);
  
  if (!versionMatch) {
    throw new Error('Could not find CACHE_VERSION in sw.constants.ts');
  }
  
  const version = versionMatch[1];
  console.log(` Found CACHE_VERSION: ${version}`);
  
  // Read sw.js
  let swContent = fs.readFileSync(swPath, 'utf8');
  
  // Replace CACHE_VERSION in sw.js
  const updatedSwContent = swContent.replace(
    /const CACHE_VERSION = ['"].+['"]/,
    `const CACHE_VERSION = '${version}'`
  );
  
  // Check if version was actually updated
  if (swContent === updatedSwContent) {
    console.log(' sw.js already has the correct version');
    return;
  }
  
  // Write updated sw.js
  fs.writeFileSync(swPath, updatedSwContent, 'utf8');
  console.log(` Updated sw.js with CACHE_VERSION: ${version}`);
  
} catch (error) {
  console.error(' Error syncing Service Worker version:', error.message);
  process.exit(1);
}

