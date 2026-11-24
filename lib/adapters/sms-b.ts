import { ChannelAdapter, SendPayload, AdapterResult } from "./types";

export class SmsFailoverAdapter implements ChannelAdapter {
  channel = "sms";
  provider = "sms_b";

  async send(payload: SendPayload): Promise<AdapterResult> {
    return {
      success: true,
      provider: "sms_b",
      failedOver: true,
      latencyMs: 250,
    };
  }
}

export const smsFailoverAdapter = new SmsFailoverAdapter();
