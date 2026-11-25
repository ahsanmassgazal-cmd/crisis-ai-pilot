import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const routes = [
  { name: "landing", path: "/en" },
  { name: "demo", path: "/en/app" },
  { name: "login", path: "/en/login" }
];

const outDir = path.join(process.cwd(), "audit", "lighthouse");
fs.mkdirSync(outDir, { recursive: true });

const results = {};

for (const r of routes) {
  const url = `http://127.0.0.1:3033${r.path}`;
  const jsonPath = path.join(outDir, `${r.name}.json`);
  console.log(`Running mobile Lighthouse on ${r.name} (${url})...`);
  try {
    execSync(
      `npx lighthouse "${url}" --output=json --output-path="${jsonPath}" --chrome-flags="--headless --no-sandbox" --form-factor=mobile --screenEmulation.mobile=true --only-categories=performance,accessibility,best-practices,seo --quiet`,
      { stdio: "inherit" }
    );
    const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    results[r.name] = {
      performance: Math.round((data.categories.performance?.score || 0) * 100),
      accessibility: Math.round((data.categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((data.categories["best-practices"]?.score || 0) * 100),
      seo: Math.round((data.categories.seo?.score || 0) * 100),
    };
  } catch (err) {
    console.error(`Error running lighthouse for ${r.name}:`, err.message);
  }
}

fs.writeFileSync(path.join(outDir, "summary.json"), JSON.stringify(results, null, 2));
console.log("Lighthouse Results Summary:", JSON.stringify(results, null, 2));
