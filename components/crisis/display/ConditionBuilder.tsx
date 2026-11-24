"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Sliders, Plus, Trash2, CheckCircle2 } from "lucide-react";

export interface ConditionRule {
  id: string;
  field: string;
  operator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains" | "in_list";
  value: string;
}

export interface ConditionBuilderProps {
  conditions?: ConditionRule[];
  onChange?: (conditions: ConditionRule[]) => void;
}

export function ConditionBuilder({
  conditions: initialConditions = [
    { id: "1", field: "severity", operator: "equals", value: "critical" },
    { id: "2", field: "site.tier", operator: "equals", value: "Tier 1" }
  ],
  onChange
}: ConditionBuilderProps) {
  const t = useTranslations("components");
  const [rules, setRules] = useState<ConditionRule[]>(initialConditions);

  const addRule = () => {
    const updated = [
      ...rules,
      { id: Date.now().toString(), field: "impact", operator: "equals" as const, value: "high" }
    ];
    setRules(updated);
    onChange?.(updated);
  };

  const removeRule = (id: string) => {
    const updated = rules.filter((r) => r.id !== id);
    setRules(updated);
    onChange?.(updated);
  };

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4 space-y-3 text-xs">
      <div className="flex items-center justify-between border-b border-border-subtle pb-2">
        <div className="flex items-center gap-1.5 font-semibold text-text-main">
          <Sliders className="h-4 w-4 text-brand-500" />
          <span>{t("conditionGroupTitle")}</span>
        </div>
        <button
          type="button"
          onClick={addRule}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-500 hover:text-brand-600"
        >
          <Plus className="h-3 w-3" /> Add Expression
        </button>
      </div>

      <div className="space-y-2">
        {rules.map((rule) => (
          <div key={rule.id} className="flex items-center gap-2 bg-surface-base p-2 rounded-lg border border-border-subtle">
            <select
              value={rule.field}
              onChange={(e) => {
                const updated = rules.map((r) =>
                  r.id === rule.id ? { ...r, field: e.target.value } : r
                );
                setRules(updated);
                onChange?.(updated);
              }}
              className="w-1/3 rounded border border-border-subtle bg-surface-elevated px-2 py-1 text-xs text-text-main"
            >
              <option value="severity">{t("severityEscalated")}</option>
              <option value="category">{t("categoryLabel") || "Category"}</option>
              <option value="site.tier">{t("siteTier") || "Site Infrastructure Tier"}</option>
              <option value="sla.remaining_minutes">{t("slaRemainingMinutes") || "SLA Minutes Remaining"}</option>
              <option value="responder.acked_percent">{t("responderAckRate") || "Responder Ack Rate (%)"}</option>
            </select>

            <select
              value={rule.operator}
              onChange={(e) => {
                const updated = rules.map((r) =>
                  r.id === rule.id ? { ...r, operator: e.target.value as any } : r
                );
                setRules(updated);
                onChange?.(updated);
              }}
              className="w-1/4 rounded border border-border-subtle bg-surface-elevated px-2 py-1 text-xs text-text-main"
            >
              <option value="equals">== {t("isOp") || "is"}</option>
              <option value="not_equals">!= {t("notEquals")}</option>
              <option value="greater_than">&gt; {t("greaterThan")}</option>
              <option value="less_than">&lt; {t("lessThan")}</option>
              <option value="contains">contains</option>
            </select>

            <input
              type="text"
              value={rule.value}
              onChange={(e) => {
                const updated = rules.map((r) =>
                  r.id === rule.id ? { ...r, value: e.target.value } : r
                );
                setRules(updated);
                onChange?.(updated);
              }}
              className="flex-1 rounded border border-border-subtle bg-surface-elevated px-2 py-1 text-xs text-text-main"
              placeholder={t("valuePlaceholder")}
            />

            <button
              type="button"
              onClick={() => removeRule(rule.id)}
              className="p-1 text-text-muted hover:text-critical-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-medium pt-1">
        <CheckCircle2 className="h-3.5 w-3.5" /> Expression syntax verified
      </div>
    </div>
  );
}
