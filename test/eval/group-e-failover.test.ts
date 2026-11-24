import { describe, it, expect, beforeEach } from "vitest";
import { dispatchNotification } from "@/lib/adapters";
import { useAppStore } from "@/lib/store/useAppStore";

describe("Group E: Channel Provider Failover (Spec 1.3)", () => {
  beforeEach(() => {
    useAppStore.getState().resetFailures();
  });

  it("dispatches SMS through primary route (sms_a) under normal conditions", async () => {
    const result = await dispatchNotification("sms", {
      recipientId: "usr-001",
      recipientContact: "+968 0000 1001",
      body: "Test Normal SMS",
    });

    expect(result.success).toBe(true);
    expect(result.provider).toBe("sms_a");
    expect(result.failedOver).toBeFalsy();
  });

  it("fails over SMS A -> SMS B when Presenter breaks SMS A", async () => {
    useAppStore.getState().setFailure("smsABroken", true);

    const result = await dispatchNotification("sms", {
      recipientId: "usr-001",
      recipientContact: "+968 0000 1001",
      body: "Test Failover SMS",
    });

    expect(result.success).toBe(true);
    expect(result.provider).toBe("sms_b");
    expect(result.failedOver).toBe(true);
  });
});
