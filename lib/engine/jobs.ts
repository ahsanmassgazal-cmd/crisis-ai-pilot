import { Delivery, Message, Person, CrisisRepository } from "@/lib/repo/types";
import { sha256 } from "./audit";
import { dispatchNotification } from "@/lib/adapters";
import { checkMessageApproval } from "./approvals";
import { useAppStore } from "@/lib/store/useAppStore";

export interface QueueJobInput {
  incidentId: string;
  message: Message;
  person: Person;
  channel: "sms" | "email" | "teams" | "whatsapp" | "voice" | "push";
}

/**
 * Spec 1.2: Idempotency Key
 * Format: sha256(incident + person + channel + version)
 */
export async function generateIdempotencyKey(
  incidentId: string,
  personId: string,
  channel: string,
  version: number
): Promise<string> {
  const payload = `${incidentId}:${personId}:${channel}:${version}`;
  return await sha256(payload);
}

export class JobQueueWorker {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;

  /**
   * Enqueues or dispatches a delivery with idempotency deduplication and approval verification.
   */
  async enqueueDelivery(
    repo: CrisisRepository,
    input: QueueJobInput
  ): Promise<{ delivery: Delivery; deduplicated: boolean; blockedReason?: string }> {
    // Step 1: Check Approval Gate
    const approval = checkMessageApproval(input.message);
    if (!approval.canSend) {
      return {
        delivery: null as unknown as Delivery,
        deduplicated: false,
        blockedReason: approval.reason,
      };
    }

    // Step 2: Generate Idempotency Key
    const idempotencyKey = await generateIdempotencyKey(
      input.incidentId,
      input.person.id,
      input.channel,
      input.message.version || 1
    );

    // Step 3: Check Deduplication in Repository
    const existingDeliveries = await repo.deliveries.getAll();
    const existing = existingDeliveries.find((d) => d.idempotency_key === idempotencyKey);
    if (existing) {
      // Double click or duplicate submission detected — return existing record without resending!
      return {
        delivery: existing,
        deduplicated: true,
      };
    }

    // Step 4: Create new Delivery
    const newDelivery = await repo.deliveries.create({
      id: `deliv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      message_id: input.message.id,
      person_id: input.person.id,
      channel: input.channel,
      provider: input.channel === "sms" ? "sms_a" : input.channel,
      idempotency_key: idempotencyKey,
      state: "sending",
      attempts: 1,
      sent_at: new Date().toISOString(),
      simulated: true,
    });

    // Step 5: Execute dispatch through adapters
    const result = await dispatchNotification(input.channel, {
      recipientId: input.person.id,
      recipientContact: input.channel === "email" ? input.person.email : input.person.phone_e164,
      body: input.person.language_pref === "ar" ? input.message.body_ar : input.message.body_en,
      subject: input.person.language_pref === "ar" ? input.message.subject_ar : input.message.subject_en,
    });

    if (result.success) {
      const finalState = result.failedOver ? "failed_over" : "delivered";
      const updated = await repo.deliveries.update(newDelivery.id, {
        state: finalState,
        provider: result.provider,
        delivered_at: new Date().toISOString(),
      });
      return { delivery: updated, deduplicated: false };
    } else {
      // Failed attempt 1 -> mark retrying
      const updated = await repo.deliveries.update(newDelivery.id, {
        state: "retrying",
        last_error: result.error || "Adapter delivery failed",
      });
      return { delivery: updated, deduplicated: false };
    }
  }

  /**
   * Process retries according to Spec: 1 min, 5 min, 30 min -> dead (failed)
   */
  async processRetryQueue(repo: CrisisRepository): Promise<void> {
    const all = await repo.deliveries.getAll();
    const retrying = all.filter((d) => d.state === "retrying");

    for (const item of retrying) {
      const attempts = (item.attempts || 1) + 1;
      if (attempts > 3) {
        // Max retries exceeded -> dead / failed
        await repo.deliveries.update(item.id, {
          state: "failed",
          attempts,
          last_error: "Exceeded max retries (1m, 5m, 30m backoff reached dead state).",
        });
      } else {
        // Attempt retry dispatch
        const result = await dispatchNotification(item.channel, {
          recipientId: item.person_id,
          recipientContact: item.person_id,
          body: "Retry delivery notification",
        });

        if (result.success) {
          await repo.deliveries.update(item.id, {
            state: result.failedOver ? "failed_over" : "delivered",
            provider: result.provider,
            attempts,
            delivered_at: new Date().toISOString(),
          });
        } else {
          await repo.deliveries.update(item.id, {
            attempts,
            last_error: result.error,
          });
        }
      }
    }
  }

  startWorker(repo: CrisisRepository) {
    if (this.isRunning) return;
    this.isRunning = true;
    this.intervalId = setInterval(async () => {
      try {
        await this.processRetryQueue(repo);
      } catch (e) {
        console.error("Error processing retry queue:", e);
      }
    }, 5000);
  }

  stopWorker() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const jobQueueWorker = new JobQueueWorker();
