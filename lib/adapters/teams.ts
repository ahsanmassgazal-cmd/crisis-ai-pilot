import { ChannelAdapter, SendPayload, AdapterResult } from "./types";
import { useAppStore } from "@/lib/store/useAppStore";

export class TeamsAdapter implements ChannelAdapter {
  channel = "teams";
  provider = "ms_teams_graph";

  async send(payload: SendPayload): Promise<AdapterResult> {
    const { failures } = useAppStore.getState();

    if (failures.teamsError) {
      return {
        success: false,
        provider: "ms_teams_graph",
        error: "Microsoft Graph Tenant Webhook 429 RateLimitExceeded",
      };
    }

    return {
      success: true,
      provider: "ms_teams_graph",
      latencyMs: 180,
    };
  }
}

export const teamsAdapter = new TeamsAdapter();
