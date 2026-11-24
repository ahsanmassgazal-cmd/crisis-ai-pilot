"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import {
  ShieldAlert,
  ShieldCheck,
  Radio,
  User,
  Briefcase,
  Megaphone,
  Bell,
  Eye,
  Lock,
  Presentation,
  Shield,
  ArrowRight,
} from "lucide-react";
import { useAppStore, RoleId } from "@/lib/store/useAppStore";

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const { setRole } = useAppStore();

  const roles = [
    { id: "superAdmin", icon: ShieldAlert, portal: "/owner", tag: "Platform Owner" },
    { id: "tenantAdmin", icon: ShieldCheck, portal: "/app", tag: "Tenant Admin" },
    { id: "commander", icon: Radio, portal: "/app", tag: "Incident Commander" },
    { id: "team", icon: User, portal: "/app", tag: "Crisis Team" },
    { id: "continuity", icon: Briefcase, portal: "/app/continuity/bia", tag: "BCP Manager" },
    { id: "comms", icon: Megaphone, portal: "/app/approvals", tag: "Communications" },
    { id: "responder", icon: Bell, portal: "/r", tag: "Responder PWA" },
    { id: "executive", icon: Eye, portal: "/app", tag: "Executive Read-Only" },
    { id: "auditor", icon: Lock, portal: "/app/audit", tag: "Regulatory Auditor" },
    { id: "presenter", icon: Presentation, portal: "/app", tag: "Demo Presenter" },
  ];

  const handleSelectRole = (roleId: RoleId, destination: string) => {
    setRole(roleId);
    router.push(destination);
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-4xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-card bg-brand-600 text-white shadow-md mx-auto mb-2">
            <Shield className="w-6 h-6 fill-current" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-app-text">
            {t("app.wordmark")}
          </h1>
          <p className="text-sm text-app-muted max-w-md mx-auto">
            {t("app.accessCodeDesc")} Select a simulated role persona to test permission levels across the 5 portals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <button
                key={r.id}
                onClick={() => handleSelectRole(r.id as RoleId, r.portal)}
                className="p-4 rounded-card bg-app-surface border border-app-border hover:border-brand-600 hover:shadow-md transition-all text-start flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-input bg-brand-50 text-brand-600 dark:bg-brand-50/20 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-app-surface-subtle text-app-muted">
                      {r.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-app-text group-hover:text-brand-600 transition-colors">
                    {t(`roles.${r.id}`)}
                  </h3>
                </div>

                <div className="mt-4 pt-3 border-t border-app-border flex items-center justify-between text-xs font-semibold text-brand-600">
                  <span>{t("login.enterAsPersona")}</span>
                  <ArrowRight className="w-3.5 h-3.5 dir-aware-flip group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-center text-xs text-app-muted pt-4">
          <span>{t("app.demoDataNotice")} · {t("app.poweredBy")}</span>
        </div>
      </div>
    </div>
  );
}
