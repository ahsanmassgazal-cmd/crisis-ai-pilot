"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import {
  Search,
  Globe,
  Sun,
  Moon,
  Monitor,
  Bell,
  Sparkles,
  ChevronDown,
  FlaskConical,
  ShieldCheck,
  Building2,
  UserCheck,
} from "lucide-react";
import { useAppStore, TenantId, AutomationMode, ThemeMode } from "@/lib/store/useAppStore";

export const TopBar: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const {
    currentTenant,
    setTenant,
    currentRole,
    automationMode,
    setAutomationMode,
    theme,
    setTheme,
    setCommandPaletteOpen,
    setRolePickerOpen,
    toggleCopilot,
  } = useAppStore();

  const [tenantDropdownOpen, setTenantDropdownOpen] = React.useState(false);
  const [modeDropdownOpen, setModeDropdownOpen] = React.useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = React.useState(false);

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  const getModeColor = (mode: AutomationMode) => {
    switch (mode) {
      case "auto":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700";
      case "assisted":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-700";
      case "manual":
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700";
    }
  };

  return (
    <header className="h-16 border-b border-app-border bg-app-surface px-4 flex items-center justify-between gap-3 sticky top-0 z-30 shadow-sm">
      {/* Start: Tenant Switcher & Search */}
      <div className="flex items-center gap-3">
        {/* Tenant Switcher */}
        <div className="relative">
          <button
            onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-input border border-app-border bg-app-surface-subtle hover:bg-app-border/40 transition-colors text-xs font-semibold text-app-text"
            aria-expanded={tenantDropdownOpen}
            aria-label={t("topbar.tenant")}
          >
            <Building2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />
            <span className="truncate max-w-[160px] sm:max-w-[200px]">
              {t(`tenants.${currentTenant}`)}
            </span>
            <ChevronDown className="w-3 h-3 text-app-muted shrink-0" />
          </button>

          {tenantDropdownOpen && (
            <div
              className="absolute start-0 top-full mt-1.5 w-64 bg-app-surface border border-app-border rounded-input shadow-lg py-1 z-50"
              onBlur={() => setTenantDropdownOpen(false)}
            >
              {(["gulf_water", "national_bank", "city_hospital", "ministry_services"] as TenantId[]).map(
                (tid) => (
                  <button
                    key={tid}
                    onClick={() => {
                      setTenant(tid);
                      setTenantDropdownOpen(false);
                    }}
                    className={`w-full text-start px-3 py-2 text-xs flex items-center gap-2 hover:bg-brand-50 hover:text-brand-600 transition-colors ${
                      currentTenant === tid ? "bg-brand-50 text-brand-600 font-bold" : "text-app-text"
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t(`tenants.${tid}`)}</span>
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Global Search Button / Command Palette Trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-input border border-app-border bg-app-surface-subtle text-app-muted hover:text-app-text hover:border-brand-600/50 transition-all text-xs w-52 sm:w-64 md:w-80 justify-between"
          aria-label={t("topbar.searchPlaceholder")}
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{t("topbar.searchPlaceholder")}</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-app-surface border border-app-border rounded text-app-muted font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* End: Mode, Sandbox, Lang, Theme, Bell, AI Copilot, User */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Mode Pill (Auto / Assisted / Manual) */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setModeDropdownOpen(!modeDropdownOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-chip border text-xs font-semibold capitalize transition-all ${getModeColor(
              automationMode
            )}`}
            title={t("topbar.mode")}
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>{t(`topbar.mode${automationMode.charAt(0).toUpperCase() + automationMode.slice(1)}`)}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {modeDropdownOpen && (
            <div className="absolute end-0 top-full mt-1.5 w-36 bg-app-surface border border-app-border rounded-input shadow-lg py-1 z-50">
              {(["auto", "assisted", "manual"] as AutomationMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setAutomationMode(mode);
                    setModeDropdownOpen(false);
                  }}
                  className={`w-full text-start px-3 py-1.5 text-xs font-medium hover:bg-brand-50 hover:text-brand-600 ${
                    automationMode === mode ? "text-brand-600 font-bold" : "text-app-text"
                  }`}
                >
                  {t(`topbar.mode${mode.charAt(0).toUpperCase() + mode.slice(1)}`)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sandbox Pill */}
        <div className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-chip border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium sandbox-stripes">
          <FlaskConical className="w-3 h-3 text-slate-500 shrink-0" />
          <span>{t("topbar.sandbox")}</span>
        </div>

        {/* Language Toggle (EN | ع) */}
        <button
          onClick={toggleLocale}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-input border border-app-border bg-app-surface-subtle hover:bg-brand-50 hover:text-brand-600 transition-colors text-xs font-bold text-app-text"
          aria-label={t("topbar.language")}
        >
          <Globe className="w-3.5 h-3.5 text-brand-600 shrink-0" />
          <span>{locale === "en" ? "عربي" : "English"}</span>
        </button>

        {/* Theme Toggle (Light / Dark / Command) */}
        <div className="relative">
          <button
            onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            className="p-1.5 rounded-input border border-app-border bg-app-surface-subtle hover:bg-app-border/40 text-app-muted hover:text-app-text transition-colors"
            aria-label={t("topbar.theme")}
          >
            {theme === "light" && <Sun className="w-4 h-4 text-amber-500" />}
            {theme === "dark" && <Moon className="w-4 h-4 text-indigo-400" />}
            {theme === "command" && <Monitor className="w-4 h-4 text-brand-600" />}
          </button>

          {themeDropdownOpen && (
            <div className="absolute end-0 top-full mt-1.5 w-36 bg-app-surface border border-app-border rounded-input shadow-lg py-1 z-50">
              <button
                onClick={() => {
                  setTheme("light");
                  setThemeDropdownOpen(false);
                }}
                className="w-full text-start px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-brand-50 hover:text-brand-600 text-app-text"
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>{t("topbar.themeLight")}</span>
              </button>
              <button
                onClick={() => {
                  setTheme("dark");
                  setThemeDropdownOpen(false);
                }}
                className="w-full text-start px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-brand-50 hover:text-brand-600 text-app-text"
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>{t("topbar.themeDark")}</span>
              </button>
              <button
                onClick={() => {
                  setTheme("command");
                  setThemeDropdownOpen(false);
                }}
                className="w-full text-start px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-brand-50 hover:text-brand-600 text-app-text"
              >
                <Monitor className="w-3.5 h-3.5 text-brand-600" />
                <span>{t("topbar.themeCommand")}</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <button
          className="relative p-1.5 rounded-input border border-app-border bg-app-surface-subtle hover:bg-app-border/40 text-app-muted hover:text-app-text transition-colors"
          aria-label={t("topbar.notifications")}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 end-1 w-2 h-2 rounded-full bg-severity-critical ring-2 ring-app-surface" />
        </button>

        {/* AI Copilot Button (Purple) */}
        <button
          onClick={() => toggleCopilot()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-input bg-brand-600 hover:bg-brand-hover text-white text-xs font-semibold shadow-sm transition-all"
          aria-label={t("topbar.copilot")}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t("topbar.copilot")}</span>
        </button>

        {/* Active Role Picker / Avatar */}
        <button
          onClick={() => setRolePickerOpen(true)}
          className="flex items-center gap-1.5 ps-2 pe-3 py-1 rounded-input border border-brand-600/30 bg-brand-50 dark:bg-brand-50/20 text-brand-600 text-xs font-medium hover:border-brand-600 transition-colors"
          title={t("topbar.switchRole")}
        >
          <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-[10px]">
            {currentRole.slice(0, 2).toUpperCase()}
          </div>
          <span className="hidden md:inline max-w-[110px] truncate">
            {t(`roles.${currentRole}`)}
          </span>
          <UserCheck className="w-3.5 h-3.5 opacity-80" />
        </button>
      </div>
    </header>
  );
};
