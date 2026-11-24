"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  BarChart3,
  Clock,
  TrendingDown,
  Layers,
  Network,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { Ltr } from "@/components/layout/Ltr";
import { ProgressRing } from "@/components/crisis/display/ProgressRing";
import { StatusBadge } from "@/components/crisis/atoms/StatusBadge";
import { showToast } from "@/lib/toast";

export default function BiaPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<"functions" | "curves" | "tree">("functions");
  const [selectedFunctionId, setSelectedFunctionId] = useState("cf-01");

  const criticalFunctions = [
    {
      id: "cf-01",
      code: "CF-WATER-01",
      name_en: "Potable Water Desalination Generation",
      name_ar: "إنتاج مياه الشرب المحلاة",
      category: "Operations",
      rtoHours: 2,
      rpoHours: 0.5,
      mtpdHours: 8,
      status: "monitoring" as const,
      slaUsagePercent: 65,
      impact1h: "low",
      impact4h: "moderate",
      impact24h: "critical",
      impact72h: "catastrophic",
      upstream: ["Sohar Plant Unit 1-4", "Primary Substation Grid", "Chlorine Dosing Inlets"],
      downstream: ["Muscat Booster Pump Hub", "Capital Municipal Reservoir Network", "Industrial Port Supply"],
    },
    {
      id: "cf-02",
      code: "CF-PUMP-02",
      name_en: "High-Pressure Transmission Pumping",
      name_ar: "ضخ شبكات النقل الرئيسية عالية الضغط",
      category: "Distribution",
      rtoHours: 1,
      rpoHours: 0.25,
      mtpdHours: 4,
      status: "active" as const,
      slaUsagePercent: 15,
      impact1h: "moderate",
      impact4h: "critical",
      impact24h: "catastrophic",
      impact72h: "catastrophic",
      upstream: ["Sohar Main High-Pressure Header", "Backup Diesel Turbines"],
      downstream: ["Batinah Transmission Pipeline", "Nizwa Regional Distribution Terminal"],
    },
    {
      id: "cf-03",
      code: "CF-LAB-03",
      name_en: "Industrial Water Quality Verification & Compliance",
      name_ar: "فحص ومطابقة جودة المياه وفق المواصفات القياسية",
      category: "Compliance",
      rtoHours: 4,
      rpoHours: 1,
      mtpdHours: 12,
      status: "resolved" as const,
      slaUsagePercent: 30,
      impact1h: "low",
      impact4h: "low",
      impact24h: "moderate",
      impact72h: "critical",
      upstream: ["Central Laboratory Spectrometry", "Online Turbidity Analyzers"],
      downstream: ["Municipal Health Certification", "Public Distribution Release"],
    },
    {
      id: "cf-04",
      code: "CF-GRID-04",
      name_en: "Emergency Municipal Grid Distribution",
      name_ar: "التوزيع الطارئ لشبكات المياه البلدية",
      category: "Emergency",
      rtoHours: 0.75,
      rpoHours: 0.15,
      mtpdHours: 3,
      status: "active" as const,
      slaUsagePercent: 10,
      impact1h: "critical",
      impact4h: "catastrophic",
      impact24h: "catastrophic",
      impact72h: "catastrophic",
      upstream: ["Nizwa Regional Storage Reservoir", "Emergency Gravity Tanks"],
      downstream: ["Local Hospital Feeds", "Emergency Relief Stations"],
    },
  ];

  const selectedFunc =
    criticalFunctions.find((f) => f.id === selectedFunctionId) || criticalFunctions[0];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-app-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-brand-600" />
            <h1 className="text-xl font-bold text-app-text">{t("biaCenter.title")}</h1>
          </div>
          <p className="text-xs text-app-muted mt-1">{t("biaCenter.subtitle")}</p>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-app-surface-subtle border border-app-border rounded-input text-xs">
          <button
            onClick={() => setActiveTab("functions")}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              activeTab === "functions"
                ? "bg-app-surface text-brand-600 shadow-sm font-semibold"
                : "text-app-muted hover:text-app-text"
            }`}
          >
            {t("biaCenter.criticalFunctionsTab")}
          </button>
          <button
            onClick={() => setActiveTab("curves")}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              activeTab === "curves"
                ? "bg-app-surface text-brand-600 shadow-sm font-semibold"
                : "text-app-muted hover:text-app-text"
            }`}
          >
            {t("biaCenter.impactCurvesTab")}
          </button>
          <button
            onClick={() => setActiveTab("tree")}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              activeTab === "tree"
                ? "bg-app-surface text-brand-600 shadow-sm font-semibold"
                : "text-app-muted hover:text-app-text"
            }`}
          >
            {t("biaCenter.dependencyTreeTab")}
          </button>
        </div>
      </div>

      {/* Main Tab 1: Critical Functions */}
      {activeTab === "functions" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Function Selector List */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-app-muted">
              {t("biaCenter.criticalFunctionsTab")}
            </h2>
            <div className="space-y-2">
              {criticalFunctions.map((func) => {
                const isSelected = func.id === selectedFunctionId;
                return (
                  <div
                    key={func.id}
                    onClick={() => setSelectedFunctionId(func.id)}
                    className={`p-4 rounded-card border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-brand-50/20 border-brand-500 shadow-sm"
                        : "bg-app-surface border-app-border hover:border-brand-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded">
                        <Ltr>{func.code}</Ltr>
                      </span>
                      <StatusBadge status={func.status} />
                    </div>
                    <h3 className="text-sm font-semibold text-app-text mt-2">
                      {locale === "ar" ? func.name_ar : func.name_en}
                    </h3>
                    <div className="grid grid-cols-3 gap-2 mt-3 text-[11px] text-app-muted pt-2 border-t border-app-border/40">
                      <div>
                        <span>{t("biaCenter.rtoLabel")}: </span>
                        <span className="font-semibold text-app-text">
                          <Ltr>{func.rtoHours}h</Ltr>
                        </span>
                      </div>
                      <div>
                        <span>{t("biaCenter.rpoLabel")}: </span>
                        <span className="font-semibold text-app-text">
                          <Ltr>{func.rpoHours}h</Ltr>
                        </span>
                      </div>
                      <div>
                        <span>{t("biaCenter.mtpdLabel")}: </span>
                        <span className="font-semibold text-app-text">
                          <Ltr>{func.mtpdHours}h</Ltr>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Function View */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-5 bg-app-surface border border-app-border rounded-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-app-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded">
                      <Ltr>{selectedFunc.code}</Ltr>
                    </span>
                    <span className="text-xs text-app-muted">{selectedFunc.category}</span>
                  </div>
                  <h2 className="text-base font-bold text-app-text mt-1">
                    {locale === "ar" ? selectedFunc.name_ar : selectedFunc.name_en}
                  </h2>
                </div>
                <StatusBadge status={selectedFunc.status} />
              </div>

              {/* RTO / RPO / MTPD Progress Rings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-app-surface-subtle border border-app-border rounded-card flex items-center gap-4">
                  <ProgressRing
                    value={Math.min(100, Math.round((selectedFunc.rtoHours / selectedFunc.mtpdHours) * 100))}
                    size={52}
                    strokeWidth={5}
                    tone="brand"
                  />
                  <div>
                    <div className="text-[11px] text-app-muted">{t("biaCenter.rtoLabel")}</div>
                    <div className="text-base font-bold text-app-text">
                      <Ltr>{selectedFunc.rtoHours}h</Ltr>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-app-surface-subtle border border-app-border rounded-card flex items-center gap-4">
                  <ProgressRing
                    value={Math.min(100, Math.round((selectedFunc.rpoHours / selectedFunc.rtoHours) * 100))}
                    size={52}
                    strokeWidth={5}
                    tone="amber"
                  />
                  <div>
                    <div className="text-[11px] text-app-muted">{t("biaCenter.rpoLabel")}</div>
                    <div className="text-base font-bold text-app-text">
                      <Ltr>{selectedFunc.rpoHours}h</Ltr>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-app-surface-subtle border border-app-border rounded-card flex items-center gap-4">
                  <ProgressRing
                    value={100}
                    size={52}
                    strokeWidth={5}
                    tone="rose"
                  />
                  <div>
                    <div className="text-[11px] text-app-muted">{t("biaCenter.mtpdLabel")}</div>
                    <div className="text-base font-bold text-app-text">
                      <Ltr>{selectedFunc.mtpdHours}h</Ltr>
                    </div>
                  </div>
                </div>
              </div>

              {/* Impact Over Time Cards */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-app-text uppercase tracking-wider">
                  {t("biaCenter.impactCurvesTab")}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-input">
                    <div className="font-semibold text-blue-900 dark:text-blue-300">
                      {t("biaCenter.impactHour1")}
                    </div>
                    <div className="text-[11px] text-app-muted mt-1 uppercase font-bold">
                      {selectedFunc.impact1h}
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-input">
                    <div className="font-semibold text-amber-900 dark:text-amber-300">
                      {t("biaCenter.impactHour4")}
                    </div>
                    <div className="text-[11px] text-app-muted mt-1 uppercase font-bold">
                      {selectedFunc.impact4h}
                    </div>
                  </div>
                  <div className="p-3 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-input">
                    <div className="font-semibold text-rose-900 dark:text-rose-300">
                      {t("biaCenter.impactHour24")}
                    </div>
                    <div className="text-[11px] text-app-muted mt-1 uppercase font-bold">
                      {selectedFunc.impact24h}
                    </div>
                  </div>
                  <div className="p-3 bg-red-100/50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 rounded-input">
                    <div className="font-semibold text-red-950 dark:text-red-200">
                      {t("biaCenter.impactHour72")}
                    </div>
                    <div className="text-[11px] text-app-muted mt-1 uppercase font-bold">
                      {selectedFunc.impact72h}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dependencies Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-app-border">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-app-text flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-brand-600" />
                    {t("biaCenter.upstreamDeps")}
                  </h4>
                  <ul className="space-y-1 text-xs text-app-muted">
                    {selectedFunc.upstream.map((dep, idx) => (
                      <li key={idx} className="p-2 bg-app-surface-subtle border border-app-border rounded-input flex items-center justify-between">
                        <span>{dep}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-status-normal shrink-0" />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-app-text flex items-center gap-1.5">
                    <Network className="w-3.5 h-3.5 text-amber-600" />
                    {t("biaCenter.downstreamDeps")}
                  </h4>
                  <ul className="space-y-1 text-xs text-app-muted">
                    {selectedFunc.downstream.map((dep, idx) => (
                      <li key={idx} className="p-2 bg-app-surface-subtle border border-app-border rounded-input flex items-center justify-between">
                        <span>{dep}</span>
                        <AlertTriangle className="w-3.5 h-3.5 text-status-degraded shrink-0" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 2: Impact Curves */}
      {activeTab === "curves" && (
        <div className="p-5 bg-app-surface border border-app-border rounded-card space-y-6">
          <div>
            <h2 className="text-base font-bold text-app-text">{t("biaCenter.impactCurvesTab")}</h2>
            <p className="text-xs text-app-muted mt-1">{t("biaCenter.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criticalFunctions.map((fn) => (
              <div key={fn.id} className="p-4 bg-app-surface-subtle border border-app-border rounded-card space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-brand-600">
                    <Ltr>{fn.code}</Ltr>
                  </span>
                  <StatusBadge status={fn.status} />
                </div>
                <h3 className="font-semibold text-sm text-app-text">
                  {locale === "ar" ? fn.name_ar : fn.name_en}
                </h3>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-app-muted">{t("biaCenter.impactHour1")}</span>
                    <span className="font-semibold text-blue-600 uppercase text-[11px]">{fn.impact1h}</span>
                  </div>
                  <div className="w-full bg-app-border h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-[25%]" />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-app-muted">{t("biaCenter.impactHour4")}</span>
                    <span className="font-semibold text-amber-600 uppercase text-[11px]">{fn.impact4h}</span>
                  </div>
                  <div className="w-full bg-app-border h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[60%]" />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-app-muted">{t("biaCenter.impactHour24")}</span>
                    <span className="font-semibold text-rose-600 uppercase text-[11px]">{fn.impact24h}</span>
                  </div>
                  <div className="w-full bg-app-border h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full w-[85%]" />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-app-muted">{t("biaCenter.impactHour72")}</span>
                    <span className="font-semibold text-red-700 uppercase text-[11px]">{fn.impact72h}</span>
                  </div>
                  <div className="w-full bg-app-border h-1.5 rounded-full overflow-hidden">
                    <div className="bg-red-600 h-full w-[100%]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Tab 3: Dependency Tree */}
      {activeTab === "tree" && (
        <div className="p-5 bg-app-surface border border-app-border rounded-card space-y-6">
          <div>
            <h2 className="text-base font-bold text-app-text">{t("biaCenter.dependencyTreeTab")}</h2>
            <p className="text-xs text-app-muted mt-1">{t("biaCenter.subtitle")}</p>
          </div>
          <div className="space-y-4">
            {criticalFunctions.map((fn) => (
              <div key={fn.id} className="p-4 border border-app-border rounded-card bg-app-surface-subtle space-y-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-brand-600" />
                  <span className="font-bold text-sm text-app-text">
                    {locale === "ar" ? fn.name_ar : fn.name_en}
                  </span>
                  <span className="text-xs text-app-muted font-mono">
                    (<Ltr>{fn.code}</Ltr>)
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-app-surface border border-app-border rounded-input space-y-1.5">
                    <div className="font-semibold text-brand-600">{t("biaCenter.upstreamDeps")}</div>
                    {fn.upstream.map((up, i) => (
                      <div key={i} className="flex items-center gap-2 text-app-muted">
                        <ArrowRight className="w-3 h-3 text-brand-400 dir-aware-flip shrink-0" />
                        <span>{up}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-app-surface border border-app-border rounded-input space-y-1.5">
                    <div className="font-semibold text-amber-600">{t("biaCenter.downstreamDeps")}</div>
                    {fn.downstream.map((down, i) => (
                      <div key={i} className="flex items-center gap-2 text-app-muted">
                        <ArrowRight className="w-3 h-3 text-amber-400 dir-aware-flip shrink-0" />
                        <span>{down}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
