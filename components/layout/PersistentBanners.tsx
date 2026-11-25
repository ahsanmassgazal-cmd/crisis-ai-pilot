"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { FlaskConical, AlertTriangle, Siren, X, Play, RefreshCw, Calendar } from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { Link } from "@/i18n/routing";
import { useRepo } from "@/lib/repo";
import { showToast } from "@/lib/toast";

export const PersistentBanners: React.FC = () => {
  const t = useTranslations();
  const repo = useRepo();
  const {
    isSandboxMode,
    isAutomationsPaused,
    togglePauseAutomations,
    activeSev1BannerVisible,
    dismissSev1Banner,
  } = useAppStore();

  const [resetting, setResetting] = useState(false);

  const handleResetDemo = async () => {
    setResetting(true);
    try {
      await repo.resetToSeed();
      showToast({
        title: t("common.success"),
        description: t("app.demoBannerText"),
        tone: "emerald",
      });
      setTimeout(() => {
        window.location.reload();
      }, 400);
    } catch (e) {
      console.error(e);
      setResetting(false);
    }
  };

  return (
    <aside aria-label={t("components.statusBanners")} className="w-full flex flex-col gap-0 z-40">
      {/* Top Demo Bar (SigmaMax Standard) */}
      <div className="w-full bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 py-1.5 px-4 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="font-medium tracking-wide">
            {t("app.demoBannerText")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={resetting}
            onClick={handleResetDemo}
            className="flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-medium border border-slate-300 dark:border-slate-700 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resetting ? "animate-spin" : ""}`} />
            <span>{t("app.resetDemo")}</span>
          </button>
          <a
            href="https://sigmamaxaisolutions.com/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded bg-brand-600 hover:bg-brand-hover text-white text-xs font-medium transition-colors shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{t("app.bookCall")}</span>
          </a>
        </div>
      </div>

      {/* Sandbox Banner */}
      {isSandboxMode && (
        <div className="w-full bg-slate-200/80 dark:bg-slate-800 text-slate-800 dark:text-slate-100 py-1.5 px-4 text-xs flex items-center justify-center gap-2 sandbox-stripes border-b border-slate-300 dark:border-slate-700">
          <FlaskConical className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300 shrink-0" />
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
            className="flex items-center gap-1.5 bg-white text-severity-critical px-3 py-2 min-h-[44px] rounded-input font-bold text-xs hover:bg-red-50 transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
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
              className="bg-severity-critical text-white px-3 py-2 min-h-[44px] inline-flex items-center justify-center rounded-input font-medium hover:opacity-90 transition-opacity"
            >
              {t("app.openRoom")}
            </Link>
            <button
              onClick={dismissSev1Banner}
              className="text-severity-critical hover:opacity-75 transition-opacity min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-input"
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
