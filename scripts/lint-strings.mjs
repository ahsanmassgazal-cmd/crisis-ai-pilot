import fs from "fs";
import path from "path";

const SCAN_DIRS = ["app", "components"];

const ALLOWED_TOKENS = new Set([
  "Crisis AI Pilot",
  "SigmaMax",
  "Omantel",
  "Ooredoo",
  "Sohar",
  "Muscat",
  "Salalah",
  "Nizwa",
  "Duqm",
  "Al-Batinah",
  "Al-Khaburah",
  "Oman",
  "SMS",
  "Teams",
  "Email",
  "JSON",
  "CSV",
  "XLSX",
  "PDF",
  "DWG",
  "PCAP",
  "DOCX",
  "CAD",
  "SCADA",
  "VLAN",
  "BIA",
  "RTO",
  "RPO",
  "MTPD",
  "ISO 22301",
  "NCEMA",
  "SHA-256",
  "API",
  "HTTP",
  "HMAC",
  "IMAP",
  "SFTP",
  "S3",
  "GCS",
  "Gemini",
  "Pro",
  "Flash",
  "IVR",
  "DCS",
  "RO",
  "WAN",
  "TCP",
  "P1",
  "P2",
  "P3",
  "P4",
  "SEV1",
  "SEV2",
  "SEV3",
  "SEV4",
  "EN",
  "AR",
  "GST",
  "UTC",
  "PWA",
  "GPS",
  "URL",
  "ID",
  "E.164",
  "DKIM",
  "SPF",
  "SMTP",
  "Omantel Telecom",
  "Ooredoo Backup",
  "Microsoft Teams",
  "Microsoft Graph",
  "WhatsApp",
  "Google Drive",
  "OneDrive",
  "Splunk",
  "Sentinel",
  "PAUSE",
  "AI Copilot",
  "UTF-8 BOM",
  "Tier 1",
  "Tier 2",
  "Tier 3",
  "v1.0",
  "v2.0",
  "v2.1",
  "v3.0",
  "v3.1",
  "v3.2",
  "v4.0"
]);

// Helper to test if a string is exempt
function isExempt(str) {
  const trimmed = str.trim();
  if (!trimmed) return true;

  // Pure symbols / punctuation / single chars / icons
  if (/^[\s\d\-+*/.,:;!?()\[\]{}|<>=_#•→←✕✓&%@"'`~$^–—★☆✨·]+$/.test(trimmed)) {
    return true;
  }

  // Already Arabic
  if (/[\u0600-\u06FF]/.test(trimmed)) {
    return true;
  }

  // Pure numbers, currencies, percentages, time durations, latencies, hex strings
  if (/^([-+]?[$€£]?\s*[\d,.]+\s*(%|ms|s|m|h|d|hrs|mins|MB|KB|GB|B|k|kv|bar)?|[-+]?\d+[mhd]\s*\d+[smhd]|([0-9A-F]{2}\s+)+[0-9A-F]{2})$/i.test(trimmed)) {
    return true;
  }

  // Date and Time formats and offsets (e.g. 10:14 AM, 2026-11-24, T+0m, T+60m (1h), etc.)
  if (/^(T\+\d+m(\s*\(\d+[hm]\))?|\d{1,2}:\d{2}(\s*(AM|PM|GST))?|\d{4}-\d{2}-\d{2}(\s+\d{2}:\d{2}(\s*GST)?)?)$/i.test(trimmed)) {
    return true;
  }

  // ID and Code patterns (e.g. INC-2026-001, CP-DESAL-04, SEV1_COMM_..., RULE-01, etc.)
  if (/^(INC|RULE|TPL|DOC|UPD|APP|DLV|HIST|DEC|Q|CP|task|site|usr|grp|f|int|SEV\d+)[-_A-Za-z0-9]+$/i.test(trimmed)) {
    return true;
  }

  // Ranges of codes (e.g. SEV1-SEV4, P90–100, P60–89, P0–59)
  if (/^(SEV\d+[-–]SEV\d+|P\d+[-–]\d+)$/i.test(trimmed)) {
    return true;
  }

  // Phone numbers
  if (/^\+?\d[\d\s\-()]{6,}\d$/.test(trimmed)) {
    return true;
  }

  // Coordinates (e.g. 24.364°N, 56.7468°E)
  if (/^\d+(\.\d+)?°[NSEW],\s*\d+(\.\d+)?°[NSEW]$/i.test(trimmed)) {
    return true;
  }

  // Variable templates like {{site_name}}
  if (/^\{\{\w+\}\}$/.test(trimmed)) {
    return true;
  }

  // Check exact allowed proper nouns / brand tokens
  if (ALLOWED_TOKENS.has(trimmed)) {
    return true;
  }

  // Internal machine identifiers (e.g. status/type codes)
  if (/^[a-z0-9_]+$/.test(trimmed) && trimmed.length < 15) {
    return true;
  }

  return false;
}

let violations = [];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    // Skip comments, imports, exports, style definitions
    if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) return;
    if (trimmed.startsWith("import ") || trimmed.startsWith("export type") || trimmed.startsWith("interface ")) return;

    // 1. Check string props: title="...", label="...", placeholder="...", aria-label="...", alt="..."
    const propRegex = /\b(title|label|placeholder|aria-label|alt)=["']([^"']+)["']/g;
    let propMatch;
    while ((propMatch = propRegex.exec(line)) !== null) {
      const propName = propMatch[1];
      const val = propMatch[2];
      if (!isExempt(val)) {
        violations.push({
          file: filePath,
          line: index + 1,
          type: `prop:${propName}`,
          text: val,
        });
      }
    }

    // 2. Check JSX text between tags: >Some Text<
    const jsxTextRegex = />([^<>{}\n]+)</g;
    let textMatch;
    while ((textMatch = jsxTextRegex.exec(line)) !== null) {
      const textVal = textMatch[1].trim();
      if (textVal && !isExempt(textVal)) {
        violations.push({
          file: filePath,
          line: index + 1,
          type: "jsx-text",
          text: textVal,
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
    } else if (entry.name.endsWith(".tsx")) {
      scanFile(fullPath);
    }
  }
}

for (const dir of SCAN_DIRS) {
  traverse(path.resolve(process.cwd(), dir));
}

if (violations.length > 0) {
  console.error(`\n[LINT STRINGS ERROR] Found ${violations.length} hard-coded literal UI strings in app/ or components/:`);
  violations.forEach((v) => {
    console.error(`  ${v.file}:${v.line} [${v.type}] -> "${v.text}"`);
  });
  if (violations.length > 50) {
    console.error(`  ... and ${violations.length - 50} more violations.`);
  }
  console.error(`\nAll UI strings must use t() translation keys in messages/en.json and messages/ar.json!\n`);
  process.exit(1);
} else {
  console.log("\n[LINT STRINGS PASSED] All UI strings are properly localized.\n");
  process.exit(0);
}
