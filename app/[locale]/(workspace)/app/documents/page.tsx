"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Ltr } from "@/components/layout/Ltr";
import { FileDropzone } from "@/components/crisis/display/FileDropzone";
import {
  Folder,
  FolderOpen,
  FileText,
  Clock,
  Sparkles,
  Download,
  History,
  LayoutGrid,
  List,
  AlertTriangle,
  CheckCircle2,
  Search,
  Shield,
  FileArchive,
} from "lucide-react";
import { useRepo, DocumentItem } from "@/lib/repo";
import { showToast } from "@/lib/toast";

export default function DocumentsHubPage() {
  const t = useTranslations();
  const repo = useRepo();

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [activeFolder, setActiveFolder] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [search, setSearch] = useState("");
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [activeDocForVersion, setActiveDocForVersion] = useState<DocumentItem | null>(null);
  const [aiDraftExtracted, setAiDraftExtracted] = useState(false);

  const loadDocs = async () => {
    const all = await repo.documents.getAll();
    setDocuments(all);
  };

  useEffect(() => {
    loadDocs();
  }, [repo]);

  const folders = [
    { id: "policy", name: "Policies & Standards", count: documents.filter((d) => d.category === "policy").length },
    { id: "sop", name: "Operational SOPs", count: documents.filter((d) => d.category === "sop").length },
    { id: "diagram", name: "Architecture Diagrams", count: documents.filter((d) => d.category === "diagram").length },
    { id: "agreement", name: "Vendor SLA Agreements", count: documents.filter((d) => d.category === "agreement").length },
  ];

  const filtered = documents.filter((doc) => {
    if (activeFolder !== "all" && doc.category !== activeFolder) return false;
    if (search && !doc.title_en.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleFileUpload = async (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const cat: DocumentItem["category"] =
      ext === "svg" || ext === "dwg" ? "diagram" : file.name.includes("SOP") ? "sop" : "policy";

    const created = await repo.documents.create({
      id: `doc-${Date.now()}`,
      tenant_id: "gulf_water",
      title_en: file.name,
      title_ar: `وثيقة تشغيلية: ${file.name}`,
      category: cat,
      version: "1.0",
      updated_at: new Date().toISOString(),
      file_size_kb: Math.round(file.size / 1024),
      mime_type: file.type || "application/octet-stream",
    });

    await repo.audit.append({
      tenant_id: "gulf_water",
      actor_id: "usr-001",
      actor_role: "commander",
      action: "DOCUMENT_UPLOADED",
      entity: "document",
      entity_id: created.id,
      after_json: { title: created.title_en, sizeKb: created.file_size_kb },
      reason: `Uploaded ${created.title_en} to document repository.`,
      ip_hint: "10.200.4.1",
      created_at: new Date().toISOString(),
    });

    await loadDocs();
    showToast({
      title: "Document Uploaded",
      description: `"${file.name}" saved to repository and IndexedDB.`,
      tone: "emerald",
    });
  };

  const handleAiExtract = () => {
    setAiDraftExtracted(true);
    showToast({
      title: t("documentsCenter.extractPlanAi"),
      description: "AI Copilot extracted 8 operational tasks and 3 escalation triggers into new draft playbook.",
      tone: "brand",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-app-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-app-text">
            {t("documentsCenter.title")}
          </h1>
          <p className="text-xs text-app-muted mt-1">
            {t("documentsCenter.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAiExtract}
            className="inline-flex items-center gap-1.5 rounded-input bg-purple-600 hover:bg-purple-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t("documentsCenter.extractPlanAi")}</span>
          </button>
        </div>
      </div>

      {/* AI Extraction Banner if generated */}
      {aiDraftExtracted && (
        <div className="rounded-card border border-purple-500/40 bg-purple-500/10 p-4 text-xs space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30">
              <Sparkles className="w-3 h-3" />
              <span>{t("documentsCenter.aiDraftBadge")}</span>
            </span>
            <span className="text-[10px] text-app-muted">{t("documentsCenter.modelSonnet")}</span>
          </div>
          <div className="font-semibold text-app-text">
            Extracted Playbook: CP-DESAL-05 Reverse Osmosis Membrane Emergency Isolation
          </div>
          <p className="text-app-muted">
            8 tactical steps mapped directly to Sohar Plant SCADA controllers with assigned roles (Commander, HSE Director, Hydraulics Lead).
          </p>
        </div>
      )}

      {/* Expiry Reminders Banner */}
      <div className="rounded-card border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-700 dark:text-amber-300 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
          <span>{t("documentsCenter.expiryAlert")}</span>
        </div>
        <button
          type="button"
          onClick={() =>
            showToast({
              title: t("documentsCenter.reviewRenewal"),
              description: "Opening regulatory recertification audit schedule...",
              tone: "amber",
            })
          }
          className="px-2.5 py-1 rounded-input bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition"
        >
          {t("documentsCenter.reviewRenewal")}
        </button>
      </div>

      {/* Main Grid: Folder Tree on Left, Files on Right */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Folder Tree */}
        <div className="rounded-card border border-app-border bg-app-surface p-4 space-y-3 text-xs">
          <span className="font-bold text-app-text block border-b border-app-border pb-2">
            {t("documentsCenter.repoFolders")}
          </span>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setActiveFolder("all")}
              className={`w-full flex items-center justify-between p-2 rounded-input font-medium transition ${
                activeFolder === "all"
                  ? "bg-brand-500/10 text-brand-600 font-bold"
                  : "text-app-muted hover:bg-app-surface-subtle hover:text-app-text"
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
                  className={`w-full flex items-center justify-between p-2 rounded-input font-medium transition ${
                    isActive
                      ? "bg-brand-500/10 text-brand-600 font-bold"
                      : "text-app-muted hover:bg-app-surface-subtle hover:text-app-text"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Icon className="h-4 w-4 shrink-0 text-brand-600" />
                    <span className="truncate">{f.name}</span>
                  </div>
                  <span className="text-[10px] font-mono"><Ltr>{f.count}</Ltr></span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-app-border">
            <span className="text-[10px] font-semibold text-app-muted uppercase block mb-2">
              {t("documentsCenter.uploadDocument")}
            </span>
            <FileDropzone onFileSelect={handleFileUpload} />
          </div>
        </div>

        {/* Files View */}
        <div className="md:col-span-3 space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-app-border bg-app-surface p-3 text-xs">
            <div className="relative min-w-[240px]">
              <Search className="absolute inset-inline-start-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-app-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("documentsCenter.searchPlaceholder")}
                className="w-full rounded-input border border-app-border bg-app-surface-subtle ps-8 pe-3 py-1.5 text-xs text-app-text focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div className="inline-flex rounded-input border border-app-border bg-app-surface-subtle p-1">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded transition ${
                  viewMode === "grid" ? "bg-app-surface text-app-text shadow-xs" : "text-app-muted"
                }`}
                aria-label={t("documentsCenter.gridView")}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded transition ${
                  viewMode === "table" ? "bg-app-surface text-app-text shadow-xs" : "text-app-muted"
                }`}
                aria-label={t("documentsCenter.tableView")}
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
                  className="rounded-card border border-app-border bg-app-surface p-4 flex flex-col justify-between gap-3 hover:border-brand-500/40 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="rounded-input bg-brand-500/10 p-2 text-brand-600">
                        <FileText className="h-5 w-5" />
                      </div>
                      <span className="font-mono text-[10px] font-bold text-brand-600 bg-app-surface-subtle px-1.5 py-0.5 rounded border border-app-border">
                        v{doc.version}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-app-text text-xs line-clamp-2">{doc.title_en}</h4>
                      <p className="text-[10px] text-app-muted mt-1">
                        {doc.category.toUpperCase()} • <Ltr>{doc.file_size_kb}</Ltr> {t("documentsCenter.kbUnit")}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-app-border pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveDocForVersion(doc);
                        setShowVersionModal(true);
                      }}
                      className="inline-flex items-center gap-1 text-[10px] text-app-muted hover:text-app-text"
                    >
                      <History className="h-3 w-3" />
                      <span>{t("documentsCenter.history")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        showToast({
                          title: t("documentsCenter.download"),
                          description: `Downloaded ${doc.title_en}`,
                          tone: "emerald",
                        })
                      }
                      className="inline-flex items-center gap-1 text-[10px] text-brand-600 font-semibold hover:underline"
                    >
                      <Download className="h-3 w-3" />
                      <span>{t("documentsCenter.download")}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-card border border-app-border bg-app-surface p-4 text-xs">
              <table className="w-full text-start">
                <thead className="border-b border-app-border text-app-muted">
                  <tr>
                    <th className="py-2 text-start">{t("documentsCenter.documentTitle")}</th>
                    <th className="py-2 text-start">{t("documentsCenter.category")}</th>
                    <th className="py-2 text-start">{t("documentsCenter.version")}</th>
                    <th className="py-2 text-start">{t("documentsCenter.size")}</th>
                    <th className="py-2 text-end">{t("documentsCenter.action")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border">
                  {filtered.map((doc) => (
                    <tr key={doc.id} className="hover:bg-app-surface-subtle">
                      <td className="py-2.5 font-semibold text-app-text">{doc.title_en}</td>
                      <td className="py-2.5 uppercase font-mono text-app-muted">{doc.category}</td>
                      <td className="py-2.5 font-mono text-brand-600">v{doc.version}</td>
                      <td className="py-2.5 text-app-muted font-mono"><Ltr>{doc.file_size_kb}</Ltr> {t("documentsCenter.kbUnit")}</td>
                      <td className="py-2.5 text-end">
                        <button
                          type="button"
                          onClick={() =>
                            showToast({
                              title: t("documentsCenter.download"),
                              description: `Downloaded ${doc.title_en}`,
                              tone: "emerald",
                            })
                          }
                          className="text-brand-600 font-semibold hover:underline"
                        >
                          {t("documentsCenter.download")}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-card border border-app-border bg-app-surface p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-app-border pb-3">
              <h3 className="text-sm font-bold text-app-text flex items-center gap-2">
                <History className="h-4 w-4 text-brand-600" />
                <span>{t("documentsCenter.versionHistoryTitle")}: v{activeDocForVersion.version}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowVersionModal(false)}
                className="text-app-muted hover:text-app-text font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {[
                { v: `v${activeDocForVersion.version} (Active)`, date: "2026-11-20", author: "Eng. Salim Al-Harthy", note: "Current operational baseline in IndexedDB" },
                { v: "v1.1", date: "2026-06-12", author: "Saif Al-Kharusi", note: "Updated secondary telemetry controller mapping" },
                { v: "v1.0", date: "2026-01-05", author: "Compliance Office", note: "Initial document revision" },
              ].map((ver, idx) => (
                <div key={idx} className="p-3 rounded-input border border-app-border bg-app-surface-subtle space-y-1">
                  <div className="flex items-center justify-between font-semibold text-app-text">
                    <span className="font-mono text-brand-600">{ver.v}</span>
                    <span className="text-[10px] text-app-muted font-mono"><Ltr>{ver.date}</Ltr></span>
                  </div>
                  <p className="text-[11px] text-app-muted">{ver.note}</p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-app-muted">
                    <span>By: {ver.author}</span>
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          showToast({
                            title: t("documentsCenter.restoreVersion"),
                            description: `Restored version ${ver.v} as current active document.`,
                            tone: "brand",
                          });
                          setShowVersionModal(false);
                        }}
                        className="text-brand-600 hover:underline font-semibold"
                      >
                        {t("documentsCenter.restoreVersion")}
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
