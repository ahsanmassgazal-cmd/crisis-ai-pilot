"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  LifeBuoy,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Activity,
  Zap,
  Server,
  Layers,
} from "lucide-react";
import { Ltr } from "@/components/layout/Ltr";
import { GanttTimeline, GanttItem } from "@/components/crisis/views/GanttTimeline";
import { ProgressRing } from "@/components/crisis/display/ProgressRing";
import { showToast } from "@/lib/toast";

export default function RecoveryPage() {
  const t = useTranslations();
  const locale = useLocale();

  const [failoverInitiated, setFailoverInitiated] = useState(false);
  const [activeStep, setActiveStep] = useState(2);

  const ganttItems: GanttItem[] = [
    {
      id: "ph-1",
      title: locale === "ar" ? "المرحلة 1: تحويل قياسات SCADA إلى مركز نزوى الاحتياطي" : "Phase 1: SCADA Telemetry Failover to Nizwa Backup DC",
      owner: "Eng. Salim",
      startMinutes: 0,
      durationMinutes: 15,
      progressPercent: 100,
      status: "completed",
    },
    {
      id: "ph-2",
      title: locale === "ar" ? "المرحلة 2: عزل الطاقة الإضافية وإعادة توجيه التوربينات" : "Phase 2: Auxiliary Power Isolation & Turbine Rerouting",
      owner: "Power Grid Ops",
      startMinutes: 10,
      durationMinutes: 25,
      progressPercent: 60,
      status: "active",
    },
    {
      id: "ph-3",
      title: locale === "ar" ? "المرحلة 3: موازنة الهيدروليكا لخطوط الأنابيب عبر مركز مسقط" : "Phase 3: Pipeline Hydraulic Re-balancing via Muscat Hub",
      owner: "Hydraulics Lead",
      startMinutes: 30,
      durationMinutes: 40,
      progressPercent: 0,
      status: "pending",
    },
    {
      id: "ph-4",
      title: locale === "ar" ? "المرحلة 4: الفحص والتحقق البيئي التنظيمي لجودة التدفق" : "Phase 4: Regulatory Environmental Quality Verification",
      owner: "Compliance Officer",
      startMinutes: 65,
      durationMinutes: 25,
      progressPercent: 0,
      status: "pending",
    },
  ];

  const handleInitiateFailover = () => {
    setFailoverInitiated(true);
    showToast({
      title: t("recoveryCenter.initiateFailover"),
      description: t("recoveryCenter.failoverStatus"),
      tone: "critical",
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-app-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-6 h-6 text-brand-600" />
            <h1 className="text-xl font-bold text-app-text">{t("recoveryCenter.title")}</h1>
          </div>
          <p className="text-xs text-app-muted mt-1">{t("recoveryCenter.subtitle")}</p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleInitiateFailover}
          className={`flex items-center gap-2 px-4 py-2 rounded-input font-bold text-xs shadow-sm transition-all ${
            failoverInitiated
              ? "bg-amber-600 hover:bg-amber-700 text-white"
              : "bg-status-critical hover:bg-rose-700 text-white"
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${failoverInitiated ? "animate-spin" : ""}`} />
          <span>{t("recoveryCenter.initiateFailover")}</span>
        </button>
      </div>

      {/* Failover Topology Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Site Card */}
        <div className="p-5 bg-app-surface border border-rose-300 dark:border-rose-900 rounded-card space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-status-critical px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
              {t("recoveryCenter.primarySiteLabel")}
            </span>
            <span className="text-xs font-mono font-bold text-app-muted">
              <Ltr>SOHAR-DESAL-01</Ltr>
            </span>
          </div>
          <h2 className="text-base font-bold text-app-text">
            {locale === "ar" ? "محطة تحلية صحار الرئيسية (وحدة 1-4)" : "Sohar Primary Desalination Plant (Units 1-4)"}
          </h2>
          <div className="space-y-1.5 text-xs text-app-muted pt-2 border-t border-app-border">
            <div className="flex justify-between">
              <span>{t("recoveryCenter.telemetrySwitch")}:</span>
              <span className="font-semibold text-status-critical">{t("recoveryCenter.disrupted")}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("recoveryCenter.powerSwitch")}:</span>
              <span className="font-semibold text-status-degraded">{t("recoveryCenter.isolated")}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("recoveryCenter.waterReroute")}:</span>
              <span className="font-semibold text-status-normal">{t("recoveryCenter.activeDiversion")}</span>
            </div>
          </div>
        </div>

        {/* Secondary Site Card */}
        <div className="p-5 bg-app-surface border border-emerald-300 dark:border-emerald-900 rounded-card space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-status-normal px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              {t("recoveryCenter.alternateSiteLabel")}
            </span>
            <span className="text-xs font-mono font-bold text-app-muted">
              <Ltr>NIZWA-BACKUP-02</Ltr>
            </span>
          </div>
          <h2 className="text-base font-bold text-app-text">
            {locale === "ar" ? "مركز التحكم الاحتياطي المتزامن - نزوى" : "Nizwa Secondary Standby Telemetry Hub"}
          </h2>
          <div className="space-y-1.5 text-xs text-app-muted pt-2 border-t border-app-border">
            <div className="flex justify-between">
              <span>{t("recoveryCenter.telemetrySwitch")}:</span>
              <span className="font-semibold text-status-normal">{t("recoveryCenter.synchronized")}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("recoveryCenter.powerSwitch")}:</span>
              <span className="font-semibold text-status-normal">{t("recoveryCenter.turbineStandby")}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("recoveryCenter.waterReroute")}:</span>
              <span className="font-semibold text-status-normal">{t("recoveryCenter.valvesPrimed")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* RTO Window & Gantt Timeline */}
      <div className="p-5 bg-app-surface border border-app-border rounded-card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-app-border pb-4">
          <div>
            <h2 className="text-base font-bold text-app-text">{t("recoveryCenter.phaseTimelineTitle")}</h2>
            <p className="text-xs text-app-muted mt-0.5">{t("recoveryCenter.rtoWindowRemaining")}: <Ltr>38m</Ltr> / <Ltr>60m</Ltr></p>
          </div>
          <div className="flex items-center gap-2">
            <ProgressRing value={63} size={42} strokeWidth={4} tone="amber" />
            <span className="text-xs font-bold text-app-text">{t("recoveryCenter.rtoSlaPct", { pct: 63 })}</span>
          </div>
        </div>

        {/* Embedded GanttTimeline component */}
        <GanttTimeline items={ganttItems} totalTimeMinutes={90} />
      </div>
    </div>
  );
}
