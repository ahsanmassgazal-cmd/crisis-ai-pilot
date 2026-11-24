"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Ltr } from "@/components/common/Ltr";
import {
  Zap,
  Play,
  Calendar,
  Webhook,
  Mail,
  FileSpreadsheet,
  Activity,
  UserCheck,
  Clock,
  Terminal,
  CheckCircle2,
  ExternalLink,
  Code2
} from "lucide-react";

export default function ConditionsAndTriggersPage() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<"sources" | "console">("sources");
  const [testPayload, setTestPayload] = useState(
    JSON.stringify(
      {
        source: "scada_monitoring_gateway",
        event_type: "telemetry_spike",
        site_id: "site-sohar-01",
        metrics: {
          pressure_bar: 78.4,
          normal_range: [40, 65],
          status: "alert"
        }
      },
      null,
      2
    )
  );
  const [testOutput, setTestOutput] = useState<string | null>(null);

  const triggerSources = [
    {
      id: "trig-1",
      name: "Manual Commander Button",
      type: "manual",
      icon: Play,
      status: "Active",
      desc: "One-click activation from Command Center or Responder PWA",
      rateLimit: "No rate limit",
      matchedRules: 3
    },
    {
      id: "trig-2",
      name: "Scheduled Cron Rules",
      type: "schedule",
      icon: Calendar,
      status: "Active",
      desc: "Time-based recurrence (daily 07:00 readiness, weekly drills)",
      rateLimit: "Scheduled execution",
      matchedRules: 2
    },
    {
      id: "trig-3",
      name: "Inbound REST Webhook API",
      type: "webhook",
      icon: Webhook,
      status: "Active",
      desc: "Secure HMAC-SHA256 authenticated JSON webhook for SIEM & SCADA",
      rateLimit: "1,000 req / min",
      matchedRules: 4
    },
    {
      id: "trig-4",
      name: "Emergency Email Parser",
      type: "email",
      icon: Mail,
      status: "Active",
      desc: "IMAP polling of alerts@gulfwater.om with regex subject triage",
      rateLimit: "60 emails / min",
      matchedRules: 2
    },
    {
      id: "trig-5",
      name: "Automated File Feed (SFTP / S3)",
      type: "file",
      icon: FileSpreadsheet,
      status: "Active",
      desc: "Monitors daily roster updates and telemetry dump files",
      rateLimit: "5 files / hour",
      matchedRules: 1
    },
    {
      id: "trig-6",
      name: "Live Industrial Monitoring Feed",
      type: "monitoring",
      icon: Activity,
      status: "Active",
      desc: "Direct socket streaming from plant DCS & telemetry servers",
      rateLimit: "Continuous stream",
      matchedRules: 3
    },
    {
      id: "trig-7",
      name: "Public Citizen Incident Report Form",
      type: "public",
      icon: UserCheck,
      status: "Active",
      desc: "CAPTCHA-free signed citizen reports with geolocation triage",
      rateLimit: "100 submissions / min",
      matchedRules: 1
    },
    {
      id: "trig-8",
      name: "SLA & Threshold Watcher",
      type: "sla",
      icon: Clock,
      status: "Active",
      desc: "Continuous worker tracking unacked timeouts & breach timers",
      rateLimit: "Every 15 seconds",
      matchedRules: 5
    }
  ];

  const handleTestEvaluation = () => {
    setTestOutput(
      `[SIMULATION SUCCESS]:\n- Evaluated Source: Inbound REST Webhook\n- Validated Signature: HMAC-SHA256 (Pass)\n- Matched Category: Industrial SCADA\n- Matched Rules: RULE-005, RULE-001\n- Recommended Severity: Critical (SEV1)\n- Suggested Action: Dispatch Notification to On-Call SCADA Engineers.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-main">
            {t("nav.triggers")}
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Configure multi-channel ingestion sources, webhooks, schedule rules, and payload simulators.
          </p>
        </div>

        {/* Tab switch */}
        <div className="inline-flex rounded-lg border border-border-subtle bg-surface-base p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("sources")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "sources"
                ? "bg-surface-elevated text-text-main shadow-xs font-semibold"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            Trigger Sources (8)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("console")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "console"
                ? "bg-surface-elevated text-text-main shadow-xs font-semibold"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            Payload Test Console
          </button>
        </div>
      </div>

      {activeTab === "sources" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {triggerSources.map((src) => {
            const Icon = src.icon;
            return (
              <div
                key={src.id}
                className="rounded-xl border border-border-subtle bg-surface-elevated p-4 space-y-3 text-xs flex flex-col justify-between hover:border-brand-500/40 transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="rounded-lg bg-brand-500/10 p-2 text-brand-500">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {src.status}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-text-main text-xs">{src.name}</h3>
                    <p className="text-[11px] text-text-muted mt-1 leading-relaxed">{src.desc}</p>
                  </div>
                </div>

                <div className="border-t border-border-subtle pt-2 space-y-1 text-[10px] text-text-muted">
                  <div className="flex justify-between">
                    <span>Rate Limit:</span>
                    <span className="font-mono text-text-main">{src.rateLimit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Matched Rules:</span>
                    <span className="font-bold text-brand-400"><Ltr>{src.matchedRules}</Ltr> Rules</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-5 space-y-4 text-xs">
          <div className="border-b border-border-subtle pb-3">
            <h3 className="font-bold text-text-main text-sm flex items-center gap-2">
              <Terminal className="h-4 w-4 text-brand-500" />
              Interactive Payload Ingestion Simulator
            </h3>
            <p className="text-[11px] text-text-muted">
              Submit test JSON payloads to verify rule evaluation logic and rate limit compliance.
            </p>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-text-main block">Inbound JSON Payload</label>
            <textarea
              rows={8}
              value={testPayload}
              onChange={(e) => setTestPayload(e.target.value)}
              className="w-full rounded-lg border border-border-subtle bg-surface-base p-3 font-mono text-[11px] text-text-main focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleTestEvaluation}
              className="px-4 py-2 rounded-lg bg-brand-500 font-semibold text-white hover:bg-brand-600 shadow-sm transition"
            >
              Simulate Ingestion
            </button>
          </div>

          {testOutput && (
            <div className="rounded-lg border border-emerald-500/30 bg-surface-base p-3 space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-400">Simulation Evaluation Log</span>
              <pre className="font-mono text-[11px] text-emerald-300 whitespace-pre-wrap leading-relaxed">
                {testOutput}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
