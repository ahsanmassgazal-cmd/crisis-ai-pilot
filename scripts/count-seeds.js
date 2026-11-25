const fs = require('fs');
const content = fs.readFileSync('seed/expanded.ts', 'utf8');

function countId(exportName) {
  const start = content.indexOf('export const ' + exportName);
  if (start === -1) return -1;
  const nextExport = content.indexOf('export const ', start + 1);
  const block = nextExport !== -1 ? content.slice(start, nextExport) : content.slice(start);
  const m = block.match(/id:\s*["'][^"']+["']/g);
  return m ? m.length : 0;
}

const names = [
  'EXPANDED_SITES',
  'EXPANDED_PEOPLE',
  'EXPANDED_PLANS',
  'EXPANDED_INCIDENTS',
  'EXPANDED_TASKS',
  'EXPANDED_CRITICAL_FUNCTIONS',
  'EXPANDED_RISKS',
  'EXPANDED_DRILLS',
  'EXPANDED_DOCUMENTS',
  'EXPANDED_DELIVERIES',
  'EXPANDED_AUDIT_ROWS'
];

for (const name of names) {
  console.log(name, countId(name));
}
