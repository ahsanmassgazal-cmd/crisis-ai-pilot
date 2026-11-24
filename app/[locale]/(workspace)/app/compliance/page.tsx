"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  ShieldCheck,
  Download,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Shield,
  Layers,
  Search,
} from "lucide-react";
import { Ltr } from "@/components/layout/Ltr";
import { ProgressRing } from "@/components/crisis/display/ProgressRing";
import { showToast } from "@/lib/toast";

export default function CompliancePage() {
  const t = useTranslations();
  const locale = useLocale();
  const [search, setSearch] = useState("");

  const controls = [
    {
      id: "ISO-8.2.2",
      standard: "ISO 22301",
      clause: "Clause 8.2.2",
      description_en: "Business impact analysis determines impact over time of disruptions to critical operations",
      description_ar: "تحديد تحليل الأثر على الأعمال لتقدير التبعات الزمنية لأي تعطل في العمليات الحيوية",
      evidence: "BIA Matrix v3.2 & SCADA MTPD Curves",
      status: "compliant",
    },
    {
      id: "ISO-8.4.2",
      standard: "ISO 22301",
      clause: "Clause 8.4.2",
      description_en: "Documented business continuity plans establish specific recovery procedures and roles",
      description_ar: "خطط استمرارية أعمال موثقة تحدد إجراءات وأدوار الاستعادة التفصيلية",
      evidence: "Playbooks CP-DESAL-04 & CP-CYBER-01",
      status: "compliant",
    },
    {
      id: "NCEMA-7000-5",
      standard: "NCEMA 7000",
      clause: "Section 5.3",
      description_en: "National critical infrastructure multi-agency emergency communication broadcast protocol",
      description_ar: "بروتوكول البث والتواصل الطارئ المشترك بين الجهات للبنية التحتية الوطنية الحيوية",
      evidence: "Multi-channel SMS, Voice & Teams Gateway Logs",
      status: "compliant",
    },
    {
      id: "GCC-UTIL-09",
      standard: "GCC Utility Directives",
      clause: "Directive 9.1",
      description_en: "Bilingual incident notification to regional environmental regulatory authority within 60 minutes",
      description_ar: "إخطار طارئ ثنائي اللغة للجهة التنظيمية البيئية الإقليمية خلال 60 دقيقة",
      evidence: "Regulatory Notice Generator & Delivery Receipts",
      status: "compliant",
    },
  ];

  const filteredControls = controls.filter((ctrl) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      ctrl.clause.toLowerCase().includes(term) ||
      ctrl.standard.toLowerCase().includes(term) ||
      ctrl.description_en.toLowerCase().includes(term) ||
      ctrl.description_ar.includes(search)
    );
  });

  const handleGenerateZip = () => {
    showToast({
      title: t("complianceCenter.generateAuditPack"),
      description: "Forensic auditor evidence archive bundle (ZIP) downloaded.",
      tone: "brand",
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-app-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-brand-600" />
            <h1 className="text-xl font-bold text-app-text">{t("complianceCenter.title")}</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
              {t("complianceCenter.verifiedStatus")}
            </span>
          </div>
          <p className="text-xs text-app-muted mt-1">{t("complianceCenter.subtitle")}</p>
        </div>

        {/* Generate ZIP */}
        <button
          onClick={handleGenerateZip}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-input font-bold text-xs shadow-sm transition-all"
        >
          <Download className="w-4 h-4" />
          <span>{t("complianceCenter.generateAuditPack")}</span>
        </button>
      </div>

      {/* Compliance Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 bg-app-surface border border-app-border rounded-card flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-bold text-app-muted uppercase tracking-wider block">
              {t("complianceCenter.iso22301Score")}
            </span>
            <div className="text-2xl font-black text-app-text mt-1"><Ltr>96%</Ltr></div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">{t("complianceCenter.fullConformance")}</span>
          </div>
          <ProgressRing value={96} size={54} strokeWidth={5} tone="brand" />
        </div>

        <div className="p-5 bg-app-surface border border-app-border rounded-card flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-bold text-app-muted uppercase tracking-wider block">
              {t("complianceCenter.ncemaScore")}
            </span>
            <div className="text-2xl font-black text-app-text mt-1"><Ltr>91%</Ltr></div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">{t("complianceCenter.standardAligned")}</span>
          </div>
          <ProgressRing value={91} size={54} strokeWidth={5} tone="emerald" />
        </div>

        <div className="p-5 bg-app-surface border border-app-border rounded-card flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-bold text-app-muted uppercase tracking-wider block">
              {t("complianceCenter.gccMandatesScore")}
            </span>
            <div className="text-2xl font-black text-app-text mt-1"><Ltr>100%</Ltr></div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">{t("complianceCenter.auditReady")}</span>
          </div>
          <ProgressRing value={100} size={54} strokeWidth={5} tone="brand" />
        </div>
      </div>

      {/* Mandatory Controls Checklist */}
      <div className="p-5 bg-app-surface border border-app-border rounded-card space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-app-border pb-3">
          <h2 className="text-base font-bold text-app-text">{t("complianceCenter.controlsListTitle")}</h2>
          <div className="relative">
            <Search className="w-4 h-4 text-app-muted absolute start-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("risksCenter.searchPlaceholder")}
              className="ps-9 pe-3 py-1.5 text-xs bg-app-surface border border-app-border rounded-input text-app-text focus:outline-none focus:ring-1 focus:ring-brand-500 w-56"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-app-surface-subtle text-app-muted uppercase font-bold text-[10px] border-b border-app-border">
              <tr>
                <th className="p-3 text-start">{t("complianceCenter.clauseCol")}</th>
                <th className="p-3 text-start">{t("complianceCenter.controlCol")}</th>
                <th className="p-3 text-start">{t("complianceCenter.evidenceCol")}</th>
                <th className="p-3 text-start">{t("complianceCenter.statusCol")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border">
              {filteredControls.map((ctrl) => (
                <tr key={ctrl.id} className="hover:bg-app-surface-subtle/50 transition-colors">
                  <td className="p-3 font-mono font-bold text-brand-600 whitespace-nowrap">
                    <Ltr>{ctrl.clause}</Ltr>
                    <span className="block text-[10px] text-app-muted font-normal">{ctrl.standard}</span>
                  </td>
                  <td className="p-3 text-app-text max-w-md">
                    {locale === "ar" ? ctrl.description_ar : ctrl.description_en}
                  </td>
                  <td className="p-3 text-app-muted font-medium">
                    <span className="flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                      <span>{ctrl.evidence}</span>
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] uppercase">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{t("complianceCenter.compliant")}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
