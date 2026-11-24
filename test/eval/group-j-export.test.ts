import { describe, it, expect } from "vitest";
import JSZip from "jszip";
import { exportToCsv, exportToXlsx, generateEvidenceZip } from "@/lib/engine/export";
import { DexieCrisisRepo } from "@/lib/repo/mock/dexie";
import { sha256 } from "@/lib/engine/audit";

describe("Group J: Real Export & Cryptographic Evidence ZIP (Spec 1.9)", () => {
  it("prepends UTF-8 BOM to CSV exports for Arabic compatibility", () => {
    const data = [{ name: "م. طارق البوسعيدي", role: "Commander" }];
    const csv = exportToCsv(data);

    expect(csv.charCodeAt(0)).toBe(0xfeff); // UTF-8 BOM
    expect(csv).toContain("م. طارق البوسعيدي");
  });

  it("generates XLSX binary buffer", () => {
    const data = [{ id: 1, name: "Test" }];
    const buffer = exportToXlsx(data);
    expect(buffer.byteLength).toBeGreaterThan(0);
  });

  it("builds Evidence ZIP with manifest.json verifying every bundled file's SHA-256", async () => {
    const repo = new DexieCrisisRepo();
    const evidence = await generateEvidenceZip(repo, "inc-2026-001");

    expect(evidence.totalFiles).toBe(5);
    expect(evidence.manifest["incident_summary.json"]).toBeDefined();
    expect(evidence.manifest["audit_ledger.csv"]).toBeDefined();
    expect(evidence.manifest["deliveries_report.csv"]).toBeDefined();
    expect(evidence.manifest["chain_verification.json"]).toBeDefined();

    // Verify unzipped content hashes match manifest
    const unzipped = await JSZip.loadAsync(evidence.zipBlob as any);
    for (const [filename, expectedHash] of Object.entries(evidence.manifest)) {
      const file = unzipped.file(filename);
      expect(file).toBeDefined();
      const content = await file!.async("string");
      const computed = await sha256(content);
      expect(computed).toBe(expectedHash);
    }
  });
});
