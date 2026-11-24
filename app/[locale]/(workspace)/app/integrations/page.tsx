"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Ltr } from "@/components/common/Ltr";
import {
  MessageSquare,
  Mail,
  Smartphone,
  PhoneCall,
  HardDrive,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Settings,
  Plus,
  ExternalLink
} from "lucide-react";

export default function IntegrationsPage() {
  const t = useTranslations();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const integrations = [
    {
      id: "int-1",
      name: "Microsoft Teams",
      category: "Collaboration",
      icon: MessageSquare,
      status: "connected" as const,
      desc: "Graph API bot integration for Command Room adaptive cards and incident channels.",
      meta: "Latency: 600ms • Webhook Active"
    },
    {
      id: "int-2",
      name: "Corporate Email Gateway",
      category: "Notification",
      icon: Mail,
      status: "connected" as const,
      desc: "High-throughput authenticated SMTP / SendGrid with DKIM & SPF signing.",
      meta: "Deliverability: 99.8% • DKIM Verified"
    },
    {
      id: "int-3",
      name: "SMS Provider A (Omantel Telecom)",
      category: "Cellular SMS",
      icon: Smartphone,
      status: "connected" as const,
      desc: "Primary national SMS gateway with dedicated alphanumeric sender ID 'CRISIS-OM'.",
      meta: "Status: Primary Route • 1.2s Latency"
    },
    {
      id: "int-4",
      name: "SMS Provider B (Ooredoo Backup)",
      category: "Cellular SMS",
      icon: Smartphone,
      status: "connected" as const,
      desc: "Secondary carrier failover gateway. Automatic switchover if Provider A times out.",
      meta: "Status: Hot Standby • Zero Drift"
    },
    {
      id: "int-5",
      name: "WhatsApp Business Cloud API",
      category: "Messaging",
      icon: MessageSquare,
      status: "coming" as const,
      desc: "Interactive WhatsApp alerts with 1-click quick reply buttons for responders.",
      meta: "Phase 2 Enterprise Release"
    },
    {
      id: "int-6",
      name: "Automated Voice IVR Blast",
      category: "Telephony",
      icon: PhoneCall,
      status: "coming" as const,
      desc: "Text-to-speech voice call broadcasts with touch-tone DTMF acknowledgment.",
      meta: "Phase 2 Enterprise Release"
    },
    {
      id: "int-7",
      name: "Google Drive & OneDrive Connector",
      category: "Storage",
      icon: HardDrive,
      status: "coming" as const,
      desc: "Automated syncing of emergency playbooks and post-incident evidence packets.",
      meta: "Phase 2 Enterprise Release"
    },
    {
      id: "int-8",
      name: "SIEM & SOC Connector (Splunk / Sentinel)",
      category: "Security",
      icon: Shield,
      status: "coming" as const,
      desc: "Bi-directional alert sync with corporate Security Operations Center.",
      meta: "Phase 2 Enterprise Release"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 inset-inline-end-6 z-50 rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-semibold text-white shadow-xl animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-main">
            {t("nav.integrations")}
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Enterprise notification gateways, collaboration bots, telecom failover routes, and cloud connectors.
          </p>
        </div>

        <button
          type="button"
          onClick={() => showToast("Opening custom webhook connector modal...")}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 shadow-sm transition"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{t("integrationsCenter.addCustomWebhook")}</span>
        </button>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {integrations.map((item) => {
          const Icon = item.icon;
          const isConnected = item.status === "connected";

          return (
            <div
              key={item.id}
              className={`rounded-xl border p-4 space-y-3 flex flex-col justify-between transition ${
                isConnected
                  ? "border-border-subtle bg-surface-elevated hover:border-brand-500/40"
                  : "border-border-subtle bg-surface-base/60 opacity-75"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div
                    className={`rounded-lg p-2 ${
                      isConnected
                        ? "bg-brand-500/10 text-brand-500"
                        : "bg-surface-elevated text-text-muted"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {isConnected ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle2 className="h-3 w-3" /> Connected
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-text-muted bg-surface-base px-2 py-0.5 rounded border border-border-subtle">
                      Coming in Phase 2
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-text-main text-xs">{item.name}</h3>
                  <span className="text-[10px] text-brand-400 font-medium block">{item.category}</span>
                  <p className="text-[11px] text-text-muted mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>

              <div className="border-t border-border-subtle pt-2 flex items-center justify-between text-[10px] text-text-muted">
                <span className="font-mono">{item.meta}</span>
                {isConnected && (
                  <button
                    type="button"
                    onClick={() => showToast(`Configuring ${item.name}`)}
                    className="p-1 text-text-muted hover:text-text-main"
                  >
                    <Settings className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
