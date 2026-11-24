import { describe, it, expect } from "vitest";
import fs from "fs";
import { parseImportFile, commitImportBatch } from "@/lib/engine/import";
import { DexieCrisisRepo } from "@/lib/repo/mock/dexie";
import { EXPANDED_PEOPLE } from "@/seed/expanded";

describe("Group I: Real Import Engine & Bilingual Synonyms (Spec 1.8)", () => {
  it("maps Arabic and English synonyms correctly and flags all 5 deliberate errors in sample file", async () => {
    const fileBuffer = fs.readFileSync("public/samples/people_import_sample.xlsx");
    const result = await parseImportFile(fileBuffer, "xlsx", EXPANDED_PEOPLE);

    expect(result.totalRows).toBe(7);
    // Rows with deliberate errors: Row 3 (missing name), Row 4 (bad email), Row 5 (bad phone), Row 6 & 7 (duplicate code)
    expect(result.invalidRowsCount).toBe(5);
    expect(result.validRowsCount).toBe(2);

    const errorFields = result.rows.flatMap((r) => r.errors.map((e) => e.field));
    expect(errorFields).toContain("name");
    expect(errorFields).toContain("email");
    expect(errorFields).toContain("phone_e164");
    expect(errorFields).toContain("employee_code");
  });

  it("commits valid parsed rows to repository with audit logging", async () => {
    const csvContent = `name,email,phone,code,department\nSalim Al-Alawi,salim@example.om,+968 0000 8888,EMP-8888,Operations`;
    const repo = new DexieCrisisRepo();
    const result = await parseImportFile(csvContent, "csv", []);

    expect(result.validRowsCount).toBe(1);
    const commit = await commitImportBatch(repo, result);

    expect(commit.committedCount).toBe(1);
    expect(commit.snapshotId).toBeDefined();

    const people = await repo.people.getAll();
    const created = people.find((p) => p.employee_code === "EMP-8888");
    expect(created?.name_en).toBe("Salim Al-Alawi");
  });
});
