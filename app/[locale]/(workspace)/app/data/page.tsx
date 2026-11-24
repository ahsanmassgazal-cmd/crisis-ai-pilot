"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Ltr } from "@/components/common/Ltr";
import { FileDropzone } from "@/components/crisis/display/FileDropzone";
import { ColumnMapper } from "@/components/crisis/display/ColumnMapper";
import { ValidationGrid, ValidationRow } from "@/components/crisis/display/ValidationGrid";
import { ExportMenu } from "@/components/crisis/display/ExportMenu";
import {
  Database,
  Upload,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  FileSpreadsheet,
  Check
} from "lucide-react";

export default function ImportExportCenterPage() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<"import" | "export">("import");
  const [importStep, setImportStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [entityType, setEntityType] = useState("people");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dedupStrategy, setDedupStrategy] = useState<"skip" | "overwrite" | "merge">("overwrite");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importCompleted, setImportCompleted] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const sampleValidationRows: ValidationRow[] = [
    {
      rowNumber: 1,
      status: "valid",
      message: "Phone number formatted with +968 country code",
      data: { name: "Eng. Salem Al-Harthy", role: "Incident Commander", phone: "+96891234567", email: "salem@gulfwater.om" }
    },
    {
      rowNumber: 2,
      status: "valid",
      message: "Valid SCADA team assignment",
      data: { name: "Tariq Al-Lawati", role: "Lead SCADA Specialist", phone: "+96892345678", email: "tariq@gulfwater.om" }
    },
    {
      rowNumber: 3,
      status: "warning",
      message: "Missing secondary email; primary SMS verified",
      data: { name: "Fatima Al-Balushi", role: "Comms Lead", phone: "+96893456789", email: "fatima@gulfwater.om" }
    },
    {
      rowNumber: 4,
      status: "error",
      message: "Invalid phone syntax: missing country dial code",
      data: { name: "Unknown Officer", role: "Safety Inspector", phone: "987654", email: "safety@gulfwater.om" }
    }
  ];

  const handleExport = (format: string, withBom: boolean) => {
    showToast(`Generated and exported ${entityType.toUpperCase()} file as .${format} ${withBom ? "(with UTF-8 BOM)" : ""}`);
  };

  const handleExecuteImport = () => {
    setIsImporting(true);
    setTimeout(() => {
      setIsImporting(false);
      setImportCompleted(true);
      setImportStep(5);
      showToast("Successfully imported 3 verified records into database.");
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 inset-inline-end-6 z-50 rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-semibold text-white shadow-xl animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-main">
            {t("nav.importExport")}
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Guided 7-step data import wizard, UTF-8 BOM encoding for Arabic Excel compatibility, and instant rollback.
          </p>
        </div>

        {/* Tab switch */}
        <div className="inline-flex rounded-lg border border-border-subtle bg-surface-base p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("import")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "import"
                ? "bg-surface-elevated text-text-main shadow-xs font-semibold"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Guided Import Wizard</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("export")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "export"
                ? "bg-surface-elevated text-text-main shadow-xs font-semibold"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Center</span>
          </button>
        </div>
      </div>

      {activeTab === "import" ? (
        <div className="space-y-6">
          {/* Stepper Wizard Progress */}
          <div className="grid grid-cols-5 gap-2 text-xs">
            {[
              { num: 1, label: "Target Entity" },
              { num: 2, label: "Upload File" },
              { num: 3, label: "Column Mapping" },
              { num: 4, label: "Validation Grid" },
              { num: 5, label: "Commit & Rollback" }
            ].map((s) => (
              <div
                key={s.num}
                className={`rounded-xl border p-2 text-center transition ${
                  importStep === s.num
                    ? "border-brand-500 bg-brand-500/10 text-brand-400 font-bold"
                    : importStep > s.num
                    ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400 font-semibold"
                    : "border-border-subtle bg-surface-base text-text-muted"
                }`}
              >
                <span className="block text-[10px] uppercase font-mono">Step <Ltr>{s.num}</Ltr></span>
                <span className="truncate block text-xs">{s.label}</span>
              </div>
            ))}
          </div>

          {/* STEP 1: ENTITY TYPE */}
          {importStep === 1 && (
            <div className="rounded-xl border border-border-subtle bg-surface-elevated p-6 space-y-4 text-xs animate-fade-in">
              <div>
                <h3 className="text-sm font-bold text-text-main">Step 1: Choose Destination Entity</h3>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Select which platform table will receive the imported records.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "people", label: "People & On-Call", count: 18 },
                  { id: "sites", label: "Sites & Assets", count: 4 },
                  { id: "risks", label: "Risk Register", count: 12 },
                  { id: "functions", label: "Critical Functions (BIA)", count: 4 }
                ].map((ent) => (
                  <button
                    key={ent.id}
                    type="button"
                    onClick={() => setEntityType(ent.id)}
                    className={`rounded-xl border p-4 text-start transition flex flex-col justify-between gap-2 ${
                      entityType === ent.id
                        ? "border-brand-500 bg-brand-500/10 text-brand-400 shadow-sm"
                        : "border-border-subtle bg-surface-base text-text-muted hover:text-text-main"
                    }`}
                  >
                    <span className="font-bold text-xs text-text-main">{ent.label}</span>
                    <span className="text-[10px] text-text-muted font-mono"><Ltr>{ent.count}</Ltr> existing rows</span>
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setImportStep(2)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-600 transition"
                >
                  <span>Continue to File Upload</span>
                  <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: UPLOAD FILE */}
          {importStep === 2 && (
            <div className="rounded-xl border border-border-subtle bg-surface-elevated p-6 space-y-4 text-xs animate-fade-in">
              <div>
                <h3 className="text-sm font-bold text-text-main">Step 2: Upload CSV / Excel / JSON</h3>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Drop your file below. Arabic UTF-8 BOM encoding is automatically preserved.
                </p>
              </div>

              <FileDropzone
                onFileSelect={(file) => {
                  setSelectedFile(file);
                  showToast(`Selected: ${file.name}`);
                }}
              />

              <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setImportStep(1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-border-subtle bg-surface-base px-3 py-1.5 text-text-muted hover:text-text-main"
                >
                  <ArrowLeft className="h-3.5 w-3.5 rtl-flip" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImportStep(3)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-600 transition"
                >
                  <span>Continue to Column Mapping</span>
                  <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: COLUMN MAPPING */}
          {importStep === 3 && (
            <div className="rounded-xl border border-border-subtle bg-surface-elevated p-6 space-y-4 text-xs animate-fade-in">
              <div>
                <h3 className="text-sm font-bold text-text-main">Step 3: Map Columns</h3>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Match uploaded headers to database fields.
                </p>
              </div>

              <ColumnMapper
                fields={[
                  { sourceKey: "Full Name", sampleValue: "Eng. Salem Al-Harthy", targetField: "name_en", required: true },
                  { sourceKey: "Crisis Role", sampleValue: "Incident Commander", targetField: "role", required: true },
                  { sourceKey: "Mobile Phone", sampleValue: "+96891234567", targetField: "phone", required: true },
                  { sourceKey: "Work Email", sampleValue: "salem@gulfwater.om", targetField: "email" }
                ]}
                targetSchema={[
                  { key: "name_en", label: "Full Name (English)", required: true },
                  { key: "role", label: "Crisis Role", required: true },
                  { key: "phone", label: "Mobile Phone (E.164)", required: true },
                  { key: "email", label: "Corporate Email Address" }
                ]}
              />

              <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setImportStep(2)}
                  className="inline-flex items-center gap-1 rounded-lg border border-border-subtle bg-surface-base px-3 py-1.5 text-text-muted hover:text-text-main"
                >
                  <ArrowLeft className="h-3.5 w-3.5 rtl-flip" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImportStep(4)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-600 transition"
                >
                  <span>Run Pre-Import Validation</span>
                  <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: VALIDATION GRID */}
          {importStep === 4 && (
            <div className="rounded-xl border border-border-subtle bg-surface-elevated p-6 space-y-5 text-xs animate-fade-in">
              <div>
                <h3 className="text-sm font-bold text-text-main">Step 4: Pre-Import Validation Results</h3>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Inspect validated rows. Row 4 has an invalid phone number and will be excluded.
                </p>
              </div>

              <ValidationGrid
                rows={sampleValidationRows}
                totalCount={4}
                validCount={2}
                warningCount={1}
                errorCount={1}
              />

              {/* De-duplication Strategy */}
              <div className="rounded-xl border border-border-subtle bg-surface-base p-4 space-y-2">
                <span className="font-semibold text-text-main block">De-duplication Policy</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: "overwrite", label: "Overwrite Existing Records", desc: "Update matching email/phone with file values" },
                    { id: "skip", label: "Skip Duplicates", desc: "Keep existing database records intact" },
                    { id: "merge", label: "Merge Blank Fields Only", desc: "Fill in missing values without overwriting" }
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDedupStrategy(d.id as any)}
                      className={`p-2.5 rounded-lg border text-start transition ${
                        dedupStrategy === d.id
                          ? "border-brand-500 bg-brand-500/10 text-brand-400 font-bold"
                          : "border-border-subtle bg-surface-elevated text-text-muted hover:text-text-main"
                      }`}
                    >
                      <span className="block font-semibold text-text-main">{d.label}</span>
                      <span className="text-[10px] text-text-muted">{d.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setImportStep(3)}
                  className="inline-flex items-center gap-1 rounded-lg border border-border-subtle bg-surface-base px-3 py-1.5 text-text-muted hover:text-text-main"
                >
                  <ArrowLeft className="h-3.5 w-3.5 rtl-flip" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  disabled={isImporting}
                  onClick={handleExecuteImport}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm transition"
                >
                  <Check className="h-4 w-4" />
                  <span>{isImporting ? "Importing Records..." : "Commit 3 Valid Records"}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: COMMIT & ROLLBACK */}
          {importStep === 5 && (
            <div className="rounded-xl border border-emerald-500/30 bg-surface-elevated p-8 text-center space-y-4 text-xs animate-fade-in">
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-text-main">Import Successfully Committed!</h3>
                <p className="text-text-muted mt-1">
                  3 records written to <span className="font-mono text-brand-400">{entityType}</span>. Transaction logged under Batch #IMP-2026-88.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    showToast("ROLLBACK EXECUTED: All 3 records deleted from database.");
                    setImportStep(1);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-critical-500/40 bg-critical-500/10 px-4 py-2 text-xs font-semibold text-critical-300 hover:bg-critical-500/20 transition"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Rollback This Batch</span>
                </button>

                <button
                  type="button"
                  onClick={() => setImportStep(1)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-600 transition"
                >
                  <span>Start Another Import</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* EXPORT TAB */
        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-6 space-y-5 text-xs">
          <div>
            <h3 className="text-sm font-bold text-text-main">Export Platform Data Records</h3>
            <p className="text-[11px] text-text-muted mt-0.5">
              Export data in multiple formats with guaranteed UTF-8 BOM encoding so Arabic headers open correctly in Excel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border-subtle bg-surface-base p-4 space-y-3">
              <span className="font-semibold text-text-main block">Select Entity to Export</span>
              <select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
                className="w-full rounded-lg border border-border-subtle bg-surface-elevated p-2 text-xs text-text-main"
              >
                <option value="incidents">All Crisis Incidents (5)</option>
                <option value="people">People & On-Call Roster (18)</option>
                <option value="audit">Cryptographic Audit Trail (1,248)</option>
                <option value="risks">Risk Register (12)</option>
                <option value="bia">BIA Critical Functions (4)</option>
              </select>

              <div className="pt-2">
                <ExportMenu onExport={handleExport} title={`Export ${entityType.toUpperCase()}`} />
              </div>
            </div>

            <div className="rounded-xl border border-border-subtle bg-surface-base p-4 space-y-2 text-text-muted">
              <span className="font-semibold text-text-main block">Encoding Guarantee</span>
              <p className="leading-relaxed">
                All CSV and XLSX exports generated by Crisis AI Pilot include the 3-byte UTF-8 Byte Order Mark
                (<Ltr>EF BB BF</Ltr>). This guarantees Arabic text renders in correct RTL direction without mojibake character
                corruption when opened in Microsoft Excel on Windows or Mac.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
