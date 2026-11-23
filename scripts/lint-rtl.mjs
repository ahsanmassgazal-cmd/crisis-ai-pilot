import fs from "fs";
import path from "path";

const BANNED_PATTERNS = [
  /\bml-\S+/,
  /\bmr-\S+/,
  /\bpl-\S+/,
  /\bpr-\S+/,
  /\bleft-\S+/,
  /\bright-\S+/,
  /\btext-left\b/,
  /\btext-right\b/,
  /\bborder-l\b/,
  /\bborder-l-\S+/,
  /\bborder-r\b/,
  /\bborder-r-\S+/,
  /\brounded-l\b/,
  /\brounded-l-\S+/,
  /\brounded-r\b/,
  /\brounded-r-\S+/,
];

const SCAN_DIRS = ["app", "components", "lib"];
let violations = [];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    // Ignore comments or CSS variables definition
    if (line.trim().startsWith("//") || line.trim().startsWith("/*")) return;

    for (const pattern of BANNED_PATTERNS) {
      const match = line.match(pattern);
      if (match) {
        violations.push({
          file: filePath,
          line: index + 1,
          matched: match[0],
          text: line.trim(),
        });
      }
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
  console.error(`\x1b[31m[LINT RTL ERROR] Found ${violations.length} banned physical CSS class usages:\x1b[0m`);
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line} -> "${v.matched}" in: ${v.text}`);
  }
  console.error("\x1b[33mUse logical Tailwind classes: ms-, me-, ps-, pe-, start-, end-, text-start, text-end, border-s, border-e, rounded-s, rounded-e\x1b[0m\n");
  process.exit(1);
} else {
  console.log("\x1b[32m[LINT RTL PASSED] 0 physical classes found across codebase.\x1b[0m");
  process.exit(0);
}
