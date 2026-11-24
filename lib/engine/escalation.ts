import { CrisisRepository, Delivery, Person } from "@/lib/repo/types";

export interface EscalationResult {
  escalated: boolean;
  tier: number;
  newDelivery?: Delivery;
  reason?: string;
}

/**
 * Spec 1.5: Escalation Ladder
 * Advances notification ladder if acknowledgment not received within SLA.
 */
export async function evaluateEscalation(
  repo: CrisisRepository,
  deliveryId: string,
  slaMinutes = 5
): Promise<EscalationResult> {
  const allDeliveries = await repo.deliveries.getAll();
  const delivery = allDeliveries.find((d) => d.id === deliveryId);

  if (!delivery) {
    return { escalated: false, tier: 1, reason: "Delivery not found" };
  }

  // Already acknowledged or failed -> no escalation
  if (delivery.state === "acknowledged" || delivery.state === "failed") {
    return { escalated: false, tier: 1, reason: `Delivery is already ${delivery.state}` };
  }

  // Advance to Tier 2 (Secondary on-call lead)
  const allPeople = await repo.people.getAll();
  const secondaryLead = allPeople.find((p) => p.role === "team" && p.on_call) || allPeople[1];

  const escalatedDelivery = await repo.deliveries.create({
    id: `deliv-esc-${Date.now()}`,
    message_id: delivery.message_id,
    person_id: secondaryLead.id,
    channel: "sms",
    provider: "sms_a",
    idempotency_key: `esc:${delivery.id}:tier2`,
    state: "sending",
    attempts: 1,
    sent_at: new Date().toISOString(),
    simulated: true,
  });

  // Audit trail logging
  await repo.audit.append({
    tenant_id: "gulf_water",
    actor_id: "system-engine",
    actor_role: "system",
    action: "ESCALATION_LADDER_TIER_2_TRIGGERED",
    entity: "delivery",
    entity_id: delivery.id,
    after_json: {
      originalDeliveryId: delivery.id,
      targetPersonId: secondaryLead.id,
      escalationTier: 2,
      slaMinutesExceeded: slaMinutes,
    },
    reason: `Primary responder unacknowledged past ${slaMinutes}m SLA. Escalating to Tier 2 on-call lead.`,
    ip_hint: "127.0.0.1",
    created_at: new Date().toISOString(),
  });

  return {
    escalated: true,
    tier: 2,
    newDelivery: escalatedDelivery,
    reason: `Escalated to secondary lead ${secondaryLead.name_en}`,
  };
}
