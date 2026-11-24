"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Building2,
  ShieldAlert,
  ArrowLeft,
  Plus,
  CheckCircle2,
  Sparkles,
  Users,
  Activity,
  ArrowRight,
  Globe,
  Palette,
} from "lucide-react";
import { PersistentBanners } from "@/components/layout/PersistentBanners";
import { TopBar } from "@/components/layout/TopBar";
import { useAppStore, TenantId } from "@/lib/store/useAppStore";
import { useRepo, TenantConfig } from "@/lib/repo";
import { showToast } from "@/lib/toast";
import { Ltr } from "@/components/layout/Ltr";

export default function OwnerConsoleOverview() {
  const t = useTranslations();
  const repo = useRepo();
  const { currentTenant, setTenant } = useAppStore();

  const [tenants, setTenants] = useState<TenantConfig[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  // New tenant wizard form state
  const [orgNameEn, setOrgNameEn] = useState("");
  const [orgNameAr, setOrgNameAr] = useState("");
  const [country, setCountry] = useState("Oman");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [brandColor, setBrandColor] = useState("rgb(99, 102, 241)");
  const [tierPackage, setTierPackage] = useState<"Enterprise" | "Professional" | "Pilot">("Enterprise");

  const loadTenants = async () => {
    const all = await repo.tenants.getAll();
    setTenants(all);
  };

  useEffect(() => {
    loadTenants();
  }, []);

  const handleCreateTenant = async () => {
    if (!orgNameEn) return;

    const newId = orgNameEn.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 20);
    const created = await repo.tenants.create({
      id: newId,
      name_en: orgNameEn,
      name_ar: orgNameAr || orgNameEn,
      country,
      package: tierPackage,
      brand_color: brandColor,
      logo_url: `/logos/${newId}.svg`,
      active_incidents_count: 0,
      responders_count: 50,
      readiness_percent: 85,
    });

    // Record audit event
    await repo.audit.append({
      tenant_id: created.id,
      actor_id: "owner-superadmin",
      actor_role: "superAdmin",
      action: "TENANT_PROVISIONED",
      entity: "tenant",
      entity_id: created.id,
      after_json: { ...created, adminEmail },
      reason: "5-Step tenant provisioning completed by SuperAdmin.",
      ip_hint: "10.200.4.1",
      created_at: new Date().toISOString(),
    });

    await loadTenants();
    setShowWizard(false);
    setWizardStep(1);
    setOrgNameEn("");
    setOrgNameAr("");
    setAdminName("");
    setAdminEmail("");

    showToast({
      title: "Tenant Provisioned Successfully",
      description: `Organization "${created.name_en}" is now active in the platform.`,
      tone: "emerald",
    });
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col font-sans">
      <PersistentBanners />
      <TopBar />
      <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
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

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowWizard(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-input bg-brand-600 hover:bg-brand-hover text-white text-xs font-bold shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>{t("owner.provisionTenant")}</span>
            </button>

            <Link
              href="/app"
              className="px-3 py-1.5 rounded-input bg-app-surface border border-app-border hover:bg-app-surface-subtle text-xs font-semibold text-app-text transition"
            >
              {t("owner.switchToClient")}
            </Link>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-card bg-app-surface border border-app-border">
            <div className="text-xs text-app-muted font-medium">{t("owner.totalTenants")}</div>
            <div className="text-2xl font-bold text-app-text mt-1">{tenants.length || 4}</div>
            <div className="text-[11px] text-emerald-600 mt-0.5">{t("owner.activePercent")}</div>
          </div>
          <div className="p-4 rounded-card bg-app-surface border border-app-border">
            <div className="text-xs text-app-muted font-medium">{t("owner.activeIncidents")}</div>
            <div className="text-2xl font-bold text-status-critical mt-1">1</div>
            <div className="text-[11px] text-app-muted mt-0.5">{t("owner.sev1GulfWater")}</div>
          </div>
          <div className="p-4 rounded-card bg-app-surface border border-app-border">
            <div className="text-xs text-app-muted font-medium">{t("owner.monthlyMessages")}</div>
            <div className="text-2xl font-bold text-app-text mt-1">14,290</div>
            <div className="text-[11px] text-emerald-600 mt-0.5">{t("owner.deliveryRate")}</div>
          </div>
          <div className="p-4 rounded-card bg-app-surface border border-app-border">
            <div className="text-xs text-app-muted font-medium">{t("owner.clientReadiness")}</div>
            <div className="text-2xl font-bold text-brand-600 mt-1">94%</div>
            <div className="text-[11px] text-app-muted mt-0.5">{t("owner.gccOrgs")}</div>
          </div>
        </div>

        {/* Tenant Switcher & List */}
        <div className="rounded-card bg-app-surface border border-app-border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-app-text">{t("owner.tenantsTitle")}</h2>
            <span className="text-xs text-app-muted">
              Current Active Tenant: <strong className="text-brand-600">{currentTenant}</strong>
            </span>
          </div>

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
                {tenants.map((c) => (
                  <tr
                    key={c.id}
                    className={`hover:bg-app-surface-subtle transition ${
                      currentTenant === c.id ? "bg-brand-500/5 font-semibold" : ""
                    }`}
                  >
                    <td className="py-3 font-semibold text-app-text flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0 bg-brand-600"
                        style={{ backgroundColor: c.brand_color || undefined }}
                      />
                      <span>{c.name_en}</span>
                      {currentTenant === c.id && (
                        <span className="px-1.5 py-0.5 text-[9px] rounded bg-brand-500/20 text-brand-600 font-bold uppercase">
                          Selected
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-app-muted">{c.country}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{c.active_incidents_count > 0 ? "SEV1 Active" : "Healthy"}</span>
                      </span>
                    </td>
                    <td className="py-3 font-mono">{c.package}</td>
                    <td className="py-3 font-mono"><Ltr>{c.responders_count}</Ltr></td>
                    <td className="py-3 text-end">
                      <button
                        onClick={() => {
                          setTenant(c.id as TenantId);
                          showToast({
                            title: `Switched Active Tenant`,
                            description: `Now controlling tenant: ${c.name_en}`,
                            tone: "brand",
                          });
                        }}
                        className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                          currentTenant === c.id
                            ? "bg-brand-600 text-white"
                            : "border border-app-border text-app-muted hover:text-app-text"
                        }`}
                      >
                        {currentTenant === c.id ? "Active Workspace" : "Switch To Tenant"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5-Step Provisioning Wizard Modal */}
        {showWizard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-xl rounded-card border border-app-border bg-app-surface p-6 shadow-2xl space-y-5 text-xs">
              {/* Wizard Header */}
              <div className="flex items-center justify-between border-b border-app-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-brand-600 text-white flex items-center justify-center font-bold">
                    {wizardStep}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-app-text">
                      Provision Tenant: Step {wizardStep} of 5
                    </h3>
                    <p className="text-[11px] text-app-muted">
                      {wizardStep === 1 && "Organization Identity"}
                      {wizardStep === 2 && "Primary Administrator"}
                      {wizardStep === 3 && "Branding & Theme"}
                      {wizardStep === 4 && "Package & Responder Limits"}
                      {wizardStep === 5 && "Review & Deploy"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowWizard(false)}
                  className="text-app-muted hover:text-app-text font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Step 1: Org Details */}
              {wizardStep === 1 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-app-text mb-1">
                      {t("owner.orgLegalEn")}
                    </label>
                    <input
                      type="text"
                      value={orgNameEn}
                      onChange={(e) => setOrgNameEn(e.target.value)}
                      placeholder={t("owner.orgLegalEn")}
                      className="w-full rounded-input border border-app-border bg-app-surface-subtle px-3 py-2 text-xs text-app-text focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-app-text mb-1">
                      {t("owner.orgLegalAr")}
                    </label>
                    <input
                      type="text"
                      value={orgNameAr}
                      onChange={(e) => setOrgNameAr(e.target.value)}
                      placeholder={t("owner.orgLegalAr")}
                      className="w-full rounded-input border border-app-border bg-app-surface-subtle px-3 py-2 text-xs text-app-text focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-app-text mb-1">
                      {t("owner.jurisdiction")}
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full rounded-input border border-app-border bg-app-surface-subtle px-3 py-2 text-xs text-app-text"
                    >
                      <option value="Oman">{t("owner.oman")}</option>
                      <option value="UAE">{t("owner.uae")}</option>
                      <option value="Saudi Arabia">{t("owner.saudi")}</option>
                      <option value="Qatar">{t("owner.qatar")}</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Admin Setup */}
              {wizardStep === 2 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-app-text mb-1">
                      {t("owner.initialCommander")}
                    </label>
                    <input
                      type="text"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder={t("owner.initialCommander")}
                      className="w-full rounded-input border border-app-border bg-app-surface-subtle px-3 py-2 text-xs text-app-text"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-app-text mb-1">
                      {t("owner.commanderEmail")}
                    </label>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder={t("owner.commanderEmail")}
                      className="w-full rounded-input border border-app-border bg-app-surface-subtle px-3 py-2 text-xs text-app-text"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Branding */}
              {wizardStep === 3 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-app-text mb-1">
                      {t("owner.brandAccent")}
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={brandColor}
                        onChange={(e) => setBrandColor(e.target.value)}
                        className="w-10 h-10 rounded border border-app-border cursor-pointer"
                      />
                      <span className="font-mono text-xs text-app-text">{brandColor}</span>
                    </div>
                  </div>
                  <div className="p-3 rounded border border-app-border bg-app-surface-subtle">
                    <span className="text-[11px] text-app-muted block mb-1">{t("owner.livePreview")}</span>
                    <div
                      className="p-3 rounded text-white flex items-center justify-between font-bold"
                      style={{ backgroundColor: brandColor }}
                    >
                      <span>{orgNameEn || t("owner.orgLabel")}</span>
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{t("owner.activeCrisisHub")}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Package Limits */}
              {wizardStep === 4 && (
                <div className="space-y-3">
                  <label className="block text-xs font-medium text-app-text">
                    Subscription Tier & SLAs
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Pilot", "Professional", "Enterprise"] as const).map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setTierPackage(tier)}
                        className={`p-3 rounded border text-start space-y-1 transition ${
                          tierPackage === tier
                            ? "border-brand-600 bg-brand-500/10 text-brand-600 font-bold"
                            : "border-app-border bg-app-surface-subtle text-app-muted"
                        }`}
                      >
                        <div className="text-xs font-bold text-app-text">{tier}</div>
                        <div className="text-[10px]">
                          {tier === "Enterprise"
                            ? "Unlimited responders, 24/7 SLA"
                            : tier === "Professional"
                            ? "Up to 250 responders"
                            : "Up to 50 responders (30-day)"}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Review & Deploy */}
              {wizardStep === 5 && (
                <div className="p-4 rounded border border-app-border bg-app-surface-subtle space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-app-muted">{t("owner.orgLabel")}</span>
                    <strong className="text-app-text">{orgNameEn} ({orgNameAr || "N/A"})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-app-muted">{t("owner.jurisdictionLabel")}</span>
                    <span className="text-app-text">{country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-app-muted">{t("owner.commanderLabel")}</span>
                    <span className="text-app-text">{adminName || "Assigned by default"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-app-muted">{t("owner.packageLabel")}</span>
                    <span className="font-mono text-brand-600">{tierPackage}</span>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between border-t border-app-border pt-3">
                <button
                  type="button"
                  disabled={wizardStep === 1}
                  onClick={() => setWizardStep((s) => s - 1)}
                  className="px-3 py-1.5 rounded border border-app-border text-app-muted hover:text-app-text disabled:opacity-30"
                >
                  Previous
                </button>

                {wizardStep < 5 ? (
                  <button
                    type="button"
                    onClick={() => setWizardStep((s) => s + 1)}
                    className="px-4 py-1.5 rounded bg-brand-600 hover:bg-brand-hover text-white font-bold"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCreateTenant}
                    className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    {t("owner.deployTenant")}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
