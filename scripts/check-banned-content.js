const fs = require('fs');
const path = require('path');

const BANNED_PATTERNS = [
  /\+968\s*7694\s*1459/,
  /\bSri\s*Lanka\b/i,
  /\bSupabase\b/i,
  /\bPBKDF2\b/i,
  /\bport\s*8787\b/i,
  /\bHTTP\s*401\b/i
];

const SCAN_DIRS = ['app', 'components', 'lib', 'messages', 'seed'];
let issues = [];

function scan(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (item.name !== 'node_modules' && item.name !== '.next') {
        scan(full);
      }
    } else if (/\.(tsx|ts|js|mjs|json|css|md)$/.test(item.name)) {
      const content = fs.readFileSync(full, 'utf8');
      BANNED_PATTERNS.forEach((regex) => {
        if (regex.test(content)) {
          issues.push({ file: full, pattern: regex.toString() });
        }
      });
    }
  }
}

for (const d of SCAN_DIRS) {
  if (fs.existsSync(d)) scan(d);
}

if (issues.length > 0) {
  console.error('BANNED CONTENT FOUND:', issues);
  process.exit(1);
} else {
  console.log('ALL BANNED CONTENT CHECKS PASSED: 0 violations found across all source directories.');
}
