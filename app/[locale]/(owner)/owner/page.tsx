"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Building2, ShieldAlert, ArrowLeft, ArrowUpRight } from "lucide-react";
import { PersistentBanners } from "@/components/layout/PersistentBanners";
import { TopBar } from "@/components/layout/TopBar";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { RolePickerModal } from "@/components/layout/RolePickerModal";

export default function OwnerConsoleOverview() {
  const t = useTranslations();

  const clients = [
    { id: "gulf_water", name: "Sample Gulf Water & Power Co.", country: "Oman", status: "Active (SEV1 ongoing)", health: "bg-emerald-500", package: "Enterprise", responders: 248 },
    { id: "national_bank", name: "Sample National Bank", country: "Oman", status: "Healthy", health: "bg-emerald-500", package: "Enterprise", responders: 512 },
    { id: "city_hospital", name: "Sample City Hospital", country: "Oman", status: "Healthy", health: "bg-emerald-500", package: "Professional", responders: 120 },
    { id: "ministry_services", name: "Sample Ministry Services", country: "Oman", status: "Healthy", health: "bg-emerald-500", package: "Enterprise", responders: 840 },
  ];

  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col font-sans">
      <PersistentBanners />
      <TopBar />
      <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link href="/app" className="text-app-muted hover:text-brand-600 transition-colors">
                <ArrowLeft className="w-4 h-4 dir-aware-flip" />
              </Link>
              <h1 className="text-xl sm:text-2xl font-black text-app-text flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-brand-600" />
                <span>{t("portals.ownerConsole")}</span>
              </h1>
            </div>
            <p className="text-xs text-app-muted">
              Central multi-tenant administration for founder startup operations across GCC clients.
            </p>
          </div>
          <Link
            href="/app"
            className="px-3 py-1.5 rounded-input bg-brand-600 hover:bg-brand-hover text-white text-xs font-semibold"
          >
            {t("owner.switchToClient")}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-card bg-app-surface border border-app-border">
            <div className="text-xs text-app-muted font-medium">{t("owner.totalTenants")}</div>
            <div className="text-2xl font-bold text-app-text mt-1">4</div>
            <div className="text-[11px] text-emerald-600 mt-0.5">{t("owner.activePercent")}</div>
          </div>
          <div className="p-4 rounded-card bg-app-surface border border-app-border">
            <div className="text-xs text-app-muted font-medium">{t("owner.activeIncidents")}</div>
            <div className="text-2xl font-bold text-severity-critical mt-1">1</div>
            <div className="text-[11px] text-app-muted mt-0.5">{t("owner.sev1GulfWater")}</div>
          </div>
          <div className="p-4 rounded-card bg-app-surface border border-app-border">
            <div className="text-xs text-app-muted font-medium">{t("owner.monthlyMessages")}</div>
            <div className="text-2xl font-bold text-app-text mt-1">14,290</div>
            <div className="text-[11px] text-emerald-600 mt-0.5">{t("owner.deliveryRate")}</div>
          </div>
          <div className="p-4 rounded-card bg-app-surface border border-app-border">
            <div className="text-xs text-app-muted font-medium">{t("owner.clientReadiness")}</div>
            <div className="text-2xl font-bold text-brand-600 mt-1">82%</div>
            <div className="text-[11px] text-app-muted mt-0.5">{t("owner.gccOrgs")}</div>
          </div>
        </div>

        <div className="rounded-card bg-app-surface border border-app-border p-5 space-y-4">
          <h2 className="font-bold text-sm text-app-text">{t("owner.tenantsTitle")}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="border-b border-app-border text-app-muted">
                <tr>
                  <th className="py-2.5 text-start font-semibold">{t("owner.clientName")}</th>
                  <th className="py-2.5 text-start font-semibold">{t("owner.country")}</th>
                  <th className="py-2.5 text-start font-semibold">{t("owner.health")}</th>
                  <th className="py-2.5 text-start font-semibold">{t("owner.package")}</th>
                  <th className="py-2.5 text-start font-semibold">{t("owner.responders")}</th>
                  <th className="py-2.5 text-end font-semibold">{t("owner.action")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border">
                {clients.map((c) => (
                  <tr key={c.id} className="hover:bg-app-surface-subtle">
                    <td className="py-3 font-semibold text-app-text flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-brand-600" />
                      <span>{c.name}</span>
                    </td>
                    <td className="py-3 text-app-muted">{c.country}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300">
                        <span className={`w-1.5 h-1.5 rounded-full ${c.health}`} />
                        <span>{c.status}</span>
                      </span>
                    </td>
                    <td className="py-3 font-mono">{c.package}</td>
                    <td className="py-3">{c.responders}</td>
                    <td className="py-3 text-end">
                      <Link
                        href="/app"
                        className="inline-flex items-center gap-1 text-brand-600 hover:underline font-semibold"
                      >
                        <span>{t("owner.openWorkspace")}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <CommandPalette />
      <RolePickerModal />
    </div>
  );
}
