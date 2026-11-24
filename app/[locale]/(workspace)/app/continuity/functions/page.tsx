"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Cpu,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  ArrowRight,
  Shield,
  Activity,
} from "lucide-react";
import { Ltr } from "@/components/layout/Ltr";
import { StatusBadge } from "@/components/crisis/atoms/StatusBadge";
import { SlaRing } from "@/components/crisis/display/SlaRing";
import { showToast } from "@/lib/toast";

export default function CriticalFunctionsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const functions = [
    {
      id: "CF-WATER-01",
      code: "CF-WATER-01",
      title_en: "Potable Water Desalination Generation",
      title_ar: "إنتاج مياه الشرب المحلاة",
      category: "Operations",
      status: "monitoring" as const,
      rtoMinutes: 120,
      rpoMinutes: 30,
      mtpdMinutes: 480,
      slaUsedPercent: 65,
      remainingMinutes: 42,
      site: "Sohar Plant Units 1-4",
      dependencies: ["Primary Power Grid", "Industrial SCADA Loop", "Chlorine Dosing Inlets"],
      slaStatus: "at_risk" as const,
    },
    {
      id: "CF-SCADA-02",
      code: "CF-SCADA-02",
      title_en: "Industrial OT / SCADA Telemetry Monitoring",
      title_ar: "مراقبة القياس عن بُعد لشبكات التحكم الصناعي SCADA",
      category: "Industrial IT",
      status: "active" as const,
      rtoMinutes: 30,
      rpoMinutes: 5,
      mtpdMinutes: 120,
      slaUsedPercent: 80,
      remainingMinutes: 6,
      site: "Central Control Operations Hub",
      dependencies: ["OT Gateway Firewalls", "Redundant Microwave WAN"],
      slaStatus: "breached" as const,
    },
    {
      id: "CF-LAB-03",
      code: "CF-LAB-03",
      title_en: "Water Quality Verification & Bacterial Testing",
      title_ar: "فحص ومطابقة جودة المياه والتحليل البكتيري",
      category: "Compliance",
      status: "resolved" as const,
      rtoMinutes: 240,
      rpoMinutes: 60,
      mtpdMinutes: 720,
      slaUsedPercent: 25,
      remainingMinutes: 180,
      site: "Muscat Central Laboratories",
      dependencies: ["Spectrometry Lab Feeders", "Emergency Reagents Reserve"],
      slaStatus: "normal" as const,
    },
    {
      id: "CF-COMM-04",
      code: "CF-COMM-04",
      title_en: "National Emergency Public & Civil Defense Comms",
      title_ar: "اتصالات الطوارئ الوطنية والدفاع المدني",
      category: "Communications",
      status: "resolved" as const,
      rtoMinutes: 15,
      rpoMinutes: 1,
      mtpdMinutes: 60,
      slaUsedPercent: 12,
      remainingMinutes: 13,
      site: "Civil Emergency Telecom Grid",
      dependencies: ["TETRA Radio Mast Network", "Satellite Satellite Uplink"],
      slaStatus: "normal" as const,
    },
  ];

  const filteredFunctions = functions.filter((fn) => {
    const matchesSearch =
      !search ||
      fn.code.toLowerCase().includes(search.toLowerCase()) ||
      fn.title_en.toLowerCase().includes(search.toLowerCase()) ||
      fn.title_ar.includes(search);
    const matchesStatus = statusFilter === "all" || fn.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-app-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-6 h-6 text-brand-600" />
            <h1 className="text-xl font-bold text-app-text">{t("nav.criticalFunctions")}</h1>
          </div>
          <p className="text-xs text-app-muted mt-1">{t("biaCenter.subtitle")}</p>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-app-muted absolute start-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("biaCenter.criticalFunctionsTab")}
              className="ps-9 pe-3 py-1.5 text-xs bg-app-surface border border-app-border rounded-input text-app-text focus:outline-none focus:ring-1 focus:ring-brand-500 w-56"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-app-surface border border-app-border rounded-input text-app-text focus:outline-none"
          >
            <option value="all">{t("common.all")}</option>
            <option value="active">{t("status.active")}</option>
            <option value="monitoring">{t("status.monitoring")}</option>
            <option value="resolved">{t("status.resolved")}</option>
          </select>
        </div>
      </div>

      {/* Critical Functions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFunctions.map((fn) => (
          <div
            key={fn.id}
            className="p-5 bg-app-surface border border-app-border rounded-card hover:border-brand-300 transition-all space-y-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded">
                    <Ltr>{fn.code}</Ltr>
                  </span>
                  <span className="text-xs text-app-muted font-medium">{fn.category}</span>
                </div>
                <h2 className="text-base font-bold text-app-text mt-1.5">
                  {locale === "ar" ? fn.title_ar : fn.title_en}
                </h2>
                <div className="text-xs text-app-muted mt-0.5 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-brand-500" />
                  <span>{fn.site}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={fn.status} />
                <SlaRing
                  totalMinutes={fn.rtoMinutes}
                  elapsedMinutes={fn.rtoMinutes - fn.remainingMinutes}
                  size={48}
                  strokeWidth={4}
                />
              </div>
            </div>

            {/* Metrics Band */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-app-surface-subtle border border-app-border rounded-input text-xs text-center">
              <div>
                <span className="text-app-muted block text-[10px] uppercase font-bold">{t("biaCenter.rtoLabel")}</span>
                <span className="font-bold text-app-text mt-0.5 block">
                  <Ltr>{fn.rtoMinutes}m</Ltr>
                </span>
              </div>
              <div>
                <span className="text-app-muted block text-[10px] uppercase font-bold">{t("biaCenter.rpoLabel")}</span>
                <span className="font-bold text-app-text mt-0.5 block">
                  <Ltr>{fn.rpoMinutes}m</Ltr>
                </span>
              </div>
              <div>
                <span className="text-app-muted block text-[10px] uppercase font-bold">{t("biaCenter.mtpdLabel")}</span>
                <span className="font-bold text-app-text mt-0.5 block">
                  <Ltr>{fn.mtpdMinutes}m</Ltr>
                </span>
              </div>
            </div>

            {/* Dependencies */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-app-muted uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-brand-600" />
                {t("biaCenter.upstreamDeps")}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {fn.dependencies.map((dep, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 bg-app-surface-subtle border border-app-border rounded text-app-text"
                  >
                    {dep}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
