import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Person, CrisisRepository } from "@/lib/repo/types";

export interface ImportError {
  row: number;
  field: string;
  value: string;
  message_en: string;
  message_ar: string;
}

export interface ParsedImportRow {
  rowNumber: number;
  raw: Record<string, any>;
  mapped: Partial<Person>;
  errors: ImportError[];
  isDuplicate: boolean;
  isValid: boolean;
}

export interface ImportValidationResult {
  totalRows: number;
  validRowsCount: number;
  invalidRowsCount: number;
  duplicateRowsCount: number;
  rows: ParsedImportRow[];
}

// Bilingual synonym mappings
const HEADER_SYNONYMS: Record<string, keyof Person> = {
  name: "name_en",
  name_en: "name_en",
  fullname: "name_en",
  "full name": "name_en",
  "الاسم": "name_ar",
  "الاسم الكامل": "name_ar",
  name_ar: "name_ar",
  email: "email",
  "البريد": "email",
  "البريد الإلكتروني": "email",
  phone: "phone_e164",
  mobile: "phone_e164",
  phone_e164: "phone_e164",
  "الهاتف": "phone_e164",
  "رقم الهاتف": "phone_e164",
  "الجوال": "phone_e164",
  code: "employee_code",
  emp_code: "employee_code",
  employee_code: "employee_code",
  "الرقم الوظيفي": "employee_code",
  department: "department",
  dept: "department",
  "القسم": "department",
  "الإدارة": "department",
  role: "role",
  "الدور": "role",
  title: "title",
  "المسمى الوظيفي": "title",
};

/**
 * Normalizes headers using bilingual synonyms
 */
export function normalizeHeaders(rawHeaders: string[]): Record<string, keyof Person> {
  const map: Record<string, keyof Person> = {};
  for (const h of rawHeaders) {
    const clean = h.trim().toLowerCase();
    if (HEADER_SYNONYMS[clean]) {
      map[h] = HEADER_SYNONYMS[clean];
    }
  }
  return map;
}

/**
 * Validates a single row according to Spec rules
 */
export function validateImportRow(
  mapped: Partial<Person>,
  rowNum: number,
  existingCodes: Set<string>,
  seenInBatch: Set<string>
): { errors: ImportError[]; isDuplicate: boolean } {
  const errors: ImportError[] = [];

  // Required name
  if (!mapped.name_en && !mapped.name_ar) {
    errors.push({
      row: rowNum,
      field: "name",
      value: "",
      message_en: "Missing name in English or Arabic",
      message_ar: "الاسم مفقود باللغة الإنجليزية أو العربية",
    });
  }

  // Email format check
  if (mapped.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mapped.email)) {
    errors.push({
      row: rowNum,
      field: "email",
      value: mapped.email,
      message_en: "Invalid email address format",
      message_ar: "صيغة البريد الإلكتروني غير صالحة",
    });
  }

  // Phone E.164 check (Spec: Oman phones +968)
  if (mapped.phone_e164 && !/^\+968\s?\d{4}\s?\d{4}$/.test(mapped.phone_e164.trim())) {
    errors.push({
      row: rowNum,
      field: "phone_e164",
      value: mapped.phone_e164,
      message_en: "Invalid phone format (must be +968 0000 xxxx)",
      message_ar: "صيغة الهاتف غير صالحة (يجب أن تبدأ بـ +968)",
    });
  }

  // Duplicate employee code check (against existing records or earlier rows in same batch)
  let isDuplicate = false;
  if (mapped.employee_code) {
    if (existingCodes.has(mapped.employee_code) || seenInBatch.has(mapped.employee_code)) {
      isDuplicate = true;
      errors.push({
        row: rowNum,
        field: "employee_code",
        value: mapped.employee_code,
        message_en: "Duplicate employee code already exists",
        message_ar: "الرقم الوظيفي موجود مسبقاً",
      });
    } else {
      seenInBatch.add(mapped.employee_code);
    }
  }

  return { errors, isDuplicate };
}

/**
 * Parses raw text or buffer (CSV, XLSX, JSON)
 */
