import fs from "fs";
import path from "path";

const enPath = path.resolve(process.cwd(), "messages/en.json");
const arPath = path.resolve(process.cwd(), "messages/ar.json");

if (!fs.existsSync(enPath) || !fs.existsSync(arPath)) {
  console.error("Missing messages/en.json or messages/ar.json");
  process.exit(1);
}

const en = JSON.parse(fs.readFileSync(enPath, "utf-8"));
const ar = JSON.parse(fs.readFileSync(arPath, "utf-8"));

const WHITELIST = new Set([
  "Crisis AI Pilot",
  "SigmaMax AI Solutions",
  "SigmaMax",
  "SMS",
  "Teams",
  "Microsoft Teams",
  "Email",
  "WhatsApp",
  "PWA",
  "PDF",
  "CSV",
  "DOCX",
  "JSON",
  "RTO",
  "RPO",
  "MTPD",
  "SEV1",
  "SEV2",
  "SEV3",
  "SEV4",
  "P1",
  "P2",
  "P3",
  "P4",
  "SHA-256",
  "EN",
  "AR",
  "Auto",
  "Manual",
]);

let missingInAr = [];
let missingInEn = [];
let identicalValues = [];

function checkObject(enObj, arObj, prefix = "") {
  for (const key of Object.keys(enObj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (!(key in arObj)) {
      missingInAr.push(fullKey);
      continue;
    }

    if (typeof enObj[key] === "object" && enObj[key] !== null) {
      if (typeof arObj[key] === "object" && arObj[key] !== null) {
        checkObject(enObj[key], arObj[key], fullKey);
      } else {
        missingInAr.push(fullKey);
      }
    } else {
      const enVal = String(enObj[key]).trim();
      const arVal = String(arObj[key]).trim();
      if (enVal === arVal && !WHITELIST.has(enVal) && enVal.length > 2) {
        identicalValues.push({ key: fullKey, value: enVal });
      }
    }
  }

  for (const key of Object.keys(arObj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (!(key in enObj)) {
      missingInEn.push(fullKey);
    }
  }
}

checkObject(en, ar);

let hasError = false;
if (missingInAr.length > 0) {
  hasError = true;
  console.error(`\x1b[31m[I18N ERROR] ${missingInAr.length} keys missing in messages/ar.json:\x1b[0m`);
  missingInAr.forEach((k) => console.error(`  - ${k}`));
}

if (missingInEn.length > 0) {
  hasError = true;
  console.error(`\x1b[31m[I18N ERROR] ${missingInEn.length} keys missing in messages/en.json:\x1b[0m`);
  missingInEn.forEach((k) => console.error(`  - ${k}`));
}

if (identicalValues.length > 0) {
  console.warn(`\x1b[33m[I18N WARNING] ${identicalValues.length} strings in ar.json are identical to en.json (untranslated?):\x1b[0m`);
  identicalValues.slice(0, 10).forEach((item) => console.warn(`  - ${item.key}: "${item.value}"`));
  if (identicalValues.length > 10) console.warn(`  ...and ${identicalValues.length - 10} more`);
}

if (hasError) {
  process.exit(1);
} else {
  console.log("\x1b[32m[I18N CHECK PASSED] Translation catalogs are fully synchronized.\x1b[0m");
  process.exit(0);
}
