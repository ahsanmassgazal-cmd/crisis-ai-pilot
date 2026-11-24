"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  ShieldCheck,
  FileDown,
  Clock,
  ArrowLeft,
  Activity,
  Calendar,
} from "lucide-react";
import { Ltr } from "@/components/common/Ltr";

export default function StakeholderPortalPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col font-sans">
      {/* Calm, branded header */}
      <header className="border-b border-app-border bg-app-surface px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/app" className="text-app-muted hover:text-brand-600 transition-colors">
            <ArrowLeft className="w-4 h-4 dir-aware-flip" />
          </Link>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
            <h1 className="font-bold text-base text-app-text">
              {t("portals.stakeholderPortal")}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-app-muted">{t("portal.orgLabel")}:</span>
          <span className="font-bold text-app-text">{t("tenants.gulf_water")}</span>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-4xl w-full mx-auto space-y-6">
        {/* Approved Incident Briefing */}
        <div className="p-6 rounded-card bg-app-surface border border-app-border space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-app-border pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                {t("portal.officialExecutiveUpdate")}
              </span>
              <span className="text-xs text-app-muted font-mono">
                <Clock className="w-3.5 h-3.5 inline me-1" />
                <Ltr>2026-11-23 20:45 GST</Ltr>
              </span>
            </div>
            <span className="text-xs font-semibold text-emerald-600">
              {t("portal.approvedByCommander")}
            </span>
          </div>

          <h2 className="text-lg font-bold text-app-text">
            {t("portal.incidentBriefingTitle")}
          </h2>

          <div className="prose text-xs text-app-text/90 leading-relaxed space-y-2">
            <p>
              At 20:15 GST, technical sensors detected an anomaly in telemetry data within Section 4 of the Sohar plant. Backup analog systems have engaged automatically to ensure safe continuous potable water generation.
            </p>
            <p>
              <strong>{t("portal.publicSupplyImpact")}:</strong> Nil. Reserve water tanks in Muscat and Al Batinah South are at 96% capacity, representing 72 hours of uninterrupted water distribution.
            </p>
            <p>
              <strong>{t("portal.nextBriefing")}:</strong> 22:00 GST.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-app-border">
            <span className="text-xs text-app-muted">
              Classification: Confidential — Board &amp; Regulatory Distribution
            </span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white rounded-input text-xs font-semibold hover:bg-brand-hover">
              <FileDown className="w-4 h-4" />
              <span>{t("portal.downloadPack")}</span>
            </button>
          </div>
        </div>

        {/* Operational Status Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-card bg-app-surface border border-app-border space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-app-muted">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span>{t("portal.waterContinuity")}</span>
            </div>
            <div className="text-2xl font-black text-emerald-600">{t("portal.stable")}</div>
            <p className="text-[11px] text-app-muted">
              Secondary distribution networks operational without disruption.
            </p>
          </div>

          <div className="p-4 rounded-card bg-app-surface border border-app-border space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-app-muted">
              <Calendar className="w-4 h-4 text-brand-600" />
              <span>{t("portal.reportingCompliance")}</span>
            </div>
            <div className="text-2xl font-black text-brand-600">{t("portal.onTrack")}</div>
            <p className="text-[11px] text-app-muted">
              Preliminary incident report filed with the Authority within the 1-hour mandate.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
