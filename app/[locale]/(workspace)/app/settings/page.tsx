"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Settings,
  Palette,
  Shield,
  BellRing,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Save,
  Globe,
  Sliders,
} from "lucide-react";
import { Ltr } from "@/components/layout/Ltr";
import { showToast } from "@/lib/toast";

export default function SettingsPage() {
  const t = useTranslations();
  const locale = useLocale();

  const [activeTab, setActiveTab] = useState<"branding" | "roles" | "notifications" | "sandbox">("branding");

  // Form states
  const [brandName, setBrandName] = useState("Gulf Water Authority");
  const [primaryColor, setPrimaryColor] = useState("brand");
  const [isResetting, setIsResetting] = useState(false);

  const roles = [
    { name: "Incident Commander", perms: "Full Orchestration, Escalation, Activation, Kill Switch" },
    { name: "Executive Observer", perms: "Read-only Situation Room, Approvals for Public Release" },
    { name: "First Responder", perms: "Field Checklists, Acknowledge Calls, Status Reports" },
    { name: "Compliance Officer", perms: "Cryptographic Audit Ledger, Forensic Export, BIA Access" },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      title: t("settingsCenter.saveSettings"),
      description: "Tenant settings updated and synced across browsers.",
      tone: "brand",
    });
  };

  const handleResetSandbox = () => {
    setIsResetting(true);
    setTimeout(() => {
      setIsResetting(false);
      showToast({
        title: t("settingsCenter.sandboxResetData"),
        description: "Simulation state successfully restored to initial baseline.",
        tone: "brand",
      });
    }, 700);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-app-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-brand-600" />
            <h1 className="text-xl font-bold text-app-text">{t("settingsCenter.title")}</h1>
          </div>
          <p className="text-xs text-app-muted mt-1">{t("settingsCenter.subtitle")}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-app-surface-subtle border border-app-border rounded-input text-xs w-fit">
        <button
          onClick={() => setActiveTab("branding")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === "branding"
              ? "bg-app-surface text-brand-600 shadow-sm font-semibold"
              : "text-app-muted hover:text-app-text"
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>{t("settingsCenter.brandingTab")}</span>
        </button>
        <button
          onClick={() => setActiveTab("roles")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === "roles"
              ? "bg-app-surface text-brand-600 shadow-sm font-semibold"
              : "text-app-muted hover:text-app-text"
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>{t("settingsCenter.rolesTab")}</span>
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === "notifications"
              ? "bg-app-surface text-brand-600 shadow-sm font-semibold"
              : "text-app-muted hover:text-app-text"
          }`}
        >
          <BellRing className="w-3.5 h-3.5" />
          <span>{t("settingsCenter.notificationsTab")}</span>
        </button>
        <button
          onClick={() => setActiveTab("sandbox")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === "sandbox"
              ? "bg-app-surface text-brand-600 shadow-sm font-semibold"
              : "text-app-muted hover:text-app-text"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{t("settingsCenter.sandboxTab")}</span>
        </button>
      </div>

      {/* Tab 1: White-Label Branding */}
      {activeTab === "branding" && (
        <form onSubmit={handleSave} className="p-5 bg-app-surface border border-app-border rounded-card space-y-6 max-w-2xl shadow-sm">
          <h2 className="text-base font-bold text-app-text">{t("settingsCenter.brandingTab")}</h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-app-text block mb-1">
                {t("settingsCenter.brandNameLabel")}
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-3 py-2 bg-app-surface-subtle border border-app-border rounded-input text-app-text focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="font-semibold text-app-text block mb-1">
                {t("settingsCenter.primaryColorLabel")}
              </label>
              <select
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-full px-3 py-2 bg-app-surface-subtle border border-app-border rounded-input text-app-text focus:outline-none"
              >
                <option value="brand">{t("settingsCenter.themePurple")}</option>
                <option value="ocean">{t("settingsCenter.themeCobalt")}</option>
                <option value="emerald">{t("settingsCenter.themeEmerald")}</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-app-text block mb-1">
                {t("settingsCenter.logoUploadLabel")}
              </label>
              <div className="p-6 border-2 border-dashed border-app-border rounded-card text-center bg-app-surface-subtle/50">
                <Palette className="w-8 h-8 text-app-muted mx-auto mb-2" />
                <p className="text-xs text-app-muted">{t("settingsCenter.logoFormatNotice")}</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-input font-bold text-xs shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{t("settingsCenter.saveSettings")}</span>
          </button>
        </form>
      )}

      {/* Tab 2: Role Permissions */}
      {activeTab === "roles" && (
        <div className="p-5 bg-app-surface border border-app-border rounded-card space-y-4 shadow-sm">
          <h2 className="text-base font-bold text-app-text">{t("settingsCenter.rolesTab")}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-app-surface-subtle text-app-muted uppercase font-bold text-[10px] border-b border-app-border">
                <tr>
                  <th className="p-3 text-start">{t("settingsCenter.roleCol")}</th>
                  <th className="p-3 text-start">{t("settingsCenter.permsCol")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border">
                {roles.map((r, i) => (
                  <tr key={i} className="hover:bg-app-surface-subtle/50">
                    <td className="p-3 font-bold text-app-text whitespace-nowrap">{r.name}</td>
                    <td className="p-3 text-app-muted">{r.perms}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Gateway Credentials */}
      {activeTab === "notifications" && (
        <div className="p-5 bg-app-surface border border-app-border rounded-card space-y-4 shadow-sm max-w-2xl">
          <h2 className="text-base font-bold text-app-text">{t("settingsCenter.notificationsTab")}</h2>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-app-surface-subtle border border-app-border rounded-input flex items-center justify-between">
              <div>
                <span className="font-bold text-app-text block">{t("settingsCenter.smppName")}</span>
                <span className="text-[11px] text-app-muted">{t("settingsCenter.smppEndpoint")}</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                Active
              </span>
            </div>

            <div className="p-3 bg-app-surface-subtle border border-app-border rounded-input flex items-center justify-between">
              <div>
                <span className="font-bold text-app-text block">{t("settingsCenter.graphName")}</span>
                <span className="text-[11px] text-app-muted">{t("settingsCenter.graphEndpoint")}</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Sandbox & Demo Controls */}
      {activeTab === "sandbox" && (
        <div className="p-5 bg-app-surface border border-app-border rounded-card space-y-5 shadow-sm max-w-2xl">
          <div>
            <h2 className="text-base font-bold text-app-text">{t("settingsCenter.sandboxTab")}</h2>
            <p className="text-xs text-app-muted mt-1">{t("settingsCenter.sandboxResetConfirm")}</p>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800 rounded-input flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 dark:text-amber-200">
              <span className="font-bold block">{t("settingsCenter.sandboxNoticeTitle")}</span>
              <span>{t("settingsCenter.sandboxNoticeDesc")}</span>
            </div>
          </div>

          <button
            onClick={handleResetSandbox}
            disabled={isResetting}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-input font-bold text-xs shadow-sm transition-all"
          >
            <RotateCcw className={`w-4 h-4 ${isResetting ? "animate-spin" : ""}`} />
            <span>{t("settingsCenter.sandboxResetData")}</span>
          </button>
        </div>
      )}
    </div>
  );
}
