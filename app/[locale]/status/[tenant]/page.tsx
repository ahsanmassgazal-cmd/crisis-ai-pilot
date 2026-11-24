"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { CheckCircle2, AlertTriangle, ArrowLeft, Clock, Shield, Activity } from "lucide-react";
import { Ltr } from "@/components/layout/Ltr";
import { useRepo, CriticalFunction } from "@/lib/repo";

export default function PublicStatusPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const t = useTranslations();
  const repo = useRepo();
  const [resolvedParams, setResolvedParams] = useState<{ tenant: string } | null>(null);
  const [functions, setFunctions] = useState<CriticalFunction[]>([]);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    async function loadData() {
      const all = await repo.criticalFunctions.getAll();
      setFunctions(all.slice(0, 5));
    }
    loadData();
  }, [repo]);

  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col font-sans">
      <header className="border-b border-app-border bg-app-surface px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/app" className="text-app-muted hover:text-brand-600 transition-colors">
            <ArrowLeft className="w-4 h-4 dir-aware-flip" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
              <Shield className="w-3.5 h-3.5 fill-current" />
            </div>
            <h1 className="font-bold text-base text-app-text">
              Gulf Water &amp; Power Public Status
            </h1>
          </div>
        </div>
        <span className="text-xs text-app-muted flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{t("publicStatus.allMonitored")}</span>
        </span>
      </header>

      <main className="flex-1 p-6 max-w-3xl w-full mx-auto space-y-6">
        {/* Overall Status Banner */}
        <div className="p-4 rounded-card bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div className="text-xs">
            <span className="font-bold">{t("publicStatus.degradedBanner")}</span> All municipal water distribution networks operate normally with zero interruption to homes or commercial businesses.
          </div>
        </div>

        {/* Services List from Critical Functions */}
        <div className="rounded-card bg-app-surface border border-app-border overflow-hidden">
          <div className="px-5 py-3 border-b border-app-border font-bold text-xs text-app-muted uppercase tracking-wider flex items-center justify-between">
            <span>{t("publicStatus.utilityServices")}</span>
            <span className="text-[10px] font-mono">{t("publicStatus.liveTelemetry")}</span>
          </div>
          <div className="divide-y divide-app-border text-xs">
            {functions.map((fn) => {
              const isDegraded = fn.status === "degraded" || fn.status === "impacted";
              return (
                <div key={fn.id} className="px-5 py-3.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-medium text-app-text">{fn.name_en}</span>
                    <div className="text-[10px] text-app-muted">{fn.name_ar}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isDegraded ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        isDegraded ? "text-amber-600" : "text-emerald-600"
                      }`}
                    >
                      {isDegraded ? "Degraded Performance" : "Operational"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Incident History Timeline */}
        <div className="space-y-3">
          <h2 className="font-bold text-sm text-app-text">{t("publicStatus.pastUpdatesTitle")}</h2>
          <div className="p-4 rounded-card bg-app-surface border border-app-border space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-app-text">
                Sensor Calibration at Sohar Desalination Facility
              </span>
              <span className="text-app-muted font-mono">
                <Clock className="w-3 h-3 inline me-1" />
                <Ltr>2026-11-24 06:20 GST</Ltr>
              </span>
            </div>
            <p className="text-app-muted leading-relaxed">
              Engineers have isolated Section 4 sensors for telemetry desynchronization investigation. Backup systems are actively running. Water reservoir levels remain at 96% capacity with zero customer disruption.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-app-border py-4 text-center text-xs text-app-muted">
        {t("app.poweredBy")}
      </footer>
    </div>
  );
}
