import { describe, it, expect } from "vitest";
import { JobQueueWorker } from "@/lib/engine/jobs";
import { DexieCrisisRepo } from "@/lib/repo/mock/dexie";
import { Delivery } from "@/lib/repo/types";

describe("Group D: Delivery Retry Backoff (Spec 1.2)", () => {
  it("transitions retrying delivery to failed dead state after 3 failed attempts", async () => {
    const repo = new DexieCrisisRepo();
    const worker = new JobQueueWorker();

    // Create a delivery at attempt 3 in retrying state
    const deliv: Delivery = await repo.deliveries.create({
      id: "deliv-retry-test",
      message_id: "msg-1",
      person_id: "usr-001",
      channel: "sms",
      provider: "sms_a",
      idempotency_key: "retry-test-key",
      state: "retrying",
      attempts: 3,
      sent_at: new Date().toISOString(),
      simulated: true,
    });

    // Run retry cycle
    await worker.processRetryQueue(repo);

    const updated = (await repo.deliveries.getAll()).find((d) => d.id === deliv.id);
    expect(updated?.state).toBe("failed");
    expect(updated?.last_error).toContain("dead state");
  });
});
