export interface AdapterResult {
  success: boolean;
  provider: string;
  failedOver?: boolean;
  error?: string;
  latencyMs?: number;
}

export interface SendPayload {
  recipientId: string;
  recipientContact: string;
  body: string;
  subject?: string;
}

export interface ChannelAdapter {
  channel: string;
  send(payload: SendPayload): Promise<AdapterResult>;
}
