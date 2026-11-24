import { ChannelAdapter, SendPayload, AdapterResult } from "./types";
import { useAppStore } from "@/lib/store/useAppStore";

export class EmailAdapter implements ChannelAdapter {
  channel = "email";
  provider = "smtp_relay";

  async send(payload: SendPayload): Promise<AdapterResult> {
    const { failures } = useAppStore.getState();

    return {
      success: true,
      provider: "smtp_relay",
      latencyMs: failures.emailDelayed ? 120000 : 350,
    };
  }
}

export const emailAdapter = new EmailAdapter();
