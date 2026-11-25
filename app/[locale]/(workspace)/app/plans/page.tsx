"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  BookOpen,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  GitBranch,
  ArrowRight,
  Download,
  Shield,
  FileText,
  Zap,
} from "lucide-react";
import { Ltr } from "@/components/layout/Ltr";
import { showToast } from "@/lib/toast";

export default function PlansPage() {
  const t = useTranslations();
  const locale = useLocale();

  const [activePlanId, setActivePlanId] = useState("CP-DESAL-04");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"steps" | "triggers" | "diff">("steps");

  const plans = [
    {
      id: "CP-DESAL-04",
      code: "CP-DESAL-04",
      title_en: "Sohar Desalination Plant SCADA & Auxiliary Failover",
      title_ar: "خطة طوارئ محطة تحلية صحار ونظام SCADA والتحويل المساعد",
      scenario: "cyber_industrial",
      version: "v3.2",
      status: "approved",
      stepsCount: 8,
      rtoMinutes: 60,
      leadRole: "Incident Commander",
      updatedAt: "2026-11-20",
    },
    {
      id: "CP-CYBER-01",
      code: "CP-CYBER-01",
      title_en: "Enterprise Ransomware Network Isolation Protocol",
      title_ar: "بروتوكول العزل الشبكي لمواجهة هجمات الفدية السيبرانية",
      scenario: "ransomware",
      version: "v2.4",
      status: "approved",
      stepsCount: 10,
      rtoMinutes: 30,
      leadRole: "Chief Information Security Officer",
      updatedAt: "2026-11-18",
    },
    {
      id: "CP-FLOOD-02",
      code: "CP-FLOOD-02",
      title_en: "Coastal Tropical Cyclone & Flooding Mitigation",
      title_ar: "خطة مواجهة الأعاصير المدارية والفيضانات الساحلية",
      scenario: "weather_cyclone",
      version: "v3.0",
      status: "approved",
      stepsCount: 6,
      rtoMinutes: 120,
      leadRole: "Emergency Operations Director",
      updatedAt: "2026-10-30",
    },
    {
      id: "CP-HAZMAT-03",
      code: "CP-HAZMAT-03",
      title_en: "Chlorine Gas Containment & Perimeter Evacuation",
      title_ar: "خطة احتواء تسرب غاز الكلور والإخلاء الميداني",
      scenario: "chemical_hazmat",
      version: "v2.1",
      status: "in_review",
      stepsCount: 7,
      rtoMinutes: 15,
      leadRole: "Health & Safety Lead",
      updatedAt: "2026-11-22",
    },
  ];

  const filteredPlans = plans.filter((p) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      p.code.toLowerCase().includes(term) ||
      p.title_en.toLowerCase().includes(term) ||
      p.title_ar.includes(search)
    );
  });

  const activePlan = plans.find((p) => p.id === activePlanId) || plans[0];

  const steps = [
    {
      step: 1,
      phase: "Activation",
      title_en: "Verify telemetry alarm thresholds and initiate dual-commander review",
      title_ar: "التحقق من عتبات إنذار القياس وبدء المراجعة المزدوجة لقادة الحدث",
      role: "Lead SCADA Engineer",
      dueOffset: "T+5m",
      required: true,
    },
    {
      step: 2,
      phase: "Containment",
      title_en: "Execute emergency physical air-gap isolation of WAN Interface 2",
      title_ar: "تنفيذ العزل المادي الطارئ للواجهة الشبكية WAN 2",
      role: "Incident Commander",
      dueOffset: "T+15m",
      required: true,
    },
    {
      step: 3,
      phase: "Continuity",
      title_en: "Transfer potable reservoir distribution to Nizwa gravity feed lines",
      title_ar: "تحويل توزيع مياه الخزان الصالح للشرب لخطوط الجاذبية في نزوى",
      role: "Operations Superintendent",
      dueOffset: "T+30m",
      required: true,
    },
    {
      step: 4,
      phase: "External",
      title_en: "Dispatch national regulatory disclosure advisory via Status Page",
      title_ar: "إصدار بيان الإفصاح للجهة التنظيمية الوطنية عبر صفحة الحالة",
      role: "Media & Comms Lead",
      dueOffset: "T+45m",
      required: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-app-border pb-4">
        <div>
          <h1 className="text-xl font-black text-app-text flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-600" />
            <span>{t("plansCenter.title")}</span>
          </h1>
          <p className="text-xs text-app-muted mt-0.5">
            {t("plansCenter.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => showToast("Exporting playbook PDF package...")}
            className="inline-flex items-center gap-1.5 rounded-input border border-app-border bg-app-surface px-3 py-1.5 text-xs font-semibold text-app-text hover:bg-app-surface-subtle transition"
          >
            <Download className="w-3.5 h-3.5 text-brand-600" />
            <span>{t("plansCenter.exportPlaybook")}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Playbooks List on Left, Detail Viewer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Playbook List */}
        <div className="rounded-card border border-app-border bg-app-surface p-4 space-y-3">
          <div className="relative">
            <Search className="absolute inset-inline-start-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-app-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("plansCenter.searchPlaceholder")}
              className="w-full rounded-input border border-app-border bg-app-surface-subtle ps-8 pe-3 py-1.5 text-xs text-app-text focus:outline-none focus:ring-1 focus:ring-brand-600"
            />
          </div>

          <div className="space-y-2">
            {filteredPlans.map((plan) => {
              const isSelected = plan.id === activePlanId;
              return (
                <div
                  key={plan.id}
                  onClick={() => setActivePlanId(plan.id)}
                  className={`p-3 rounded-card border cursor-pointer transition text-xs space-y-1.5 ${
                    isSelected
                      ? "border-brand-600 bg-brand-50/30 dark:bg-brand-950/20 shadow-xs"
                      : "border-app-border bg-app-surface hover:border-brand-600/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-brand-600">
                      <Ltr>{plan.code}</Ltr>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        plan.status === "approved"
                          ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
                          : "bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                      }`}
                    >
                      {plan.status === "approved"
                        ? t("plansCenter.approved")
                        : t("plansCenter.inReview")}
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-app-text">
                    {locale === "ar" ? plan.title_ar : plan.title_en}
                  </h3>

                  <div className="flex items-center justify-between text-[10px] text-app-muted pt-1 border-t border-app-border">
                    <span>
                      <Ltr>{plan.stepsCount}</Ltr> {t("common.step")}s
                    </span>
                    <span className="font-mono">
                      RTO &lt; <Ltr>{plan.rtoMinutes}m</Ltr>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Playbook Detailed Viewer */}
        <div className="lg:col-span-2 rounded-card border border-app-border bg-app-surface p-5 space-y-5">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-app-border pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-brand-600">
                  <Ltr>{activePlan.code}</Ltr>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-app-surface-subtle text-app-muted border border-app-border">
                  {t("plansCenter.versionApprovedBadge")}
                </span>
              </div>
              <h2 className="text-base font-bold text-app-text">
                {locale === "ar" ? activePlan.title_ar : activePlan.title_en}
              </h2>
              <p className="text-xs text-app-muted">
                {t("plansCenter.roleLabel")}: <span className="font-semibold text-app-text">{activePlan.leadRole}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => showToast(`Activated playbook ${activePlan.code} in simulated incident.`)}
              className="inline-flex items-center gap-1.5 rounded-input bg-brand-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-hover shadow-sm transition"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{t("plansCenter.activatePlaybook")}</span>
            </button>
          </div>

          {/* View Mode Tabs */}
          <div className="inline-flex rounded-input border border-app-border bg-app-surface-subtle p-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("steps")}
              className={`px-3 py-1 rounded font-medium transition ${
                activeTab === "steps"
                  ? "bg-app-surface text-app-text font-bold shadow-xs"
                  : "text-app-muted hover:text-app-text"
              }`}
            >
              {t("plansCenter.stepChecklistTitle")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("triggers")}
              className={`px-3 py-1 rounded font-medium transition ${
                activeTab === "triggers"
                  ? "bg-app-surface text-app-text font-bold shadow-xs"
                  : "text-app-muted hover:text-app-text"
              }`}
            >
              {t("plansCenter.automatedTriggersTitle")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("diff")}
              className={`px-3 py-1 rounded font-medium transition ${
                activeTab === "diff"
                  ? "bg-app-surface text-app-text font-bold shadow-xs"
                  : "text-app-muted hover:text-app-text"
              }`}
            >
              {t("plansCenter.versionHistoryTitle")}
            </button>
          </div>

          {/* TAB 1: Step by Step Checklist */}
          {activeTab === "steps" && (
            <div className="space-y-3">
              {steps.map((st) => (
                <div
                  key={st.step}
                  className="p-3.5 rounded-card border border-app-border bg-app-surface-subtle space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-brand-600/10 text-brand-600 font-bold flex items-center justify-center font-mono text-xs">
                        <Ltr>{st.step}</Ltr>
                      </span>
                      <span className="font-semibold text-app-text">
                        {locale === "ar" ? st.title_ar : st.title_en}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-app-muted">
                      <Ltr>{st.dueOffset}</Ltr>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-app-muted border-t border-app-border pt-1.5">
                    <span>
                      {t("plansCenter.roleLabel")}: <span className="font-medium text-app-text">{st.role}</span>
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-app-surface text-[10px] font-mono border border-app-border">
                      {st.phase}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: Automated Triggers */}
          {activeTab === "triggers" && (
            <div className="rounded-card border border-app-border bg-app-surface-subtle p-4 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-brand-600 font-bold">
                <Zap className="w-4 h-4" />
                <span>{t("plansCenter.ruleHeader")}</span>
              </div>
              <p className="text-[11px] text-app-muted leading-relaxed">
                When SCADA telemetry drops below 40% threshold for &gt; 5 minutes, automatically attach this playbook and dispatch initial SMS/Teams alert to On-Call Engineers.
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-app-border text-[10px] text-app-muted">
                <span>{t("plansCenter.cooldownLabel")} <Ltr>15m</Ltr></span>
                <span>•</span>
                <span>{t("plansCenter.requiresApprovalLabel")}</span>
              </div>
            </div>
          )}

          {/* TAB 3: Version Diff */}
          {activeTab === "diff" && (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-card bg-app-surface-subtle border border-app-border text-app-muted">
                <GitBranch className="w-4 h-4 inline me-1.5 text-brand-600" />
                <span>{t("plansCenter.versionDiffSummary")}</span>
              </div>

              <div className="rounded-card border border-app-border overflow-hidden">
                <div className="p-2.5 bg-severity-critical-tint text-severity-critical font-mono text-[11px]">
                  - Step 2: Isolation required single operator switch trigger.
                </div>
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 font-mono text-[11px] border-t border-app-border">
                  + Step 2: Dual commander authorization mandatory before air-gap execution.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
