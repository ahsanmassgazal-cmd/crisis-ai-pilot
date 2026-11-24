import { describe, it, expect } from "vitest";
import JSZip from "jszip";
import Papa from "papaparse";
import {
  exportToCsv,
  exportToXlsx,
  exportToJson,
  exportToIcs,
  exportToDocxXml,
  generateEvidenceZip,
} from "@/lib/engine/export";
import { DexieCrisisRepo } from "@/lib/repo/mock/dexie";
import { sha256 } from "@/lib/engine/audit";

describe("Group J: Real Export & Cryptographic Evidence ZIP (Spec 1.9)", () => {
  it("prepends UTF-8 BOM to CSV exports for Arabic compatibility", () => {
    const data = [{ name: "م. طارق البوسعيدي", role: "Commander" }];
    const csv = exportToCsv(data);

    expect(csv.charCodeAt(0)).toBe(0xfeff); // UTF-8 BOM
    expect(csv).toContain("م. طارق البوسعيدي");
  });

  it("performs complete CSV round-trip parsing back to object", () => {
    const original = [
      { id: "1", title: "SCADA Alert", severity: "P1", site: "صحار" },
      { id: "2", title: "Power Trip", severity: "P2", site: "مسقط" },
    ];
    const csv = exportToCsv(original);
    // Strip BOM for Papa.parse
    const parsed = Papa.parse(csv.replace(/^\uFEFF/, ""), { header: true }).data;
    expect(parsed).toEqual(original);
  });

  it("exports valid JSON with pretty-print formatting", () => {
    const data = { incident: "INC-2026-001", status: "contained", score: 92 };
    const jsonStr = exportToJson(data);
    expect(jsonStr).toContain('"incident": "INC-2026-001"');
    expect(JSON.parse(jsonStr)).toEqual(data);
  });

  it("exports RFC-5545 compliant ICS calendar event", () => {
    const ics = exportToIcs({
      title: "SCADA Emergency Drill",
      description: "National infrastructure failover drill",
      start: new Date("2026-04-10T09:00:00Z"),
      end: new Date("2026-04-10T11:00:00Z"),
      location: "Sohar Plant Assembly Hall",
    });

    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("SUMMARY:SCADA Emergency Drill");
    expect(ics).toContain("DTSTART:20260410T090000Z");
    expect(ics).toContain("DTEND:20260410T110000Z");
    expect(ics).toContain("LOCATION:Sohar Plant Assembly Hall");
    expect(ics).toContain("END:VCALENDAR");
  });

  it("exports valid DOCX OpenXML document structure", () => {
    const docxXml = exportToDocxXml({
      title: "Executive Incident Summary",
      sections: [
        { heading: "Root Cause", body: "SCADA sensor variance triggered automated alert." },
        { heading: "Containment", body: "All responders accounted for in 41 seconds." },
      ],
    });

    expect(docxXml).toContain('xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"');
    expect(docxXml).toContain("<w:t>Executive Incident Summary</w:t>");
    expect(docxXml).toContain("<w:t>Root Cause</w:t>");
    expect(docxXml).toContain("<w:t>Containment</w:t>");
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
