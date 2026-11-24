"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Ltr } from "@/components/common/Ltr";
import { DeliveryStateDot } from "@/components/crisis/atoms/DeliveryStateDot";
import { PhonePreview } from "@/components/crisis/display/PhonePreview";
import {
  Send,
  Smartphone,
  Mail,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Clock,
  ShieldCheck,
  TrendingUp,
  Filter
} from "lucide-react";

export default function NotificationsCenterPage() {
  const t = useTranslations();
  const [filterChannel, setFilterChannel] = useState<"all" | "sms" | "email" | "teams">("all");
  const [selectedPreview, setSelectedPreview] = useState({
    channel: "sms" as "sms" | "email" | "teams",
    title: "CRITICAL: SCADA Containment Active",
    bodyEn: "CRITICAL ALERT: SCADA containment active at Sohar Plant. On-call engineers report to Command Room immediately.",
    bodyAr: "تنبيه حرج: تفعيل خطة الاحتواء لشبكة سكادا في محطة صحار. على مهندسي المناوبة الحضور فوراً إلى غرفة العمليات."
  });

  const liveStream = [
    {
      id: "DLV-901",
      channel: "sms" as const,
      recipient: "+968 9123 4567 (Eng. Salem Al-Harthy)",
      status: "delivered" as const,
      provider: "SMS Route A",
      latency: "1.2s",
      time: "10:14:02 AM",
      text: "CRITICAL ALERT: SCADA containment active at Sohar Plant. On-call engineers report to Command Room immediately."
    },
    {
      id: "DLV-902",
      channel: "sms" as const,
      recipient: "+968 9234 5678 (Tariq Al-Lawati)",
      status: "delivered" as const,
      provider: "SMS Route A",
      latency: "1.8s",
      time: "10:14:03 AM",
      text: "CRITICAL ALERT: SCADA containment active at Sohar Plant. On-call engineers report to Command Room immediately."
    },
    {
      id: "DLV-903",
      channel: "sms" as const,
      recipient: "+968 9345 6789 (Fatima Al-Balushi)",
      status: "failed" as const,
      provider: "SMS Route A -> Auto Failover SMS Route B",
      latency: "4.5s",
      time: "10:14:06 AM",
      text: "CRITICAL ALERT: SCADA containment active at Sohar Plant. On-call engineers report to Command Room immediately."
    },
    {
      id: "DLV-904",
      channel: "teams" as const,
      recipient: "Executive Crisis Channel #command-room",
      status: "delivered" as const,
      provider: "Microsoft Graph Webhook",
      latency: "0.6s",
      time: "10:15:10 AM",
      text: "Incident Room INC-2026-001 activated with Severity 1 (Critical). Initial response in progress."
    },
    {
      id: "DLV-905",
      channel: "email" as const,
      recipient: "director.operations@gulfwater.om",
      status: "delivered" as const,
      provider: "Corporate SMTP Gateway",
      latency: "2.1s",
      time: "10:16:30 AM",
      text: "Formal regulatory notification of Desalination Plant Rack 3 temporary throughput modulation."
    }
  ];

  const filtered = liveStream.filter((item) => {
    if (filterChannel !== "all" && item.channel !== filterChannel) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-main">
            {t("nav.notifications")}
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Real-time multi-channel delivery stream, provider failover monitors, and device previews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Provider Failover Guard: Active
          </span>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-3.5 space-y-1">
          <span className="text-[10px] text-text-muted uppercase">{t("notificationsCenter.totalDispatched")}</span>
          <p className="text-xl font-bold text-text-main"><Ltr>1,482</Ltr></p>
          <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" /> 99.4% Delivery Success
          </span>
        </div>
        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-3.5 space-y-1">
          <span className="text-[10px] text-text-muted uppercase">{t("notificationsCenter.avgLatency")}</span>
          <p className="text-xl font-bold text-text-main"><Ltr>1.4s</Ltr></p>
          <span className="text-[10px] text-text-muted">{t("notificationsCenter.targetLatency")}</span>
        </div>
        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-3.5 space-y-1">
          <span className="text-[10px] text-text-muted uppercase">{t("notificationsCenter.activeGateways")}</span>
          <p className="text-xl font-bold text-emerald-400"><Ltr>3 / 3</Ltr></p>
          <span className="text-[10px] text-text-muted">{t("notificationsCenter.gatewaysSummary")}</span>
        </div>
        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-3.5 space-y-1">
          <span className="text-[10px] text-text-muted uppercase">{t("notificationsCenter.autoFailovers")}</span>
          <p className="text-xl font-bold text-amber-400"><Ltr>1</Ltr></p>
          <span className="text-[10px] text-amber-400">{t("notificationsCenter.failoverSummary")}</span>
        </div>
      </div>

      {/* Main Grid: Stream on Left, Phone Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stream List */}
        <div className="lg:col-span-2 rounded-xl border border-border-subtle bg-surface-elevated p-4 space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-3">
            <h3 className="font-bold text-text-main flex items-center gap-2">
              <Send className="h-4 w-4 text-brand-500" />
              Live Multi-Channel Delivery Stream
            </h3>

            {/* Channel Filters */}
            <div className="inline-flex rounded-lg border border-border-subtle bg-surface-base p-1 text-xs">
              {(["all", "sms", "email", "teams"] as const).map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setFilterChannel(ch)}
                  className={`px-2.5 py-1 rounded font-medium capitalize transition ${
                    filterChannel === ch
                      ? "bg-surface-elevated text-text-main shadow-xs font-semibold"
                      : "text-text-muted hover:text-text-main"
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  setSelectedPreview({
                    channel: item.channel,
                    title: "Emergency Notification",
                    bodyEn: item.text,
                    bodyAr:
                      "تنبيه حرج: تفعيل خطة الاحتواء لشبكة سكادا في محطة صحار. على مهندسي المناوبة الحضور فوراً إلى غرفة العمليات."
                  })
                }
                className="rounded-lg border border-border-subtle bg-surface-base p-3 hover:border-brand-500/50 cursor-pointer transition space-y-1.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="uppercase text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20 font-mono">
                      {item.channel}
                    </span>
                    <span className="font-semibold text-text-main">{item.recipient}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-text-muted">
                    <span className="flex items-center gap-1">
                      <DeliveryStateDot state={item.status} />
                      <span className="capitalize">{item.status}</span>
                    </span>
                    <><span>• {t("notificationsCenter.latencyLabel")}:</span> <Ltr>{item.latency}</Ltr></>
                    <span className="font-mono"><Ltr>{item.time}</Ltr></span>
                  </div>
                </div>

                <p className="text-text-muted text-[11px] leading-relaxed line-clamp-2">
                  {item.text}
                </p>

                <div className="flex items-center justify-between text-[10px] text-text-muted pt-1 border-t border-border-subtle/50">
                  <span className="font-mono">Route: {item.provider}</span>
                  <span className="text-brand-500 font-semibold hover:underline">{t("notificationsCenter.previewOnDevice")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Device Phone Preview */}
        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4 flex flex-col items-center">
          <div className="w-full border-b border-border-subtle pb-3 mb-3 text-center">
            <h3 className="font-bold text-xs text-text-main">{t("notificationsCenter.liveDevicePreviewTitle")}</h3>
            <p className="text-[10px] text-text-muted">{t("notificationsCenter.liveDevicePreviewSub")}</p>
          </div>

          <PhonePreview
            channel={selectedPreview.channel}
            title={selectedPreview.title}
            bodyEn={selectedPreview.bodyEn}
            bodyAr={selectedPreview.bodyAr}
          />
        </div>
      </div>
    </div>
  );
}
