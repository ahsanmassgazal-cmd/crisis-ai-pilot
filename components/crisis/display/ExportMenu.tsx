"use client";

import React, { useState } from "react";
import { Download, FileSpreadsheet, FileText, Code, Check } from "lucide-react";

export interface ExportMenuProps {
  onExport: (format: "csv" | "xlsx" | "json" | "pdf", withBom: boolean) => void;
  title?: string;
}

export function ExportMenu({ onExport, title = "Export" }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [withBom, setWithBom] = useState(true);

  return (
    <div className="relative inline-block text-start">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-elevated px-3 py-1.5 text-xs font-semibold text-text-main shadow-xs hover:bg-surface-base transition"
      >
        <Download className="h-3.5 w-3.5 text-brand-500" />
        <span>{title}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute inset-inline-end-0 mt-1.5 w-56 rounded-xl border border-border-subtle bg-surface-elevated p-2 shadow-xl z-50 text-xs space-y-1">
            <div className="px-2 py-1 text-[10px] font-semibold text-text-muted uppercase tracking-wider">
              Choose Export Format
            </div>

            <button
              type="button"
              onClick={() => {
                onExport("csv", withBom);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-text-main hover:bg-surface-base transition"
            >
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
                <span>CSV File (.csv)</span>
              </div>
              <span className="text-[10px] text-text-muted">UTF-8 BOM</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onExport("xlsx", withBom);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-text-main hover:bg-surface-base transition"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
              <span>Excel Workbook (.xlsx)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onExport("json", withBom);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-text-main hover:bg-surface-base transition"
            >
              <Code className="h-3.5 w-3.5 text-indigo-400" />
              <span>Raw JSON Data (.json)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onExport("pdf", withBom);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-text-main hover:bg-surface-base transition"
            >
              <FileText className="h-3.5 w-3.5 text-critical-400" />
              <span>Formatted Executive PDF (.pdf)</span>
            </button>

            <div className="border-t border-border-subtle pt-1 mt-1 px-2 flex items-center justify-between">
              <span className="text-[10px] text-text-muted">Excel Arabic UTF-8 BOM</span>
              <button
                type="button"
                onClick={() => setWithBom(!withBom)}
                className={`h-4 w-4 rounded flex items-center justify-center border ${
                  withBom ? "bg-brand-500 border-brand-500 text-white" : "border-border-subtle"
                }`}
              >
                {withBom && <Check className="h-3 w-3" />}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
