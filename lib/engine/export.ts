import Papa from "papaparse";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { CrisisRepository, Incident } from "@/lib/repo/types";
import { sha256 } from "./audit";

/**
 * Spec 1.9: Real Export Engine
 * Generates CSV (with UTF-8 BOM \uFEFF for Arabic Excel support), XLSX, JSON,
 * and an Evidence ZIP containing complete incident audit ledger, deliveries,
 * chain verification, and a manifest.json with SHA-256 hashes of every file.
 */

export function exportToCsv(data: Record<string, any>[]): string {
  const csv = Papa.unparse(data);
  // Prepend UTF-8 BOM \uFEFF so Excel displays Arabic characters properly
  return "\uFEFF" + csv;
}

export function exportToXlsx(data: Record<string, any>[], sheetName = "Export"): ArrayBuffer {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  return XLSX.write(workbook, { bookType: "xlsx", type: "array" });
}

export function exportToJson(data: any): string {
  return JSON.stringify(data, null, 2);
}

export interface EvidenceZipResult {
  zipBlob: Blob | Buffer;
  manifest: Record<string, string>;
  totalFiles: number;
}

export async function generateEvidenceZip(
  repo: CrisisRepository,
  incidentId: string
): Promise<EvidenceZipResult> {
  const zip = new JSZip();

  const incident = (await repo.incidents.getById(incidentId)) || (await repo.incidents.getAll())[0];
  const auditRows = await repo.audit.getAll();
  const deliveries = await repo.deliveries.getAll();
  const chainVerification = await repo.audit.verifyChain();

  // File 1: incident_summary.json
  const summaryContent = exportToJson({
    incident,
    generatedAt: new Date().toISOString(),
    organization: "Gulf Water & Power Co.",
    classification: "Confidential - Official Incident Evidence Pack",
  });
  const summaryHash = await sha256(summaryContent);
  zip.file("incident_summary.json", summaryContent);

  // File 2: audit_ledger.csv
  const auditCsv = exportToCsv(auditRows);
  const auditHash = await sha256(auditCsv);
  zip.file("audit_ledger.csv", auditCsv);

  // File 3: deliveries_report.csv
  const delivCsv = exportToCsv(deliveries);
  const delivHash = await sha256(delivCsv);
  zip.file("deliveries_report.csv", delivCsv);

  // File 4: chain_verification.json
  const verifContent = exportToJson({
    verificationResult: chainVerification,
    verifiedAt: new Date().toISOString(),
    algorithm: "SHA-256",
  });
  const verifHash = await sha256(verifContent);
  zip.file("chain_verification.json", verifContent);

  // File 5: manifest.json with SHA-256 checksums
  const manifest = {
    "incident_summary.json": summaryHash,
    "audit_ledger.csv": auditHash,
    "deliveries_report.csv": delivHash,
    "chain_verification.json": verifHash,
  };
  const manifestContent = exportToJson({
    generatedAt: new Date().toISOString(),
    files: manifest,
  });
  zip.file("manifest.json", manifestContent);

  let zipOutput: any;
  if (typeof window !== "undefined") {
    zipOutput = await zip.generateAsync({ type: "blob" });
  } else {
    zipOutput = await zip.generateAsync({ type: "nodebuffer" });
  }

  return {
    zipBlob: zipOutput,
    manifest,
    totalFiles: 5,
  };
}
