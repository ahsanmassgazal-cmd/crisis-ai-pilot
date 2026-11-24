"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Fingerprint,
  CheckCircle2,
  AlertTriangle,
  Download,
  Shield,
  Search,
  RefreshCw,
  Hash,
  Activity,
} from "lucide-react";
import { Ltr } from "@/components/layout/Ltr";
import { showToast } from "@/lib/toast";

interface AuditBlock {
  blockIndex: number;
  hash: string;
  prevHash: string;
  timestamp: string;
  actor: string;
  action_en: string;
  action_ar: string;
  details: string;
  tampered?: boolean;
}

export default function AuditPage() {
  const t = useTranslations();
  const locale = useLocale();

  const [search, setSearch] = useState("");
  const [isTampered, setIsTampered] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<"valid" | "tampered">("valid");

  const initialBlocks: AuditBlock[] = [
    {
      blockIndex: 1248,
      hash: "8f4e2b9c71a3d604e5f8a29b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d",
      prevHash: "3a7b1c9d5e2f8a4b6c0d7e3f1a9b5c2d8e4f0a6b7c3d9e5f1a2b8c4d6e0f7a3b",
      timestamp: "2026-11-24T10:45:12Z",
      actor: "usr-001 (Eng. Salim)",
      action_en: "Dual-commander SCADA isolation protocol authorized",
      action_ar: "تفويض بروتوكول عزل SCADA المزدوج من قائد الحادث",
      details: "Signature: ED25519-AUTH-9901-OK",
    },
    {
      blockIndex: 1247,
      hash: "3a7b1c9d5e2f8a4b6c0d7e3f1a9b5c2d8e4f0a6b7c3d9e5f1a2b8c4d6e0f7a3b",
      prevHash: "e5f8a29b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d8f4e2b9c71a3d604",
      timestamp: "2026-11-24T10:30:00Z",
      actor: "SYS_AUTOMATION_ENGINE",
      action_en: "High-priority SMS & Teams notification broadcast triggered",
      action_ar: "إطلاق إشعار عالي الأهمية عبر الرسائل القصيرة و Teams تلقائياً",
      details: "Recipients: 42 responders, delivery target 100%",
    },
    {
      blockIndex: 1246,
      hash: "e5f8a29b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d8f4e2b9c71a3d604",
      prevHash: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      timestamp: "2026-11-24T10:14:22Z",
      actor: "SCADA_INGESTION_AGENT",
      action_en: "Raw telemetry feed threshold breached at Sohar Unit 4",
      action_ar: "تجاوز حد قياسات الحساسات الميدانية بمحطة صحار الوحدة 4",
      details: "Pressure diff: -14.2 bar below tolerance",
    },
    {
      blockIndex: 1245,
      hash: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      prevHash: "9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e",
      timestamp: "2026-11-24T09:55:00Z",
      actor: "usr-003 (Nasser Al-Balushi)",
      action_en: "Crisis Management Team convened via EOC dispatch",
      action_ar: "انعقاد فريق إدارة الأزمات عبر غرفة العمليات المركزية",
      details: "EOC Video Wall session #EOC-889 initialized",
    },
  ];

  const handleVerifyChain = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (isTampered) {
        setVerificationResult("tampered");
        showToast({
          title: t("auditCenter.chainStatusTampered"),
          description: "Hash signature mismatch detected at block 1247.",
          tone: "critical",
        });
      } else {
        setVerificationResult("valid");
        showToast({
          title: t("auditCenter.chainStatusValid"),
          description: "All 1,248 SHA-256 block hashes verified successfully.",
          tone: "brand",
        });
      }
    }, 600);
  };

  const handleToggleTamper = () => {
    const next = !isTampered;
    setIsTampered(next);
    setVerificationResult(next ? "tampered" : "valid");
    showToast({
      title: t("auditCenter.simTamperDemo"),
      description: next
        ? "Simulated bit-flip injected into Block 1247 payload."
        : "Ledger reverted to authentic cryptographic baseline.",
      tone: next ? "amber" : "brand",
    });
  };

  const handleExportForensicZip = () => {
    showToast({
      title: t("auditCenter.exportLedgerZip"),
      description: "Forensic audit bundle (ZIP) containing signed JSON manifest downloaded.",
      tone: "brand",
    });
  };

  const filteredBlocks = initialBlocks.filter((b) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      b.hash.toLowerCase().includes(term) ||
      b.actor.toLowerCase().includes(term) ||
      b.action_en.toLowerCase().includes(term) ||
      b.action_ar.includes(search)
    );
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-app-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Fingerprint className="w-6 h-6 text-brand-600" />
            <h1 className="text-xl font-bold text-app-text">{t("auditCenter.title")}</h1>
          </div>
          <p className="text-xs text-app-muted mt-1">{t("auditCenter.subtitle")}</p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleToggleTamper}
            className={`px-3 py-2 rounded-input text-xs font-bold transition-all border ${
              isTampered
                ? "bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
                : "bg-app-surface border-app-border text-app-text hover:bg-app-surface-subtle"
            }`}
          >
            {t("auditCenter.simTamperDemo")}
          </button>

          <button
            onClick={handleVerifyChain}
            disabled={isVerifying}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-input font-bold text-xs shadow-sm transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? "animate-spin" : ""}`} />
            <span>{t("auditCenter.verifyHashChain")}</span>
          </button>

          <button
            onClick={handleExportForensicZip}
            className="flex items-center gap-2 px-3 py-2 bg-app-surface border border-app-border hover:bg-app-surface-subtle text-app-text rounded-input font-bold text-xs shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t("auditCenter.exportLedgerZip")}</span>
          </button>
        </div>
      </div>

      {/* Verification Status Banner */}
      <div
        className={`p-4 rounded-card border flex items-center justify-between ${
          verificationResult === "valid"
            ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300"
            : "bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-300"
        }`}
      >
        <div className="flex items-center gap-3">
          {verificationResult === "valid" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <div>
            <h2 className="text-xs font-bold">
              {verificationResult === "valid"
                ? t("auditCenter.chainStatusValid")
                : t("auditCenter.chainStatusTampered")}
            </h2>
            <p className="text-[11px] opacity-80 mt-0.5">
              Algorithm: SHA-256 Hash Chaining • Key Rotation: 24h • Immutable Storage Engine
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold bg-white/60 dark:bg-black/40 px-2.5 py-1 rounded">
          <Ltr>1,248</Ltr> {t("auditCenter.blockHashLabel")}
        </span>
      </div>

      {/* Search & Ledger Table */}
      <div className="p-5 bg-app-surface border border-app-border rounded-card space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-app-border pb-3">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-brand-600" />
            <h3 className="text-xs font-bold text-app-text uppercase tracking-wider">
              {t("auditCenter.title")}
            </h3>
          </div>
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
                <th className="p-3 text-start">#</th>
                <th className="p-3 text-start">{t("auditCenter.blockHashLabel")}</th>
                <th className="p-3 text-start">{t("auditCenter.actorLabel")}</th>
                <th className="p-3 text-start">{t("auditCenter.actionLabel")}</th>
                <th className="p-3 text-start">{t("common.timestamp")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border">
              {filteredBlocks.map((blk) => {
                const isBlockTampered = isTampered && blk.blockIndex === 1247;
                return (
                  <tr
                    key={blk.blockIndex}
                    className={`transition-colors ${
                      isBlockTampered
                        ? "bg-rose-50/60 dark:bg-rose-950/30"
                        : "hover:bg-app-surface-subtle/50"
                    }`}
                  >
                    <td className="p-3 font-mono font-bold text-brand-600 whitespace-nowrap">
                      <Ltr>#{blk.blockIndex}</Ltr>
                    </td>
                    <td className="p-3 max-w-xs">
                      <div className="font-mono text-[11px] text-app-text truncate">
                        <Ltr>{isBlockTampered ? "BAD_HASH_MISMATCH_SIMULATION_404" : blk.hash}</Ltr>
                      </div>
                      <div className="font-mono text-[10px] text-app-muted truncate mt-0.5">
                        Prev: <Ltr>{blk.prevHash}</Ltr>
                      </div>
                    </td>
                    <td className="p-3 text-app-text whitespace-nowrap font-medium">
                      {blk.actor}
                    </td>
                    <td className="p-3 text-app-text max-w-sm">
                      <div className="font-semibold">
                        {locale === "ar" ? blk.action_ar : blk.action_en}
                      </div>
                      <div className="text-[10px] text-app-muted mt-0.5">{blk.details}</div>
                    </td>
                    <td className="p-3 font-mono text-app-muted whitespace-nowrap">
                      <Ltr>{blk.timestamp}</Ltr>
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
