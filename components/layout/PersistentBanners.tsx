"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { FlaskConical, AlertTriangle, Siren, X, Play } from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { Link } from "@/i18n/routing";

export const PersistentBanners: React.FC = () => {
  const t = useTranslations();
  const {
    isSandboxMode,
    isAutomationsPaused,
    togglePauseAutomations,
    activeSev1BannerVisible,
    dismissSev1Banner,
  } = useAppStore();

  return (
    <aside aria-label={t("components.statusBanners")} className="w-full flex flex-col gap-0 z-40">
      {/* Sandbox Banner */}
      {isSandboxMode && (
        <div className="w-full bg-slate-800 text-slate-100 py-1.5 px-4 text-xs flex items-center justify-center gap-2 sandbox-stripes border-b border-slate-700">
          <FlaskConical className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <span className="font-medium tracking-wide">
            {t("app.sandboxBanner")}
          </span>
        </div>
      )}

      {/* Automations Paused Kill-Switch Banner */}
      {isAutomationsPaused && (
        <div className="w-full bg-severity-critical text-white py-2 px-4 text-xs font-semibold flex items-center justify-between border-b border-red-700 shadow-sm animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{t("app.automationsPaused")}</span>
          </div>
          <button
            onClick={togglePauseAutomations}
            className="flex items-center gap-1.5 bg-white text-severity-critical px-2.5 py-1 rounded-input font-bold text-xs hover:bg-red-50 transition-colors"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{t("common.resumeAutomations")}</span>
          </button>
        </div>
      )}

      {/* Active SEV1 Incident Banner */}
      {activeSev1BannerVisible && (
        <div className="w-full bg-severity-critical-tint border-b border-severity-critical/30 text-severity-critical py-2 px-4 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Siren className="w-4 h-4 animate-bounce shrink-0" />
            <span className="font-semibold">{t("app.activeSev1Banner")}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/app/incidents/inc-2026-001"
              className="bg-severity-critical text-white px-3 py-1 rounded-input font-medium hover:opacity-90 transition-opacity"
            >
              {t("app.openRoom")}
            </Link>
            <button
              onClick={dismissSev1Banner}
              className="text-severity-critical hover:opacity-75 transition-opacity"
              aria-label={t("common.close")}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
