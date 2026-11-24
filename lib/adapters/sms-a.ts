import { ChannelAdapter, SendPayload, AdapterResult } from "./types";
import { useAppStore } from "@/lib/store/useAppStore";

export class SmsPrimaryAdapter implements ChannelAdapter {
  channel = "sms";
  provider = "sms_a";

  async send(payload: SendPayload): Promise<AdapterResult> {
    const { failures } = useAppStore.getState();

    // Check if SMS A is broken by Presenter
    if (failures.smsABroken) {
      return {
        success: false,
        provider: "sms_a",
        error: "OmanTel SMPP Gateway 503 Provider Unavailable",
      };
    }

    return {
      success: true,
      provider: "sms_a",
      latencyMs: 120,
    };
  }
}

export const smsPrimaryAdapter = new SmsPrimaryAdapter();
