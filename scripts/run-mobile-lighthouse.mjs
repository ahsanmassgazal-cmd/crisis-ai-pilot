import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const routes = [
  { name: "landing", url: "https://crisis-ai-pilot-o52nqftt6-ahsanmassgazal-cmd.vercel.app/en" },
  { name: "demo", url: "https://crisis-ai-pilot-o52nqftt6-ahsanmassgazal-cmd.vercel.app/en/app" },
  { name: "login", url: "https://crisis-ai-pilot-o52nqftt6-ahsanmassgazal-cmd.vercel.app/en/login" },
];

const headersFile = path.resolve("audit/headers.json");
const results = {};

for (const r of routes) {
  const outPath = path.resolve(`audit/lh-${r.name}.json`);
  console.log(`Auditing ${r.name} (${r.url})...`);
  try {
    execSync(
      `npx lighthouse "${r.url}" --form-factor=mobile --screenEmulation.mobile --only-categories=performance,accessibility,best-practices,seo --extra-headers="${headersFile}" --output=json --output-path="${outPath}" --chrome-flags="--headless=new --no-sandbox --disable-gpu" --quiet`,
      { stdio: "inherit" }
    );
    const data = JSON.parse(fs.readFileSync(outPath, "utf8")).categories;
    results[r.name] = {
      performance: Math.round(data.performance.score * 100),
      accessibility: Math.round(data.accessibility.score * 100),
      bestPractices: Math.round(data["best-practices"].score * 100),
      seo: Math.round(data.seo.score * 100),
    };
    console.log(`Finished ${r.name}:`, results[r.name]);
  } catch (err) {
    console.error(`Failed ${r.name}:`, err.message);
  }
}

console.log("\n=== FINAL LIGHTHOUSE MOBILE RESULTS ===");
console.table(results);
fs.writeFileSync("audit/lighthouse-summary.json", JSON.stringify(results, null, 2));
