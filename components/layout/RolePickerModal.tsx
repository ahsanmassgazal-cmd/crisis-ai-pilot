"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { X, Check, ShieldAlert, User, ShieldCheck, Radio, Briefcase, Megaphone, Bell, Eye, Lock, Presentation } from "lucide-react";
import { useAppStore, RoleId } from "@/lib/store/useAppStore";

export const RolePickerModal: React.FC = () => {
  const t = useTranslations();
  const { rolePickerOpen, setRolePickerOpen, currentRole, setRole } = useAppStore();

  if (!rolePickerOpen) return null;

  const rolesList: { id: RoleId; portal: string; icon: React.ElementType; desc: string }[] = [
    { id: "superAdmin", portal: "Owner Console", icon: ShieldAlert, desc: "Full platform management across all client tenants, package & white-label control." },
    { id: "tenantAdmin", portal: "Client Workspace", icon: ShieldCheck, desc: "Organization settings, team management, integrations, automations, plans." },
    { id: "commander", portal: "Client Workspace", icon: Radio, desc: "Incident room leader, activate/close incidents, approve messages, kill-switch authority." },
    { id: "team", portal: "Client Workspace", icon: User, desc: "Crisis team operator, updates situation board, executes tasks, drafts messages." },
    { id: "continuity", portal: "Client Workspace", icon: Briefcase, desc: "Manages BIA, critical functions, recovery plans, and operational drills." },
    { id: "comms", portal: "Client Workspace", icon: Megaphone, desc: "Drafts stakeholder and public alerts, manages public status page." },
    { id: "responder", portal: "Responder App", icon: Bell, desc: "Mobile-first responder: acknowledge alerts, mark I'm safe / Need help, check-in." },
    { id: "executive", portal: "Client Workspace", icon: Eye, desc: "Read-only access to executive dashboards, readiness gauges, and analytics." },
    { id: "auditor", portal: "Client Workspace / Portal", icon: Lock, desc: "Read-only audit trail verification, export cryptographically hashed evidence bundles." },
    { id: "presenter", portal: "Client Workspace", icon: Presentation, desc: "Demo presenter: controls simulation clock, injects failure scenarios, resets demo." },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("topbar.switchRole")}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-2xl bg-app-surface border border-app-border rounded-card shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-app-border">
          <div>
            <h3 className="font-bold text-base text-app-text">
              {t("topbar.switchRole")}
            </h3>
            <p className="text-xs text-app-muted mt-0.5">
              Select a persona to explore portal permissions and role-specific views.
            </p>
          </div>
          <button
            onClick={() => setRolePickerOpen(false)}
            className="text-app-muted hover:text-app-text p-1.5 rounded-input"
            aria-label={t("common.close")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[65vh] overflow-y-auto">
          {rolesList.map((r) => {
            const isSelected = currentRole === r.id;
            const Icon = r.icon;
            return (
              <button
                key={r.id}
                onClick={() => {
                  setRole(r.id);
                  setRolePickerOpen(false);
                }}
                className={`text-start p-3 rounded-input border transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-brand-600 bg-brand-50 text-brand-600 dark:bg-brand-50/20"
                    : "border-app-border bg-app-surface hover:border-brand-600/40 text-app-text"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isSelected ? "text-brand-600" : "text-app-muted"}`} />
                    <span className="font-bold text-xs">
                      {t(`roles.${r.id}`)}
                    </span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-brand-600 shrink-0" />}
                </div>
                <p className="text-[11px] text-app-muted leading-relaxed line-clamp-2">
                  {r.desc}
                </p>
                <span className="mt-2 text-[10px] font-mono text-app-muted/80 uppercase">
                  {r.portal}
                </span>
              </button>
            );
          })}
        </div>

        <div className="px-6 py-3 bg-app-surface-subtle border-t border-app-border flex items-center justify-between text-xs text-app-muted">
          <span>{t("components.currentActiveRole")}: <strong>{t(`roles.${currentRole}`)}</strong></span>
          <button
            onClick={() => setRolePickerOpen(false)}
            className="px-3 py-1 bg-app-surface border border-app-border rounded-input hover:bg-app-border/40 font-medium"
          >
            {t("common.close")}
          </button>
        </div>
      </div>
    </div>
  );
};
