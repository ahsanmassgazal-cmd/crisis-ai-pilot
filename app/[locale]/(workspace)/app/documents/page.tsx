"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Ltr } from "@/components/common/Ltr";
import { FileDropzone } from "@/components/crisis/display/FileDropzone";
import {
  Folder,
  FolderOpen,
  FileText,
  UploadCloud,
  Clock,
  Sparkles,
  Download,
  History,
  LayoutGrid,
  List,
  AlertTriangle,
  CheckCircle2,
  Search,
  Plus
} from "lucide-react";

export default function DocumentsHubPage() {
  const t = useTranslations();
  const [activeFolder, setActiveFolder] = useState("playbooks");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [search, setSearch] = useState("");
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [activeDocForVersion, setActiveDocForVersion] = useState<any>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const folders = [
    { id: "playbooks", name: "Crisis Playbooks", count: 8 },
    { id: "sops", name: "Standard Operating Procedures", count: 14 },
    { id: "diagrams", name: "Site Architecture & Topology", count: 6 },
    { id: "compliance", name: "ISO 22301 & NCEMA Compliance", count: 5 },
    { id: "postmortems", name: "Historical Post-Mortems", count: 9 }
  ];

  const documents = [
    {
      id: "DOC-01",
      folder: "playbooks",
      title: "CP-DESAL-04: SCADA Telemetry Containment Protocol",
      version: "v3.2",
      size: "2.4 MB",
      format: "PDF",
      updatedAt: "2026-11-20",
      expiresInDays: 140,
      verified: true
    },
    {
      id: "DOC-02",
      folder: "playbooks",
      title: "CP-POWER-02: Substation High-Voltage Islanding SOP",
      version: "v2.1",
      size: "1.8 MB",
      format: "PDF",
      updatedAt: "2026-10-15",
      expiresInDays: 45,
      verified: true
    },
    {
      id: "DOC-03",
      folder: "diagrams",
      title: "Sohar Desalination Plant Zone B SCADA Network Topology",
      version: "v4.0",
      size: "14.2 MB",
      format: "DWG",
      updatedAt: "2026-11-01",
      expiresInDays: 300,
      verified: true
    },
    {
      id: "DOC-04",
      folder: "compliance",
      title: "ISO 22301:2019 Business Continuity Management Certificate",
      version: "v1.0",
      size: "850 KB",
      format: "PDF",
      updatedAt: "2026-01-10",
      expiresInDays: 32,
      verified: true
    },
    {
      id: "DOC-05",
      folder: "sops",
      title: "SOP-COMM-01: National Media Holding Statement Standards",
      version: "v2.0",
      size: "620 KB",
      format: "DOCX",
      updatedAt: "2026-08-14",
      expiresInDays: 180,
      verified: true
    }
  ];

  const filtered = documents.filter((doc) => {
    if (activeFolder !== "all" && doc.folder !== activeFolder) return false;
    if (search && !doc.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleAiExtract = () => {
    showToast("AI Copilot analyzing document: 6 tasks and 3 escalation triggers extracted into new playbook draft!");
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
            {t("nav.documents")}
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Centralized document hub with cryptographic version history, expiry reminders, and AI plan extraction.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAiExtract}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:opacity-95 transition"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t("documentsCenter.extractPlanWithAi")}</span>
          </button>
        </div>
      </div>

      {/* Expiry Reminders Banner */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-300 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
          <span>
            Document Expiry Alert: <strong className="text-white">ISO 22301</strong> expires in{" "}
            <strong className="text-white"><Ltr>32</Ltr> {t("common.days")}</strong>. Review scheduled for next audit cycle.
          </span>
        </div>
        <button
          type="button"
          onClick={() => showToast("Opening renewal checklist...")}
          className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition"
        >
          Review Renewal
        </button>
      </div>

      {/* Main Grid: Folder Tree on Left, Files on Right */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Folder Tree */}
        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4 space-y-2 text-xs">
          <span className="font-bold text-text-main block border-b border-border-subtle pb-2">
            Repository Folders
          </span>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setActiveFolder("all")}
              className={`w-full flex items-center justify-between p-2 rounded-lg font-medium transition ${
                activeFolder === "all"
                  ? "bg-brand-500/10 text-brand-400 font-bold"
                  : "text-text-muted hover:bg-surface-base hover:text-text-main"
              }`}
            >
              <span>{t("documentsCenter.allDocuments")}</span>
              <span className="text-[10px] font-mono"><Ltr>{documents.length}</Ltr></span>
            </button>

            {folders.map((f) => {
              const isActive = activeFolder === f.id;
              const Icon = isActive ? FolderOpen : Folder;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFolder(f.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg font-medium transition ${
                    isActive
                      ? "bg-brand-500/10 text-brand-400 font-bold"
                      : "text-text-muted hover:bg-surface-base hover:text-text-main"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Icon className="h-4 w-4 shrink-0 text-brand-500" />
                    <span className="truncate">{f.name}</span>
                  </div>
                  <span className="text-[10px] font-mono"><Ltr>{f.count}</Ltr></span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-border-subtle">
            <span className="text-[10px] font-semibold text-text-muted uppercase block mb-2">{t("documentsCenter.uploadDocument")}</span>
            <FileDropzone onFileSelect={(file) => showToast(`Uploaded "${file.name}" to repository.`)} />
          </div>
        </div>

        {/* Files View */}
        <div className="md:col-span-3 space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border-subtle bg-surface-elevated p-3 text-xs">
            <div className="relative min-w-[240px]">
              <Search className="absolute inset-inline-start-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("documentsCenter.searchPlaceholder")}
                className="w-full rounded-lg border border-border-subtle bg-surface-base ps-8 pe-3 py-1.5 text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div className="inline-flex rounded-lg border border-border-subtle bg-surface-base p-1">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded transition ${
                  viewMode === "grid" ? "bg-surface-elevated text-text-main shadow-xs" : "text-text-muted"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded transition ${
                  viewMode === "table" ? "bg-surface-elevated text-text-main shadow-xs" : "text-text-muted"
                }`}
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Grid / Table View */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {filtered.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-xl border border-border-subtle bg-surface-elevated p-4 flex flex-col justify-between gap-3 hover:border-brand-500/40 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="rounded-lg bg-brand-500/10 p-2 text-brand-400">
                        <FileText className="h-5 w-5" />
                      </div>
                      <span className="font-mono text-[10px] font-bold text-brand-400 bg-surface-base px-1.5 py-0.5 rounded border border-border-subtle">
                        {doc.version}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-text-main text-xs line-clamp-2">{doc.title}</h4>
                      <p className="text-[10px] text-text-muted mt-1">
                        {doc.format} • <Ltr>{doc.size}</Ltr> • {t("documentsCenter.expiresIn")} <Ltr>{doc.expiresInDays}</Ltr>d
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border-subtle pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveDocForVersion(doc);
                        setShowVersionModal(true);
                      }}
                      className="inline-flex items-center gap-1 text-[10px] text-text-muted hover:text-text-main"
                    >
                      <History className="h-3 w-3" />
                      <span>History</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => showToast(`Downloaded: ${doc.title}`)}
                      className="inline-flex items-center gap-1 text-[10px] text-brand-400 font-semibold hover:underline"
                    >
                      <Download className="h-3 w-3" />
                      <span>{t("common.download")}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4 text-xs">
              <table className="w-full text-start">
                <thead className="border-b border-border-subtle text-text-muted">
                  <tr>
                    <th className="py-2 text-start">{t("documentsCenter.documentTitle")}</th>
                    <th className="py-2 text-start">{t("common.version")}</th>
                    <th className="py-2 text-start">{t("common.size")}</th>
                    <th className="py-2 text-start">{t("common.expiry")}</th>
                    <th className="py-2 text-end">{t("common.actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {filtered.map((doc) => (
                    <tr key={doc.id} className="hover:bg-surface-base">
                      <td className="py-2.5 font-semibold text-text-main">{doc.title}</td>
                      <td className="py-2.5 font-mono text-brand-400">{doc.version}</td>
                      <td className="py-2.5 text-text-muted font-mono"><Ltr>{doc.size}</Ltr></td>
                      <td className="py-2.5 text-text-muted"><Ltr>{doc.expiresInDays}</Ltr> days</td>
                      <td className="py-2.5 text-end">
                        <button
                          type="button"
                          onClick={() => showToast(`Downloaded ${doc.title}`)}
                          className="text-brand-400 font-semibold hover:underline"
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Version History Modal */}
      {showVersionModal && activeDocForVersion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-border-subtle bg-surface-elevated p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
                <History className="h-4 w-4 text-brand-500" />
                Version History: {activeDocForVersion.version}
              </h3>
              <button
                type="button"
                onClick={() => setShowVersionModal(false)}
                className="text-text-muted hover:text-text-main"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {[
                { v: "v3.2 (Active)", date: "2026-11-20", author: "Eng. Salem Al-Harthy", note: "Updated secondary RO valve isolation instructions" },
                { v: "v3.1", date: "2026-06-12", author: "Tariq Al-Lawati", note: "Added SCADA WAN failover section" },
                { v: "v3.0", date: "2026-01-05", author: "Compliance Office", note: "Annual ISO 22301 alignment revision" }
              ].map((ver, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-border-subtle bg-surface-base space-y-1">
                  <div className="flex items-center justify-between font-semibold text-text-main">
                    <span className="font-mono text-brand-400">{ver.v}</span>
                    <span className="text-[10px] text-text-muted font-mono"><Ltr>{ver.date}</Ltr></span>
                  </div>
                  <p className="text-[11px] text-text-muted">{ver.note}</p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-text-muted">
                    <span>By: {ver.author}</span>
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          showToast(`Restored version ${ver.v}`);
                          setShowVersionModal(false);
                        }}
                        className="text-brand-400 hover:underline font-semibold"
                      >
                        Restore This Version
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
