"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Ltr } from "@/components/common/Ltr";
import { ModeSwitch, AutomationMode } from "@/components/crisis/display/ModeSwitch";
import { KillSwitch } from "@/components/crisis/display/KillSwitch";
import { RuleBuilder } from "@/components/crisis/display/RuleBuilder";
import {
  Zap,
  Play,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Plus,
  Sliders,
  History,
  Activity,
  Terminal,
  Check
} from "lucide-react";

export default function AutomationCenterPage() {
  const t = useTranslations();
  const [mode, setMode] = useState<AutomationMode>("assisted");
  const [isPaused, setIsPaused] = useState(false);
  const [showRuleBuilder, setShowRuleBuilder] = useState(false);
  const [showDryRun, setShowDryRun] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const [rules, setRules] = useState([
    {
      id: "RULE-001",
      name: "Auto-Escalate SEV1 if Unacknowledged in 5m",
      trigger: "unacked_timeout (5m)",
      action: "Escalate to Level 2 Regional Directorate via SMS",
      approval: "None (Direct)",
      mode: "auto",
      enabled: true,
      executions: 142,
      successRate: "99.3%",
      lastRun: "8m ago"
    },
    {
      id: "RULE-002",
      name: "Draft Bilingual Situation Report on Severity Change",
      trigger: "incident.severity_changed",
      action: "Generate AI SITREP draft & queue in Approvals Inbox",
      approval: "Commander Required",
      mode: "assisted",
      enabled: true,
      executions: 89,
      successRate: "100%",
      lastRun: "12m ago"
    },
    {
      id: "RULE-003",
      name: "Secondary SMS Provider Failover on Gateway Timeout",
      trigger: "delivery.failed (Provider A)",
      action: "Re-route failed message batch to Provider B (Ooredoo)",
      approval: "None (Direct)",
      mode: "auto",
      enabled: true,
      executions: 14,
      successRate: "100%",
      lastRun: "1h ago"
    },
    {
      id: "RULE-004",
      name: "Daily 07:00 AM Readiness Self-Audit Trigger",
      trigger: "schedule.cron (0 7 * * *)",
      action: "Verify roster coverage, test webhook latency, update score",
      approval: "None",
      mode: "auto",
      enabled: true,
      executions: 365,
      successRate: "99.8%",
      lastRun: "3h ago"
    },
    {
      id: "RULE-005",
      name: "SCADA Telemetry Flood Containment Lock",
      trigger: "webhook.monitoring_feed",
      action: "Isolate VLAN gateway & dispatch on-call engineer team",
      approval: "Commander Required",
      mode: "assisted",
      enabled: true,
      executions: 28,
      successRate: "96.4%",
      lastRun: "24m ago"
    },
    {
      id: "RULE-006",
      name: "Notify Corporate Legal on Critical Regulatory Breaches",
      trigger: "sla.breach_warning_15m",
      action: "Send encrypted Teams alert & email draft to Legal Lead",
      approval: "None",
      mode: "assisted",
      enabled: true,
      executions: 51,
      successRate: "100%",
      lastRun: "4h ago"
    },
    {
      id: "RULE-007",
      name: "Auto-Publish Status Page Advisory on Severity Escalation",
      trigger: "incident.escalated",
      action: "Draft public advisory with ISO template for approval",
      approval: "Commander Required",
      mode: "assisted",
      enabled: true,
      executions: 33,
      successRate: "100%",
      lastRun: "10m ago"
    },
    {
      id: "RULE-008",
      name: "Responder Geofence Check-in Reminder",
      trigger: "responder.dispatched_30m",
      action: "Send SMS push reminder to confirm on-site arrival",
      approval: "None",
      mode: "auto",
      enabled: true,
      executions: 120,
      successRate: "98.3%",
      lastRun: "30m ago"
    },
    {
      id: "RULE-009",
      name: "Weekly Drill Readiness Score Assessment",
      trigger: "schedule.cron (0 9 * * 1)",
      action: "Evaluate RTO compliance & compute tenant readiness",
      approval: "None",
      mode: "auto",
      enabled: true,
      executions: 52,
      successRate: "100%",
      lastRun: "2d ago"
    },
    {
      id: "RULE-010",
      name: "Audit Chain Integrity Verification Check",
      trigger: "audit.ledger_every_100_rows",
      action: "Recalculate SHA-256 Merkle root & post health flag",
      approval: "None",
      mode: "auto",
      enabled: true,
      executions: 248,
      successRate: "100%",
      lastRun: "1m ago"
    },
    {
      id: "RULE-011",
      name: "BIA RTO Countdown Threat Alert",
      trigger: "bia.function_outage_exceeds_50pct_rto",
      action: "Escalate to Executive Committee with backup site plan",
      approval: "Commander Required",
      mode: "assisted",
      enabled: true,
      executions: 18,
      successRate: "100%",
      lastRun: "5h ago"
    },
    {
      id: "RULE-012",
      name: "Post-Incident Action Items Sync",
      trigger: "incident.closed",
      action: "Archive timeline, compile PDF summary, generate Jira tasks",
      approval: "None",
      mode: "manual",
      enabled: false,
      executions: 45,
      successRate: "95.5%",
      lastRun: "3d ago"
    }
  ]);

  const [dryRunPayload, setDryRunPayload] = useState(
    JSON.stringify(
      {
        event: "webhook.monitoring_feed",
        source: "Sohar SCADA Rack 3",
        severity: "critical",
        metrics: { tcp_packets_per_sec: 14200, threshold: 5000 }
      },
      null,
      2
    )
  );

  const [dryRunResult, setDryRunResult] = useState<string | null>(null);

  const executeDryRun = () => {
    setDryRunResult(
      `[DRY-RUN SIMULATION RESULTS]:\n- Matched Rule: RULE-005 (SCADA Telemetry Flood Containment Lock)\n- Matched Rule: RULE-001 (Auto-Escalate SEV1)\n- Mode: ASSISTED (Draft queued for Commander)\n- Simulated Dispatch: 14 SMS to On-Call SCADA Engineers\n- Safety Guard: Cooldown limit checked (PASS, 0 previous runs in last 15m)\n- Audit Signature: Simulated block 1249 would be committed.`
    );
  };

  const toggleRule = (id: string) => {
    setRules(
      rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
    showToast("Automation rule status updated.");
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 inset-inline-end-6 z-50 rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-semibold text-white shadow-xl animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header with Kill Switch */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-main">
            {t("nav.automations")}
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Engineered automation control with 3 operation modes (Auto / Assisted / Manual) and typed emergency kill switch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowDryRun(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-elevated px-3 py-1.5 text-xs font-semibold text-brand-400 hover:bg-surface-base shadow-xs transition"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>{t("automationsCenter.dryRunButton")}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowRuleBuilder(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 shadow-sm transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t("automationsCenter.newRuleButton")}</span>
          </button>

          <KillSwitch
            isPaused={isPaused}
            onToggle={(newPaused) => {
              setIsPaused(newPaused);
              showToast(
                newPaused
                  ? "EMERGENCY HALT: All automations paused across tenant."
                  : "RESUMED: All automation rules restored to active status."
              );
            }}
          />
        </div>
      </div>

      {/* Mode Switch Card */}
      <div className="rounded-xl border border-border-subtle bg-surface-elevated p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-border-subtle pb-2">
          <div>
            <h3 className="text-sm font-bold text-text-main">{t("automationsCenter.globalModeTitle")}</h3>
            <p className="text-[11px] text-text-muted">
              {t("automationsCenter.globalModeSub")}
            </p>
          </div>
          <span className="text-[10px] font-mono uppercase bg-brand-500/10 text-brand-400 px-2 py-0.5 rounded font-bold border border-brand-500/20">
            Active: {mode.toUpperCase()}
          </span>
        </div>

        <ModeSwitch currentMode={mode} onModeChange={(newMode) => {
          setMode(newMode);
          showToast(`Automation mode switched to ${newMode.toUpperCase()}`);
        }} />
      </div>

      {/* Rule Builder Modal Drawer */}
      {showRuleBuilder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <RuleBuilder
              onCancel={() => setShowRuleBuilder(false)}
              onSave={(newRule) => {
                setRules([
                  {
                    id: `RULE-0${rules.length + 1}`,
                    name: newRule.name,
                    trigger: newRule.triggerEvent,
                    action: newRule.actions[0]?.target || "Execute configured actions",
                    approval: newRule.requiresApproval ? "Commander Required" : "None",
                    mode: "assisted",
                    enabled: true,
                    executions: 0,
                    successRate: "100%",
                    lastRun: "Just created"
                  },
                  ...rules
                ]);
                setShowRuleBuilder(false);
                showToast(`Saved automation rule: "${newRule.name}"`);
              }}
            />
          </div>
        </div>
      )}

      {/* Dry Run Console Modal */}
      {showDryRun && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-border-subtle bg-surface-elevated p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
                <Terminal className="h-4 w-4 text-brand-500" />
                Rule Dry-Run & Payload Simulator
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowDryRun(false);
                  setDryRunResult(null);
                }}
                className="text-text-muted hover:text-text-main"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-text-main block">{t("automationsCenter.testPayloadLabel")}</label>
              <textarea
                rows={6}
                value={dryRunPayload}
                onChange={(e) => setDryRunPayload(e.target.value)}
                className="w-full rounded-lg border border-border-subtle bg-surface-base p-3 font-mono text-[11px] text-text-main focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={executeDryRun}
                className="px-4 py-2 rounded-lg bg-brand-500 font-semibold text-white hover:bg-brand-600 shadow-sm"
              >
                {t("automationsCenter.executeSimulation")}
              </button>
            </div>

            {dryRunResult && (
              <div className="rounded-lg border border-emerald-500/30 bg-surface-base p-3 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-400">{t("automationsCenter.simulationOutput")}</span>
                <pre className="font-mono text-[11px] text-emerald-300 whitespace-pre-wrap leading-relaxed">
                  {dryRunResult}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 12 Active Rules List */}
      <div className="rounded-xl border border-border-subtle bg-surface-elevated p-5 space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <h3 className="font-bold text-text-main text-sm flex items-center gap-2">
            <Activity className="h-4 w-4 text-brand-500" />
            {t("automationsCenter.activeRulesTitle")}
          </h3>
          <span className="text-[11px] text-text-muted">{t("automationsCenter.health100")}</span>
        </div>

        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-3.5 rounded-xl border transition space-y-2.5 ${
                rule.enabled
                  ? "border-border-subtle bg-surface-base hover:border-brand-500/40"
                  : "border-border-subtle bg-surface-base/50 opacity-60"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface-elevated border border-border-subtle text-brand-400">
                    <Ltr>{rule.id}</Ltr>
                  </span>
                  <h4 className="font-bold text-text-main text-xs">{rule.name}</h4>
                  <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    {rule.approval}
                  </span>
                </div>

                {/* Enable toggle */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-text-muted font-mono">
                    <Ltr>{rule.executions}</Ltr> runs • {rule.successRate} success
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleRule(rule.id)}
                    className={`h-5 w-9 rounded-full transition p-0.5 flex items-center ${
                      rule.enabled ? "bg-emerald-500 justify-end" : "bg-slate-700 justify-start"
                    }`}
                  >
                    <span className="h-4 w-4 rounded-full bg-white shadow-xs" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-text-muted bg-surface-elevated p-2 rounded-lg border border-border-subtle">
                <div>
                  <span className="text-[10px] text-text-muted uppercase block font-semibold">{t("automationsCenter.whenTrigger")}</span>
                  <span className="font-mono text-text-main">{rule.trigger}</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted uppercase block font-semibold">{t("automationsCenter.thenAction")}</span>
                  <span className="text-text-main">{rule.action}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
