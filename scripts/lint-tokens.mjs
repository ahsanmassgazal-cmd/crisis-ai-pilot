import fs from "fs";
import path from "path";

// Hex pattern (3, 4, 6, 8 hex digits)
const HEX_PATTERN = /#[0-9a-fA-F]{3,8}\b/;

const SCAN_DIRS = ["app", "components"];
let violations = [];

function scanFile(filePath) {
  // Exclude css files where tokens might be defined
  if (filePath.endsWith(".css")) return;

  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    // Ignore comments
    if (line.trim().startsWith("//") || line.trim().startsWith("/*")) return;

    const match = line.match(HEX_PATTERN);
    if (match) {
      violations.push({
        file: filePath,
        line: index + 1,
        matched: match[0],
        text: line.trim(),
      });
    }
  });
}

function traverse(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".next") {
        traverse(fullPath);
      }
    } else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      scanFile(fullPath);
    }
  }
}

for (const dir of SCAN_DIRS) {
  traverse(path.resolve(process.cwd(), dir));
}

if (violations.length > 0) {
  console.error(`\x1b[31m[LINT TOKENS ERROR] Found ${violations.length} raw hex color values in components/app:\x1b[0m`);
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line} -> "${v.matched}" in: ${v.text}`);
  }
  console.error("\x1b[33mAll colors must use design tokens (e.g. text-brand-600, bg-severity-critical-tint, etc.)!\x1b[0m\n");
  process.exit(1);
} else {
  console.log("\x1b[32m[LINT TOKENS PASSED] 0 raw hex values found in components/app.\x1b[0m");
  process.exit(0);
}
