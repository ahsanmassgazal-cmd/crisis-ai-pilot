"use client";

import React, { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import {
  Search,
  Siren,
  AlertTriangle,
  Globe,
  Upload,
  Fingerprint,
  Building2,
  UserCheck,
  X,
  Play,
} from "lucide-react";
import { useAppStore, TenantId, RoleId } from "@/lib/store/useAppStore";

export const CommandPalette: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    isAutomationsPaused,
    togglePauseAutomations,
    setTenant,
    setRole,
  } = useAppStore();

  const [query, setQuery] = React.useState("");

  // Listen to Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === "Escape" && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const navigateTo = (path: string) => {
    setCommandPaletteOpen(false);
    router.push(path);
  };

  const toggleLanguage = () => {
    setCommandPaletteOpen(false);
    router.replace(pathname, { locale: locale === "en" ? "ar" : "en" });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("commandPalette.title")}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-2xl bg-app-surface border border-app-border rounded-card shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-app-border">
          <Search className="w-5 h-5 text-app-muted shrink-0" />
          <input
            type="text"
            dir="auto"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("commandPalette.placeholder")}
            className="flex-1 bg-transparent border-0 outline-none text-sm text-app-text placeholder:text-app-muted"
            autoFocus
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="text-app-muted hover:text-app-text p-1 rounded-input"
            aria-label={t("common.close")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-3 text-xs">
          {/* Quick Actions */}
          <div>
            <div className="px-3 py-1 font-bold text-[10px] text-app-muted uppercase tracking-wider">
              {t("commandPalette.quickActions")}
            </div>
            <div className="space-y-1 mt-1">
              <button
                onClick={() => navigateTo("/app/incidents/new")}
                className="w-full text-start flex items-center justify-between px-3 py-2 rounded-input hover:bg-brand-50 hover:text-brand-600 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Siren className="w-4 h-4 text-severity-critical" />
                  <span className="font-semibold text-app-text">
                    {t("common.activateIncident")}
                  </span>
                </div>
                <span className="text-[10px] text-app-muted font-mono">SEV1-SEV4</span>
              </button>

              <button
                onClick={() => {
                  togglePauseAutomations();
                  setCommandPaletteOpen(false);
                }}
                className="w-full text-start flex items-center justify-between px-3 py-2 rounded-input hover:bg-brand-50 hover:text-brand-600 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  {isAutomationsPaused ? (
                    <Play className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  )}
                  <span className="font-semibold text-app-text">
                    {isAutomationsPaused
                      ? t("common.resumeAutomations")
                      : t("common.pauseAutomations")}
                  </span>
                </div>
                <span className="text-[10px] text-app-muted font-mono">Kill Switch</span>
              </button>

              <button
                onClick={toggleLanguage}
                className="w-full text-start flex items-center justify-between px-3 py-2 rounded-input hover:bg-brand-50 hover:text-brand-600 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-brand-600" />
                  <span className="font-semibold text-app-text">
                    {locale === "en" ? "التحويل إلى اللغة العربية (RTL)" : "Switch to English (LTR)"}
                  </span>
                </div>
                <span className="text-[10px] text-app-muted font-mono">{locale === "en" ? "AR" : "EN"}</span>
              </button>

              <button
                onClick={() => navigateTo("/app/data")}
                className="w-full text-start flex items-center justify-between px-3 py-2 rounded-input hover:bg-brand-50 hover:text-brand-600 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Upload className="w-4 h-4 text-indigo-500" />
                  <span className="font-semibold text-app-text">
                    {t("common.importData")}
                  </span>
                </div>
                <span className="text-[10px] text-app-muted font-mono">Excel / CSV</span>
              </button>

              <button
                onClick={() => navigateTo("/app/audit")}
                className="w-full text-start flex items-center justify-between px-3 py-2 rounded-input hover:bg-brand-50 hover:text-brand-600 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Fingerprint className="w-4 h-4 text-teal-600" />
                  <span className="font-semibold text-app-text">
                    {t("common.verifyAudit")}
                  </span>
                </div>
                <span className="text-[10px] text-app-muted font-mono">SHA-256</span>
              </button>
            </div>
          </div>

          {/* Switch Tenant */}
          <div>
            <div className="px-3 py-1 font-bold text-[10px] text-app-muted uppercase tracking-wider">
              {t("commandPalette.tenants")}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1">
              {(["gulf_water", "national_bank", "city_hospital", "ministry_services"] as TenantId[]).map(
                (tid) => (
                  <button
                    key={tid}
                    onClick={() => {
                      setTenant(tid);
                      setCommandPaletteOpen(false);
                    }}
                    className="text-start flex items-center gap-2 px-3 py-1.5 rounded-input hover:bg-brand-50 hover:text-brand-600 text-app-text"
                  >
                    <Building2 className="w-3.5 h-3.5 text-app-muted shrink-0" />
                    <span className="truncate">{t(`tenants.${tid}`)}</span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Switch Role */}
          <div>
            <div className="px-3 py-1 font-bold text-[10px] text-app-muted uppercase tracking-wider">
              {t("commandPalette.roles")}
            </div>
            <div className="grid grid-cols-2 gap-1 mt-1">
              {(
                [
                  "commander",
                  "tenantAdmin",
                  "superAdmin",
                  "team",
                  "continuity",
                  "comms",
                  "responder",
                  "executive",
                  "auditor",
                  "presenter",
                ] as RoleId[]
              ).map((rid) => (
                <button
                  key={rid}
                  onClick={() => {
                    setRole(rid);
                    setCommandPaletteOpen(false);
                  }}
                  className="text-start flex items-center gap-2 px-3 py-1.5 rounded-input hover:bg-brand-50 hover:text-brand-600 text-app-text"
                >
                  <UserCheck className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span className="truncate">{t(`roles.${rid}`)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-app-surface-subtle border-t border-app-border text-[11px] text-app-muted flex items-center justify-between">
          <span>{t("app.name")}</span>
          <span className="font-mono">ESC to close · ↵ to select</span>
        </div>
      </div>
    </div>
  );
};
