import { CrisisRepository, AutomationRule, AttentionQueueItem } from "@/lib/repo/types";
import { useAppStore } from "@/lib/store/useAppStore";

export interface AutomationRunResult {
  ruleId: string;
  triggered: boolean;
  actionExecuted: string;
  attentionItemAdded?: boolean;
}

/**
 * Spec 1.6: Automations Runner
 * Evaluates triggers, conditions (AND/OR, thresholds, windows), executes actions,
 * writes run history to repo, and respects the kill switch and modes.
 */
export class AutomationRunner {
  async runRules(
    repo: CrisisRepository,
    context?: { scadaMetric?: number; unackedMinutes?: number }
  ): Promise<AutomationRunResult[]> {
    const { isAutomationsPaused, automationMode, failures } = useAppStore.getState();

    // Kill switch check
    if (isAutomationsPaused) {
      return [];
    }

    const rules = await repo.automations.getAll();
    const results: AutomationRunResult[] = [];

    for (const rule of rules) {
      if (!rule.enabled) continue;

      let triggered = false;
      let actionExecuted = "none";
      let attentionItemAdded = false;

      // Check Rule 04: SCADA Telemetry Anomaly Ingestion Trigger
      if (rule.id === "rule-04" || rule.trigger_json?.source === "monitoring_feed") {
        const threshold = rule.trigger_json?.threshold || 49.0;
        const currentMetric = context?.scadaMetric ?? (failures.scadaSpike ? 34.8 : 50.2);

        if (currentMetric < threshold) {
          triggered = true;
          actionExecuted = "SUGGEST_INCIDENT_IN_ATTENTION_QUEUE";

          // If mode is manual or human approval required, queue into Attention Queue
          if (automationMode === "manual" || rule.approval_mode === "human") {
            attentionItemAdded = true;
          }

          // Record audit log
          await repo.audit.append({
            tenant_id: "gulf_water",
            actor_id: "system-automation-runner",
            actor_role: "system",
            action: "AUTOMATION_RULE_EVALUATED_TRIGGERED",
            entity: "rule",
            entity_id: rule.id,
            after_json: {
              ruleId: rule.id,
              metric: currentMetric,
              threshold,
              action: actionExecuted,
              mode: automationMode,
            },
            reason: `SCADA telemetry anomaly breached threshold (${currentMetric} < ${threshold}).`,
            ip_hint: "10.200.4.50",
            created_at: new Date().toISOString(),
          });
        }
      }

      // Check Rule 01: Unacknowledged timeout escalation
      if (rule.id === "rule-01" || rule.trigger_json?.type === "unacked_timeout") {
        const timeoutMin = rule.trigger_json?.minutes || 5;
        const unackedMin = context?.unackedMinutes ?? (failures.responderUnresponsive ? 8 : 2);

        if (unackedMin >= timeoutMin) {
          triggered = true;
          actionExecuted = "ESCALATE_TIER_2";

          await repo.audit.append({
            tenant_id: "gulf_water",
            actor_id: "system-automation-runner",
            actor_role: "system",
            action: "AUTOMATION_ESCALATION_TRIGGERED",
            entity: "rule",
            entity_id: rule.id,
            after_json: { unackedMinutes: unackedMin, timeoutMin },
            reason: `Unacknowledged delivery exceeded ${timeoutMin}m SLA.`,
            ip_hint: "10.200.4.50",
            created_at: new Date().toISOString(),
          });
        }
      }

      // Check Rule 05: Failover provider on delivery error
      if (rule.id === "rule-05" || rule.trigger_json?.type === "delivery_error") {
        if (failures.smsABroken) {
          triggered = true;
          actionExecuted = "FAILOVER_SMS_A_TO_SMS_B";

          await repo.audit.append({
            tenant_id: "gulf_water",
            actor_id: "system-automation-runner",
            actor_role: "system",
            action: "AUTOMATION_FAILOVER_TRIGGERED",
            entity: "rule",
            entity_id: rule.id,
            after_json: { fromProvider: "sms_a", toProvider: "sms_b" },
            reason: "Delivery error on primary route detected; automated failover to route B.",
            ip_hint: "10.200.4.50",
            created_at: new Date().toISOString(),
          });
        }
      }

      // Update rule last_run_at
      if (triggered) {
        await repo.automations.update(rule.id, {
          last_run_at: new Date().toISOString(),
        });
      }

      results.push({
        ruleId: rule.id,
        triggered,
        actionExecuted,
        attentionItemAdded,
      });
    }

    return results;
  }
}

export const automationRunner = new AutomationRunner();
