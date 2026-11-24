import { describe, it, expect } from "vitest";
import { generateIdempotencyKey, JobQueueWorker } from "@/lib/engine/jobs";
import { DexieCrisisRepo } from "@/lib/repo/mock/dexie";
import { Message, Person } from "@/lib/repo/types";

describe("Group C: Delivery Idempotency & Deduplication (Spec 1.2)", () => {
  it("generates consistent deterministic idempotency keys", async () => {
    const key1 = await generateIdempotencyKey("inc-1", "usr-1", "sms", 1);
    const key2 = await generateIdempotencyKey("inc-1", "usr-1", "sms", 1);
    expect(key1).toBe(key2);
    expect(key1).toHaveLength(64);
  });

  it("changes key when version or channel is updated", async () => {
    const keyV1 = await generateIdempotencyKey("inc-1", "usr-1", "sms", 1);
    const keyV2 = await generateIdempotencyKey("inc-1", "usr-1", "sms", 2);
    const keyEmail = await generateIdempotencyKey("inc-1", "usr-1", "email", 1);

    expect(keyV1).not.toBe(keyV2);
    expect(keyV1).not.toBe(keyEmail);
  });

  it("deduplicates double-clicking Send and returns existing delivery", async () => {
    const repo = new DexieCrisisRepo();
    const worker = new JobQueueWorker();

    const sampleMsg: Message = {
      id: "msg-test-idem",
      incident_id: "inc-2026-001",
      audience_json: {},
      subject_en: "Evacuation Alert",
      subject_ar: "أمر إخلاء",
      body_en: "Evacuate Section 4",
      body_ar: "إخلاء القطاع 4",
      status: "approved",
      ai_generated: false,
      translation_reviewed: true,
      version: 1,
    };

    const samplePerson: Person = {
      id: "usr-idem-1",
      tenant_id: "gulf_water",
      employee_code: "EMP-9999",
      name_en: "Test Responder",
      name_ar: "مستجيب اختبار",
      department: "Operations",
      site_id: "site-sohar",
      title: "Lead",
      email: "test@example.om",
      phone_e164: "+968 0000 9999",
      channel_pref: ["sms"],
      language_pref: "en",
      on_call: true,
      reachability_score: 95,
      verified_channels: ["sms"],
    };

    // First send
    const res1 = await worker.enqueueDelivery(repo, {
      incidentId: "inc-2026-001",
      message: sampleMsg,
      person: samplePerson,
      channel: "sms",
    });
    expect(res1.deduplicated).toBe(false);
    expect(res1.delivery).toBeDefined();

    // Duplicate double-click send
    const res2 = await worker.enqueueDelivery(repo, {
      incidentId: "inc-2026-001",
      message: sampleMsg,
      person: samplePerson,
      channel: "sms",
    });
    expect(res2.deduplicated).toBe(true);
    expect(res2.delivery.id).toBe(res1.delivery.id);
  });
});