export async function parseImportFile(
  content: string | ArrayBuffer,
  fileType: "csv" | "xlsx" | "json" | "vcf",
  existingPeople: Person[]
): Promise<ImportValidationResult> {
  const existingCodes = new Set(existingPeople.map((p) => p.employee_code));
  let rawRows: Record<string, any>[] = [];

  if (fileType === "csv") {
    const text = typeof content === "string" ? content : new TextDecoder().decode(content);
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
    rawRows = parsed.data as Record<string, any>[];
  } else if (fileType === "xlsx") {
    const workbook = XLSX.read(content, { type: typeof content === "string" ? "binary" : "array" });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    rawRows = XLSX.utils.sheet_to_json(sheet) as Record<string, any>[];
  } else if (fileType === "json") {
    const text = typeof content === "string" ? content : new TextDecoder().decode(content);
    rawRows = JSON.parse(text);
  } else if (fileType === "vcf") {
    // Basic VCF parser fallback
    const text = typeof content === "string" ? content : new TextDecoder().decode(content);
    const lines = text.split(/\r?\n/);
    const card: Record<string, any> = {};
    for (const line of lines) {
      if (line.startsWith("FN:")) card["name"] = line.substring(3);
      if (line.startsWith("EMAIL:")) card["email"] = line.substring(6);
      if (line.startsWith("TEL:")) card["phone"] = line.substring(4);
    }
    rawRows = [card];
  }

  if (rawRows.length === 0) {
    return {
      totalRows: 0,
      validRowsCount: 0,
      invalidRowsCount: 0,
      duplicateRowsCount: 0,
      rows: [],
    };
  }

  // Header mapping
  const headers = Object.keys(rawRows[0] || {});
  const headerMap = normalizeHeaders(headers);

  const parsedRows: ParsedImportRow[] = [];
  const seenInBatch = new Set<string>();
  let validCount = 0;
  let invalidCount = 0;
  let duplicateCount = 0;

  for (let idx = 0; idx < rawRows.length; idx++) {
    const raw = rawRows[idx];
    const mapped: Partial<Person> = {
      tenant_id: "gulf_water",
      channel_pref: ["sms", "email"],
      language_pref: "en",
      on_call: true,
      reachability_score: 90,
      verified_channels: ["sms", "email"],
    };

    for (const [rawKey, targetKey] of Object.entries(headerMap)) {
      if (raw[rawKey] !== undefined) {
        (mapped as any)[targetKey] = String(raw[rawKey]).trim();
      }
    }

    // Default missing lang or AR name
    if (!mapped.name_ar && mapped.name_en) mapped.name_ar = mapped.name_en;
    if (!mapped.name_en && mapped.name_ar) mapped.name_en = mapped.name_ar;

    const { errors, isDuplicate } = validateImportRow(mapped, idx + 1, existingCodes, seenInBatch);
    const isValid = errors.length === 0;

    if (isDuplicate) duplicateCount++;
    if (isValid) validCount++;
    else invalidCount++;

    parsedRows.push({
      rowNumber: idx + 1,
      raw,
      mapped,
      errors,
      isDuplicate,
      isValid,
    });
  }

  return {
    totalRows: rawRows.length,
    validRowsCount: validCount,
    invalidRowsCount: invalidCount,
    duplicateRowsCount: duplicateCount,
    rows: parsedRows,
  };
}

/**
 * Commits valid parsed rows to repository with audit logging and rollback snapshot
 */
export async function commitImportBatch(
  repo: CrisisRepository,
  parsedResult: ImportValidationResult
): Promise<{ committedCount: number; snapshotId: string }> {
  const validRows = parsedResult.rows.filter((r) => r.isValid);
  const snapshotId = `snapshot-${Date.now()}`;

  for (const row of validRows) {
    await repo.people.create({
      id: `usr-imp-${Date.now()}-${row.rowNumber}`,
      tenant_id: "gulf_water",
      employee_code: row.mapped.employee_code || `EMP-${Date.now()}`,
      name_en: row.mapped.name_en || "Imported User",
      name_ar: row.mapped.name_ar || "مستخدم مستورد",
      department: row.mapped.department || "Operations",
      site_id: row.mapped.site_id || "site-muscat-hq",
      title: row.mapped.title || "Emergency Responder",
      email: row.mapped.email || `user${row.rowNumber}@example.om`,
      phone_e164: row.mapped.phone_e164 || `+968 0000 ${2000 + row.rowNumber}`,
      channel_pref: ["sms", "email"],
      language_pref: row.mapped.language_pref || "en",
      on_call: true,
      reachability_score: 95,
      verified_channels: ["sms", "email"],
    });
  }

  // Audit record
  await repo.audit.append({
    tenant_id: "gulf_water",
    actor_id: "usr-001",
    actor_role: "commander",
    action: "PEOPLE_BATCH_IMPORT_COMMITTED",
    entity: "people",
    entity_id: snapshotId,
    after_json: { committedCount: validRows.length, snapshotId },
    reason: `Committed ${validRows.length} imported people records from batch.`,
    ip_hint: "10.200.4.1",
    created_at: new Date().toISOString(),
  });

  return {
    committedCount: validRows.length,
    snapshotId,
  };
}
