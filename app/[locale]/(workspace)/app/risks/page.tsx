"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  AlertTriangle,
  Search,
  Shield,
  Filter,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import { Ltr } from "@/components/layout/Ltr";
import { SEED_RISKS } from "@/seed/data";
import { RiskMatrix5x5 } from "@/components/crisis/display/RiskMatrix5x5";

export default function RisksPage() {
  const t = useTranslations();
  const locale = useLocale();

  const [search, setSearch] = useState("");
  const [selectedCell, setSelectedCell] = useState<{ l: number; i: number } | null>(null);

  // Map SEED_RISKS for the matrix component
  const matrixRisks = SEED_RISKS.map((r) => ({
    id: r.id,
    title: locale === "ar" ? r.title_ar : r.title_en,
    likelihood: r.likelihood,
    impact: r.impact,
  }));

  const filteredRisks = SEED_RISKS.filter((r) => {
    if (selectedCell && (r.likelihood !== selectedCell.l || r.impact !== selectedCell.i)) {
      return false;
    }
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      r.title_en.toLowerCase().includes(term) ||
      r.title_ar.includes(search) ||
      r.controls.toLowerCase().includes(term)
    );
  });

  const getScoreBadge = (score: number) => {
    if (score >= 16) {
      return "bg-severity-critical-tint text-severity-critical border-severity-critical/40";
    }
    if (score >= 10) {
      return "bg-severity-high-tint text-severity-high border-severity-high/40";
    }
    if (score >= 5) {
      return "bg-severity-medium-tint text-severity-medium border-severity-medium/40";
    }
    return "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-app-border pb-4">
        <div>
          <h1 className="text-xl font-black text-app-text flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span>{t("risksCenter.title")}</span>
          </h1>
          <p className="text-xs text-app-muted mt-0.5">
            {t("risksCenter.subtitle")}
          </p>
        </div>

        {selectedCell && (
          <button
            type="button"
            onClick={() => setSelectedCell(null)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-input bg-brand-50 text-brand-600 text-xs font-semibold hover:bg-brand-100 transition"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Reset Matrix Filter (L{selectedCell.l} × I{selectedCell.i})</span>
          </button>
        )}
      </div>

      {/* Top 5x5 Matrix Card */}
      <RiskMatrix5x5
        risks={matrixRisks}
        onSelectCell={(l, i) => setSelectedCell({ l, i })}
      />

      {/* Filter / Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative min-w-[280px]">
          <Search className="absolute inset-inline-start-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-app-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("risksCenter.searchPlaceholder")}
            className="w-full rounded-input border border-app-border bg-app-surface ps-8 pe-3 py-1.5 text-xs text-app-text focus:outline-none focus:ring-1 focus:ring-brand-600"
          />
        </div>

        <div className="text-xs text-app-muted">
          Showing <strong className="text-app-text"><Ltr>{filteredRisks.length}</Ltr></strong> of <Ltr>{SEED_RISKS.length}</Ltr> risks
        </div>
      </div>

      {/* Risks Detailed Register Table */}
      <div className="rounded-card border border-app-border bg-app-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-app-surface-subtle border-b border-app-border text-app-muted font-semibold">
              <tr>
                <th className="py-2.5 px-3 text-start">ID</th>
                <th className="py-2.5 px-3 text-start">{t("risksCenter.threatCol")}</th>
                <th className="py-2.5 px-3 text-center">{t("risksCenter.likelihoodCol")}</th>
                <th className="py-2.5 px-3 text-center">{t("risksCenter.impactCol")}</th>
                <th className="py-2.5 px-3 text-center">{t("risksCenter.scoreCol")}</th>
                <th className="py-2.5 px-3 text-start">{t("risksCenter.mitigationsCol")}</th>
                <th className="py-2.5 px-3 text-start">{t("risksCenter.linkedPlanCol")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border">
              {filteredRisks.map((risk) => {
                const score = risk.likelihood * risk.impact;
                return (
                  <tr key={risk.id} className="hover:bg-app-surface-subtle/50 transition">
                    <td className="py-3 px-3 font-mono font-bold text-brand-600">
                      <Ltr>{risk.id}</Ltr>
                    </td>
                    <td className="py-3 px-3 space-y-0.5 max-w-sm">
                      <div className="font-bold text-app-text">
                        {locale === "ar" ? risk.title_ar : risk.title_en}
                      </div>
                      <div className="text-[10px] text-app-muted">
                        {risk.owner}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold">
                      <Ltr>{risk.likelihood}</Ltr>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold">
                      <Ltr>{risk.impact}</Ltr>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded font-black text-xs border ${getScoreBadge(score)}`}>
                        <Ltr>{score}</Ltr>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-app-muted max-w-xs text-[11px] leading-relaxed">
                      {risk.controls}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-brand-600 font-bold bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                        <BookOpen className="w-3 h-3" />
                        <Ltr>{risk.linked_plan_id}</Ltr>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
