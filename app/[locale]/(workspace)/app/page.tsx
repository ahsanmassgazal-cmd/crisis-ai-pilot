"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Clock,
  AlertOctagon,
  CheckSquare,
  ShieldCheck,
  TrendingUp,
  Siren,
  ChevronRight,
  Sparkles,
  Zap,
  ArrowRight,
  Activity,
  Flame,
  FileCheck,
} from "lucide-react";
import { Ltr } from "@/components/common/Ltr";
import { SeverityBadge } from "@/components/crisis/atoms/SeverityBadge";
import { CategoryTag } from "@/components/crisis/atoms/CategoryTag";
import { SlaRing } from "@/components/crisis/display/SlaRing";
import { ReadinessGauge } from "@/components/crisis/display/ReadinessGauge";
import { MapPanel } from "@/components/crisis/views/MapPanel";
import { useRepo } from "@/lib/repo";

export default function CommandCenterPage() {
  const t = useTranslations();
  const locale = useLocale();
  const repo = useRepo();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Row 1: Hero Band (Von Restorff isolation effect) */}
      <section
        aria-label="Hero Metric"
        className="rounded-card p-6 bg-app-surface border border-app-border shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden"
      >
        <div className="absolute top-0 end-0 w-96 h-96 bg-brand-50 dark:bg-brand-50/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-chip text-xs font-semibold bg-brand-50 dark:bg-brand-50/20 text-brand-600 border border-brand-600/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Automated Mass Notification Engine</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-app-text">
            {t("commandCenter.heroTitle")}
          </h1>

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-black text-brand-600 tracking-tight">
              <Ltr>41 s</Ltr>
            </span>
            <span className="text-xs sm:text-sm text-app-muted font-medium bg-app-surface-subtle px-2.5 py-1 rounded-input border border-app-border">
              {t("commandCenter.heroComparison")}
            </span>
          </div>
        </div>

        {/* Hero Ring / Stats badge */}
        <div className="flex items-center gap-4 p-4 rounded-input border border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300">
          <div className="w-14 h-14 rounded-full border-4 border-emerald-500 flex items-center justify-center font-black text-base bg-app-surface shadow-sm text-emerald-600">
            <Ltr>92%</Ltr>
          </div>
          <div>
            <div className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
              {t("commandCenter.heroAcked")}
            </div>
            <div className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
              <Ltr>228</Ltr> / <Ltr>248</Ltr> Responders Safe &amp; Active
            </div>
          </div>
        </div>
      </section>

      {/* Row 2: 6 KPI Tiles (Miller's Law) */}
      <section aria-label="Key Performance Indicators" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* KPI 1: Active Incidents */}
        <Link
          href="/app/incidents"
          className="p-4 rounded-card bg-app-surface border border-app-border hover:border-brand-600/50 transition-all flex flex-col justify-between shadow-xs"
        >
          <div className="flex items-center justify-between text-app-muted text-xs font-semibold">
            <span>{t("commandCenter.kpiActiveIncidents")}</span>
            <Siren className="w-4 h-4 text-severity-critical" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-app-text">
              <Ltr>3</Ltr>
            </div>
            <div className="text-[11px] text-severity-critical font-bold mt-0.5 flex items-center gap-1">
              <span>1 SEV1 Critical</span>
            </div>
          </div>
        </Link>

        {/* KPI 2: Open P1 Tasks */}
        <Link
          href="/app/incidents/inc-2026-001"
          className="p-4 rounded-card bg-app-surface border border-app-border hover:border-brand-600/50 transition-all flex flex-col justify-between shadow-xs"
        >
          <div className="flex items-center justify-between text-app-muted text-xs font-semibold">
            <span>{t("commandCenter.kpiOpenTasks")}</span>
            <AlertOctagon className="w-4 h-4 text-priority-p1" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-app-text">
              <Ltr>7</Ltr>
            </div>
            <div className="text-[11px] text-priority-p1 font-bold mt-0.5">
              <Ltr>3</Ltr> SLA Due &lt; 30 min
            </div>
          </div>
        </Link>

        {/* KPI 3: Pending Approvals */}
        <Link
          href="/app/approvals"
          className="p-4 rounded-card bg-app-surface border border-app-border hover:border-brand-600/50 transition-all flex flex-col justify-between shadow-xs"
        >
          <div className="flex items-center justify-between text-app-muted text-xs font-semibold">
            <span>{t("commandCenter.kpiPendingApprovals")}</span>
            <CheckSquare className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-app-text">
              <Ltr>3</Ltr>
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 font-bold mt-0.5">
              1 AI Bilingual Draft
            </div>
          </div>
        </Link>

        {/* KPI 4: Avg Time to Ack */}
        <div className="p-4 rounded-card bg-app-surface border border-app-border flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-app-muted text-xs font-semibold">
            <span>{t("commandCenter.kpiAvgAckTime")}</span>
            <Clock className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-app-text">
              <Ltr>1m 48s</Ltr>
            </div>
            <div className="text-[11px] text-emerald-600 font-bold mt-0.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>-32s vs baseline</span>
            </div>
          </div>
        </div>

        {/* KPI 5: Readiness Score */}
        <div className="p-4 rounded-card bg-app-surface border border-app-border flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-app-muted text-xs font-semibold">
            <span>{t("commandCenter.kpiReadiness")}</span>
            <ShieldCheck className="w-4 h-4 text-brand-600" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-brand-600">
              <Ltr>78%</Ltr>
            </div>
            <div className="text-[11px] text-app-muted font-medium mt-0.5">
              Target: 85%
            </div>
          </div>
        </div>

        {/* KPI 6: Automations Healthy */}
        <Link
          href="/app/automations"
          className="p-4 rounded-card bg-app-surface border border-app-border hover:border-brand-600/50 transition-all flex flex-col justify-between shadow-xs"
        >
          <div className="flex items-center justify-between text-app-muted text-xs font-semibold">
            <span>{t("commandCenter.kpiAutomations")}</span>
            <Zap className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-600">
              <Ltr>11</Ltr> / <Ltr>12</Ltr>
            </div>
            <div className="text-[11px] text-emerald-600 font-bold mt-0.5">
              Auto Mode Active
            </div>
          </div>
        </Link>
      </section>

      {/* Row 3: Attention Queue (Now / Next / Later Lanes with reasons) */}
      <section aria-label="Attention Queue" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-base text-app-text">
              {t("commandCenter.attentionQueueTitle")}
            </h2>
            <span className="text-xs text-app-muted">
              (Ranked by algorithmic priority score 0-100)
            </span>
          </div>
          <Link
            href="/app/focus"
            className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1"
          >
            <span>{t("common.viewDetails")}</span>
            <ChevronRight className="w-3.5 h-3.5 dir-aware-flip" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Lane: NOW (>=70) */}
          <div className="rounded-card bg-app-surface border-s-4 border-s-priority-p1 border-app-border border p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold text-priority-p1">
              <span>{t("commandCenter.laneNow")}</span>
              <span className="px-1.5 py-0.5 bg-severity-critical-tint text-severity-critical rounded font-mono text-[10px]">
                Score ≥ 70
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-input bg-app-surface-subtle border border-app-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-app-text">Approval Waiting</span>
                  <span className="text-[10px] text-priority-p1 font-bold">6 min</span>
                </div>
                <p className="text-app-muted text-[11px]">
                  Bilingual evacuation alert for Sohar Plant Desalination Unit 2.
                </p>
                <div className="pt-2 flex items-center justify-end">
                  <Link
                    href="/app/approvals"
                    className="px-2.5 py-1 bg-brand-600 text-white rounded-input text-[11px] font-semibold hover:bg-brand-hover shadow-xs"
                  >
                    Review &amp; Approve
                  </Link>
                </div>
              </div>

              <div className="p-3 rounded-input bg-app-surface-subtle border border-app-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-app-text">Responders Unreached</span>
                  <span className="text-[10px] text-priority-p1 font-bold">3 People</span>
                </div>
                <p className="text-app-muted text-[11px]">
                  Primary SMS channel timed out; failover B route auto-triggered.
                </p>
              </div>
            </div>
          </div>

          {/* Lane: NEXT (40-69) */}
          <div className="rounded-card bg-app-surface border-s-4 border-s-priority-p2 border-app-border border p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold text-priority-p2">
              <span>{t("commandCenter.laneNext")}</span>
              <span className="px-1.5 py-0.5 bg-severity-high-tint text-severity-high rounded font-mono text-[10px]">
                Score 40-69
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-input bg-app-surface-subtle border border-app-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-app-text">RTO Deadline Approach</span>
                  <span className="text-[10px] text-priority-p2 font-bold">42 min left</span>
                </div>
                <p className="text-app-muted text-[11px]">
                  SCADA Telemetry System recovery plan checkpoint required.
                </p>
              </div>
            </div>
          </div>

          {/* Lane: LATER (<40) */}
          <div className="rounded-card bg-app-surface border-s-4 border-s-priority-p4 border-app-border border p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold text-app-muted">
              <span>{t("commandCenter.laneLater")}</span>
              <span className="px-1.5 py-0.5 bg-app-surface-subtle text-app-muted rounded font-mono text-[10px]">
                Score &lt; 40
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-input bg-app-surface-subtle border border-app-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-app-text">Post-Drill Survey Followup</span>
                  <span className="text-[10px] text-app-muted">Due in 2 days</span>
                </div>
                <p className="text-app-muted text-[11px]">
                  Gather feedback on Nizwa electrical isolation exercise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Row 4: Live Incidents & Delivery Funnel */}
      <section aria-label="Active Incidents Summary" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-card bg-app-surface border border-app-border p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-app-text">
              {t("commandCenter.liveIncidents")}
            </h2>
            <Link
              href="/app/incidents/new"
              className="px-3 py-1.5 bg-brand-600 hover:bg-brand-hover text-white text-xs font-bold rounded-input shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>{t("commandCenter.quickActivate")}</span>
              <ArrowRight className="w-3.5 h-3.5 dir-aware-flip" />
            </Link>
          </div>

          <div className="space-y-3">
            {/* Live Card 1 (SEV1) */}
            <div className="p-4 rounded-input border border-severity-critical/30 bg-severity-critical-tint/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <SeverityBadge level="critical" />
                  <CategoryTag category="cyber" />
                  <span className="text-xs font-mono text-app-muted">
                    <Ltr>INC-2026-001</Ltr>
                  </span>
                </div>
                <h3 className="font-bold text-sm text-app-text">
                  {locale === "ar"
                    ? "خلل في شبكة التحكم الإشرافي SCADA (محطة صحار)"
                    : "SCADA Network Anomaly & Sensor Desynchronization"}
                </h3>
                <p className="text-xs text-app-muted">
                  Commander: Eng. Tariq Al-Busaidi · Site: Sohar Desalination Plant · SLA Remaining: 35m
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <SlaRing totalMinutes={60} elapsedMinutes={25} size={52} />
                <Link
                  href="/app/incidents/inc-2026-001"
                  className="px-3 py-1.5 bg-severity-critical text-white rounded-input text-xs font-bold hover:opacity-90 shadow-xs"
                >
                  {t("app.openRoom")}
                </Link>
              </div>
            </div>

            {/* Live Card 2 (SEV3) */}
            <div className="p-4 rounded-input border border-app-border bg-app-surface-subtle/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <SeverityBadge level="medium" />
                  <CategoryTag category="supply" />
                  <span className="text-xs font-mono text-app-muted">
                    <Ltr>INC-2026-002</Ltr>
                  </span>
                </div>
                <h3 className="font-bold text-sm text-app-text">
                  {locale === "ar"
                    ? "توقف توريد الكواشف الكيميائية الحيوية (ميناء صحار)"
                    : "Chemical Reagent Supplier Logistics Halt (Sohar Port)"}
                </h3>
                <p className="text-xs text-app-muted">
                  Commander: Dr. Maryam Al-Zadjali · Site: Sohar Port · SLA Remaining: 180m
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <SlaRing totalMinutes={240} elapsedMinutes={60} size={52} />
                <Link
                  href="/app/incidents/inc-2026-002"
                  className="px-3 py-1.5 bg-app-surface border border-app-border text-app-text rounded-input text-xs font-semibold hover:bg-app-surface-subtle"
                >
                  View Incident
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Delivery Funnel */}
        <div className="rounded-card bg-app-surface border border-app-border p-5 space-y-3 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-sm text-app-text">
              {t("commandCenter.deliveryFunnel")}
            </h2>
            <p className="text-[11px] text-app-muted mt-0.5">
              Live automated broadcast status across 248 on-call personnel
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-app-surface-subtle">
              <span className="text-app-muted">1. Queued in Engine</span>
              <span className="font-bold text-app-text"><Ltr>0</Ltr></span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-app-surface-subtle">
              <span className="text-app-muted">2. Sent to Channels</span>
              <span className="font-bold text-app-text"><Ltr>248 (100%)</Ltr></span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-app-surface-subtle">
              <span className="text-app-muted">3. Delivered (SMS/Teams/Email)</span>
              <span className="font-bold text-teal-600"><Ltr>245 (98.8%)</Ltr></span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
              <span>4. Acknowledged Safe &amp; Active</span>
              <span><Ltr>228 (92.0%)</Ltr></span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-app-muted border-t border-app-border flex items-center justify-between">
            <span>Failover Path:</span>
            <span className="font-semibold text-purple-600">SMS A → SMS B (Active)</span>
          </div>
        </div>
      </section>

      {/* Row 5: Site Map & Readiness Breakdown */}
      <section aria-label="Infrastructure & Readiness" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MapPanel />
        </div>
        <div>
          <ReadinessGauge />
        </div>
      </section>
    </div>
  );
}
