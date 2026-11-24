import { describe, it, expect } from "vitest";
import { DexieCrisisRepo } from "@/lib/repo/mock/dexie";

describe("Documents Repository: Upload, Versioning, and Restore Flow", () => {
  it("creates new document, updates version, and restores previous version with audit log", async () => {
    const repo = new DexieCrisisRepo();

    // 1. Upload initial document (v1.0)
    const doc = await repo.documents.create({
      tenant_id: "gulf_water",
      title_en: "Emergency Containment SOP.pdf",
      title_ar: "إجراءات احتواء الطوارئ القياسية.pdf",
      category: "sop",
      version: "1.0",
      updated_at: new Date().toISOString(),
      file_size_kb: 1450,
      mime_type: "application/pdf",
    });

    expect(doc.id).toBeDefined();
    expect(doc.version).toBe("1.0");

    // 2. Audit record for upload
    const uploadAudit = await repo.audit.append({
      tenant_id: "gulf_water",
      actor_id: "usr-001",
      actor_role: "commander",
      action: "DOCUMENT_UPLOADED",
      entity: "document",
      entity_id: doc.id,
      after_json: { title: doc.title_en, sizeKb: doc.file_size_kb },
      reason: "Uploaded document SOP",
      ip_hint: "10.200.4.1",
      created_at: new Date().toISOString(),
    });
    expect(uploadAudit.hash).toBeDefined();

    // 3. Update to v1.1
    const updated = await repo.documents.update(doc.id, {
      version: "1.1",
      updated_at: new Date().toISOString(),
    });
    expect(updated.version).toBe("1.1");

    // 4. Restore to v1.0
    const restored = await repo.documents.update(doc.id, {
      version: "1.0",
      updated_at: new Date().toISOString(),
    });
    expect(restored.version).toBe("1.0");

    // 5. Audit record for restore
    const restoreAudit = await repo.audit.append({
      tenant_id: "gulf_water",
      actor_id: "usr-001",
      actor_role: "commander",
      action: "DOCUMENT_RESTORED",
      entity: "document",
      entity_id: doc.id,
      after_json: { version: "1.0" },
      reason: "Restored document version v1.0",
      ip_hint: "10.200.4.1",
      created_at: new Date().toISOString(),
    });
    expect(restoreAudit.action).toBe("DOCUMENT_RESTORED");
    expect(restoreAudit.entity_id).toBe(doc.id);
  });
});
