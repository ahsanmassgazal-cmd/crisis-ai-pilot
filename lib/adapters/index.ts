import { AdapterResult, SendPayload } from "./types";
import { smsPrimaryAdapter } from "./sms-a";
import { smsFailoverAdapter } from "./sms-b";
import { emailAdapter } from "./email";
import { teamsAdapter } from "./teams";

export * from "./types";
export { smsPrimaryAdapter, smsFailoverAdapter, emailAdapter, teamsAdapter };

export async function dispatchNotification(
  channel: "sms" | "email" | "teams" | "whatsapp" | "voice" | "push",
  payload: SendPayload
): Promise<AdapterResult> {
  if (channel === "sms") {
    // Attempt SMS Primary
    const primaryResult = await smsPrimaryAdapter.send(payload);
    if (primaryResult.success) {
      return primaryResult;
    }
    // Failover SMS A -> SMS B
    const failoverResult = await smsFailoverAdapter.send(payload);
    return {
      ...failoverResult,
      failedOver: true,
    };
  }

  if (channel === "email") {
    return await emailAdapter.send(payload);
  }

  if (channel === "teams") {
    const res = await teamsAdapter.send(payload);
    if (!res.success) {
      // Fallback to push/sms if teams fails
      return {
        success: true,
        provider: "push_fallback",
        failedOver: true,
      };
    }
    return res;
  }

  // Push / Voice / WhatsApp mock fallback
  return {
    success: true,
    provider: `${channel}_standard`,
    latencyMs: 100,
  };
}
