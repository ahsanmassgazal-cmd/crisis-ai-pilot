import { describe, it, expect } from "vitest";
import {
  sha256,
  computeAuditRowHash,
  verifyAuditChain,
  tamperAuditRow,
  GENESIS_HASH,
} from "@/lib/engine/audit";
import { AuditRow } from "@/lib/repo/types";

describe("Group B: Cryptographic Audit Hash Chain (Spec 15)", () => {
  it("computes deterministic SHA-256 digest", async () => {
    const hash = await sha256("test-message");
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("verifies a valid linear cryptographic hash chain", async () => {
    const rows: AuditRow[] = [];
    let prev = GENESIS_HASH;

    for (let seq = 1; seq <= 5; seq++) {
      const payload = {
        seq,
        prev_hash: prev,
        created_at: `2026-11-24T06:0${seq}:00Z`,
        actor_id: "usr-001",
        action: `ACTION_${seq}`,
        entity: "incident",
        entity_id: "inc-1",
        after_json: { seq },
      };
      const hash = await computeAuditRowHash(payload);
      rows.push({
        ...payload,
        id: `audit-${seq}`,
        tenant_id: "gulf_water",
        actor_role: "commander",
        ip_hint: "10.200.4.1",
        hash,
      });
      prev = hash;
    }

    const verification = await verifyAuditChain(rows);
    expect(verification.valid).toBe(true);
    expect(verification.count).toBe(5);
  });

  it("detects data tampering / bit-flip and flags the exact broken row index", async () => {
    const rows: AuditRow[] = [];
    let prev = GENESIS_HASH;

    for (let seq = 1; seq <= 6; seq++) {
      const payload = {
        seq,
        prev_hash: prev,
        created_at: `2026-11-24T06:0${seq}:00Z`,
        actor_id: "usr-001",
        action: `ACTION_${seq}`,
        entity: "incident",
        entity_id: "inc-1",
        after_json: { seq },
      };
      const hash = await computeAuditRowHash(payload);
      rows.push({
        ...payload,
        id: `audit-${seq}`,
        tenant_id: "gulf_water",
        actor_role: "commander",
        ip_hint: "10.200.4.1",
        hash,
      });
      prev = hash;
    }

    // Tamper row seq 3
    const tampered = tamperAuditRow(rows, 3);
    const verification = await verifyAuditChain(tampered);

    expect(verification.valid).toBe(false);
    expect(verification.brokenAt).toBe(2); // 0-indexed index 2 is seq 3
    expect(verification.errorReason).toContain("Bit-flip / data tampering detected at seq 3");
  });
});
