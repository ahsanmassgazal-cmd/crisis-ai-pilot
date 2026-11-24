"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Ltr } from "@/components/layout/Ltr";
import { CheckCircle2, AlertTriangle, XCircle, Search } from "lucide-react";

export interface ValidationRow {
  rowNumber: number;
  status: "valid" | "warning" | "error";
  message?: string;
  data: Record<string, string>;
}

export interface ValidationGridProps {
  rows: ValidationRow[];
  totalCount: number;
  validCount: number;
  warningCount: number;
  errorCount: number;
}

export function ValidationGrid({
  rows,
  totalCount,
  validCount,
  warningCount,
  errorCount
}: ValidationGridProps) {
  const t = useTranslations("components");
  const [filter, setFilter] = useState<"all" | "valid" | "warning" | "error">("all");
  const [search, setSearch] = useState("");

  const filtered = rows.filter((r) => {
    if (filter !== "all" && r.status !== filter) return false;
    if (search) {
      const match = Object.values(r.data).some((v) =>
        v.toLowerCase().includes(search.toLowerCase())
      );
      return match || (r.message && r.message.toLowerCase().includes(search.toLowerCase()));
    }
    return true;
  });

  const columns = rows.length > 0 ? Object.keys(rows[0].data) : [];

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4 space-y-3">
      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="rounded-lg border border-border-subtle bg-surface-base p-2.5 text-xs">
          <span className="text-[10px] text-text-muted uppercase">{t("totalRows")}</span>
          <p className="text-base font-bold text-text-main"><Ltr>{totalCount}</Ltr></p>
        </div>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5 text-xs">
          <span className="text-[10px] text-emerald-500 uppercase flex items-center gap-1 font-medium">
            <CheckCircle2 className="h-3 w-3" /> Valid
          </span>
          <p className="text-base font-bold text-emerald-400"><Ltr>{validCount}</Ltr></p>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-2.5 text-xs">
          <span className="text-[10px] text-amber-500 uppercase flex items-center gap-1 font-medium">
            <AlertTriangle className="h-3 w-3" /> Warnings
          </span>
          <p className="text-base font-bold text-amber-400"><Ltr>{warningCount}</Ltr></p>
        </div>
        <div className="rounded-lg border border-critical-500/20 bg-critical-500/5 p-2.5 text-xs">
          <span className="text-[10px] text-critical-500 uppercase flex items-center gap-1 font-medium">
            <XCircle className="h-3 w-3" /> Errors
          </span>
          <p className="text-base font-bold text-critical-400"><Ltr>{errorCount}</Ltr></p>
        </div>
      </div>

      {/* Filter controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1 inline-flex rounded-lg border border-border-subtle bg-surface-base p-1 text-xs">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-2.5 py-1 rounded font-medium transition ${
              filter === "all" ? "bg-surface-elevated text-text-main shadow-xs" : "text-text-muted"
            }`}
          >
            All (<Ltr>{totalCount}</Ltr>)
          </button>
          <button
            type="button"
            onClick={() => setFilter("error")}
            className={`px-2.5 py-1 rounded font-medium transition ${
              filter === "error" ? "bg-critical-500 text-white shadow-xs" : "text-critical-400"
            }`}
          >
            Errors (<Ltr>{errorCount}</Ltr>)
          </button>
          <button
            type="button"
            onClick={() => setFilter("warning")}
            className={`px-2.5 py-1 rounded font-medium transition ${
              filter === "warning" ? "bg-amber-500 text-white shadow-xs" : "text-amber-400"
            }`}
          >
            Warnings (<Ltr>{warningCount}</Ltr>)
          </button>
          <button
            type="button"
            onClick={() => setFilter("valid")}
            className={`px-2.5 py-1 rounded font-medium transition ${
              filter === "valid" ? "bg-emerald-600 text-white shadow-xs" : "text-emerald-400"
            }`}
          >
            Valid (<Ltr>{validCount}</Ltr>)
          </button>
        </div>

        <div className="relative min-w-[200px]">
          <Search className="absolute inset-inline-start-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchValidated")}
            className="w-full rounded-lg border border-border-subtle bg-surface-base ps-8 pe-3 py-1.5 text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto rounded-lg border border-border-subtle bg-surface-base">
        <table className="w-full text-xs text-start">
          <thead className="bg-surface-elevated text-text-muted border-b border-border-subtle">
            <tr>
              <th className="px-3 py-2 text-start font-semibold w-12">#</th>
              <th className="px-3 py-2 text-start font-semibold w-24">{t("statusLabel")}</th>
              {columns.map((col) => (
                <th key={col} className="px-3 py-2 text-start font-semibold capitalize whitespace-nowrap">
                  {col}
                </th>
              ))}
              <th className="px-3 py-2 text-start font-semibold">{t("validationNotes")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {filtered.slice(0, 50).map((row) => (
              <tr
                key={row.rowNumber}
                className={`hover:bg-surface-elevated/50 transition ${
                  row.status === "error"
                    ? "bg-critical-500/5"
                    : row.status === "warning"
                    ? "bg-amber-500/5"
                    : ""
                }`}
              >
                <td className="px-3 py-2 text-text-muted font-mono"><Ltr>{row.rowNumber}</Ltr></td>
                <td className="px-3 py-2">
                  {row.status === "valid" && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" /> Valid
                    </span>
                  )}
                  {row.status === "warning" && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-400">
                      <AlertTriangle className="h-3 w-3" /> Warning
                    </span>
                  )}
                  {row.status === "error" && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-critical-400">
                      <XCircle className="h-3 w-3" /> Error
                    </span>
                  )}
                </td>
                {columns.map((col) => (
                  <td key={col} className="px-3 py-2 text-text-main whitespace-nowrap">
                    {row.data[col]}
                  </td>
                ))}
                <td className="px-3 py-2 text-[11px] text-text-muted">
                  {row.message || "Passed validation checks."}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
