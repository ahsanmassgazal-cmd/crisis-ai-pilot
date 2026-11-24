"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2, Zap, ArrowRight, ShieldCheck, Clock } from "lucide-react";

export interface AutomationRuleDraft {
  id?: string;
  name: string;
  description: string;
  triggerEvent: string;
  conditions: Array<{ field: string; operator: string; value: string }>;
  actions: Array<{ type: string; target: string; channel?: string }>;
  requiresApproval: boolean;
  cooldownMinutes: number;
  maxExecutionsPerHour: number;
}

export interface RuleBuilderProps {
  initialRule?: Partial<AutomationRuleDraft>;
  onSave?: (rule: AutomationRuleDraft) => void;
  onCancel?: () => void;
}

export function RuleBuilder({
  initialRule,
  onSave,
  onCancel
}: RuleBuilderProps) {
  const t = useTranslations("components");
  const [name, setName] = useState(initialRule?.name || "Auto-Escalate Sev1 Cyber Alert");
  const [description, setDescription] = useState(
    initialRule?.description || "When Sev1 cyber incident occurs, notify executive team within 3m and request commander sign-off"
  );
  const [triggerEvent, setTriggerEvent] = useState(initialRule?.triggerEvent || "incident.created");
  const [conditions, setConditions] = useState(
    initialRule?.conditions || [
      { field: "severity", operator: "equals", value: "critical" },
      { field: "category", operator: "equals", value: "cyber" }
    ]
  );
  const [actions, setActions] = useState(
    initialRule?.actions || [
      { type: "dispatch_notification", target: "Executive Crisis Committee", channel: "teams" },
      { type: "create_task", target: "Isolate affected SCADA VLAN switch" }
    ]
  );
  const [requiresApproval, setRequiresApproval] = useState(initialRule?.requiresApproval ?? true);
  const [cooldown, setCooldown] = useState(initialRule?.cooldownMinutes ?? 15);
  const [maxPerHour, setMaxPerHour] = useState(initialRule?.maxExecutionsPerHour ?? 5);

  const addCondition = () => {
    setConditions([...conditions, { field: "status", operator: "equals", value: "active" }]);
  };

  const removeCondition = (idx: number) => {
    setConditions(conditions.filter((_, i) => i !== idx));
  };

  const addAction = () => {
    setActions([...actions, { type: "dispatch_notification", target: "Primary On-Call Lead", channel: "sms" }]);
  };

  const removeAction = (idx: number) => {
    setActions(actions.filter((_, i) => i !== idx));
  };

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-elevated p-5 space-y-5 text-xs">
      <div className="border-b border-border-subtle pb-3">
        <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
          <Zap className="h-4 w-4 text-brand-500" />
          Automation Rule Builder (WHEN / IF / THEN / APPROVAL / LIMITS)
        </h3>
        <p className="text-[11px] text-text-muted mt-0.5">
          Configure rule conditions, safety limits, and commander approval gates.
        </p>
      </div>

      {/* Basic Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-text-muted font-medium">{t("ruleName")}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-border-subtle bg-surface-base px-3 py-1.5 text-xs text-text-main focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-text-muted font-medium">{t("triggerSource")}</label>
          <select
            value={triggerEvent}
            onChange={(e) => setTriggerEvent(e.target.value)}
            className="w-full rounded-lg border border-border-subtle bg-surface-base px-3 py-1.5 text-xs text-text-main focus:ring-1 focus:ring-brand-500"
          >
            <option value="incident.created">{t("incidentCreated")}</option>
            <option value="incident.severity_escalated">{t("severityEscalated")}</option>
            <option value="sla.breach_warning_15m">{t("slaBreachWarning")}</option>
            <option value="webhook.monitoring_feed">{t("webhookFeed")}</option>
            <option value="schedule.daily_readiness">{t("scheduleReadiness")}</option>
          </select>
        </div>
        <div className="md:col-span-2 space-y-1">
          <label className="text-text-muted font-medium">{t("description")}</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-border-subtle bg-surface-base px-3 py-1.5 text-xs text-text-main focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Conditions (IF) */}
      <div className="space-y-2 rounded-lg border border-border-subtle bg-surface-base p-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-text-main">{t("ifConditions")}</span>
          <button
            type="button"
            onClick={addCondition}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-500 hover:text-brand-600"
          >
            <Plus className="h-3 w-3" /> Add Condition
          </button>
        </div>
        <div className="space-y-2">
          {conditions.map((cond, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={cond.field}
                onChange={(e) => {
                  const updated = [...conditions];
                  updated[idx].field = e.target.value;
                  setConditions(updated);
                }}
                className="w-1/3 rounded border border-border-subtle bg-surface-elevated px-2 py-1 text-xs text-text-main"
                placeholder={t("fieldPlaceholder")}
              />
              <select
                value={cond.operator}
                onChange={(e) => {
                  const updated = [...conditions];
                  updated[idx].operator = e.target.value;
                  setConditions(updated);
                }}
                className="w-1/4 rounded border border-border-subtle bg-surface-elevated px-2 py-1 text-xs text-text-main"
              >
                <option value="equals">equals</option>
                <option value="not_equals">{t("notEquals")}</option>
                <option value="contains">contains</option>
                <option value="greater_than">{t("greaterThan")}</option>
              </select>
              <input
                type="text"
                value={cond.value}
                onChange={(e) => {
                  const updated = [...conditions];
                  updated[idx].value = e.target.value;
                  setConditions(updated);
                }}
                className="flex-1 rounded border border-border-subtle bg-surface-elevated px-2 py-1 text-xs text-text-main"
                placeholder="value"
              />
              <button
                type="button"
                onClick={() => removeCondition(idx)}
                className="p-1 text-text-muted hover:text-critical-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Actions (THEN) */}
      <div className="space-y-2 rounded-lg border border-border-subtle bg-surface-base p-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-text-main">{t("thenActions")}</span>
          <button
            type="button"
            onClick={addAction}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-500 hover:text-brand-600"
          >
            <Plus className="h-3 w-3" /> Add Action
          </button>
        </div>
        <div className="space-y-2">
          {actions.map((act, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <select
                value={act.type}
                onChange={(e) => {
                  const updated = [...actions];
                  updated[idx].type = e.target.value;
                  setActions(updated);
                }}
                className="w-1/3 rounded border border-border-subtle bg-surface-elevated px-2 py-1 text-xs text-text-main"
              >
                <option value="dispatch_notification">{t("dispatchNotification")}</option>
                <option value="create_task">{t("createCriticalTask")}</option>
                <option value="escalate_sla">{t("escalateSla")}</option>
                <option value="webhook_post">{t("postWebhook")}</option>
              </select>
              <input
                type="text"
                value={act.target}
                onChange={(e) => {
                  const updated = [...actions];
                  updated[idx].target = e.target.value;
                  setActions(updated);
                }}
                className="flex-1 rounded border border-border-subtle bg-surface-elevated px-2 py-1 text-xs text-text-main"
                placeholder={t("targetPlaceholder")}
              />
              <button
                type="button"
                onClick={() => removeAction(idx)}
                className="p-1 text-text-muted hover:text-critical-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Safeguards & Rate Limits */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-border-subtle pt-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="requiresApproval"
            checked={requiresApproval}
            onChange={(e) => setRequiresApproval(e.target.checked)}
            className="rounded border-border-subtle text-brand-500 focus:ring-brand-500"
          />
          <label htmlFor="requiresApproval" className="text-text-main font-medium cursor-pointer">
            Require Commander Approval
          </label>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] text-text-muted flex items-center gap-1">
            <Clock className="h-3 w-3" /> Cooldown Minutes
          </span>
          <input
            type="number"
            value={cooldown}
            onChange={(e) => setCooldown(Number(e.target.value))}
            className="w-full rounded border border-border-subtle bg-surface-base px-2 py-1 text-xs text-text-main"
          />
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] text-text-muted flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" /> Max Runs / Hour
          </span>
          <input
            type="number"
            value={maxPerHour}
            onChange={(e) => setMaxPerHour(Number(e.target.value))}
            className="w-full rounded border border-border-subtle bg-surface-base px-2 py-1 text-xs text-text-main"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-2 border-t border-border-subtle pt-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 rounded-lg border border-border-subtle bg-surface-base text-text-muted hover:text-text-main"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={() =>
            onSave?.({
              name,
              description,
              triggerEvent,
              conditions,
              actions,
              requiresApproval,
              cooldownMinutes: cooldown,
              maxExecutionsPerHour: maxPerHour
            })
          }
          className="px-4 py-1.5 rounded-lg bg-brand-500 font-semibold text-white hover:bg-brand-600 shadow-sm"
        >
          Save Automation Rule
        </button>
      </div>
    </div>
  );
}
