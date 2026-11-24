import { describe, it, expect } from "vitest";
import { evaluateEscalation } from "@/lib/engine/escalation";
import { DexieCrisisRepo } from "@/lib/repo/mock/dexie";
import { Delivery } from "@/lib/repo/types";

describe("Group H: Notification Escalation Ladder (Spec 1.5)", () => {
  it("advances escalation to Tier 2 when delivery is unacknowledged past SLA", async () => {
    const repo = new DexieCrisisRepo();

    const initialDelivery: Delivery = await repo.deliveries.create({
      id: "deliv-esc-test",
      message_id: "msg-1",
      person_id: "usr-001",
      channel: "sms",
      provider: "sms_a",
      idempotency_key: "esc-key-test",
      state: "delivered",
      attempts: 1,
      sent_at: "2026-11-24T06:00:00Z",
      simulated: true,
    });

    const result = await evaluateEscalation(repo, initialDelivery.id, 5);

    expect(result.escalated).toBe(true);
    expect(result.tier).toBe(2);
    expect(result.newDelivery).toBeDefined();

    // Check audit trail recorded escalation
    const auditRows = await repo.audit.getAll();
    const escAudit = auditRows.find((a) => a.action === "ESCALATION_LADDER_TIER_2_TRIGGERED");
    expect(escAudit).toBeDefined();
  });

  it("does not escalate if delivery has already been acknowledged", async () => {
    const repo = new DexieCrisisRepo();

    const ackedDelivery: Delivery = await repo.deliveries.create({
      id: "deliv-acked-test",
      message_id: "msg-1",
      person_id: "usr-001",
      channel: "sms",
      provider: "sms_a",
      idempotency_key: "esc-acked-key",
      state: "acknowledged",
      attempts: 1,
      sent_at: "2026-11-24T06:00:00Z",
      acked_at: "2026-11-24T06:02:00Z",
      simulated: true,
    });

    const result = await evaluateEscalation(repo, ackedDelivery.id, 5);
    expect(result.escalated).toBe(false);
  });
});
