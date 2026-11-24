"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Ltr } from "@/components/layout/Ltr";
import { PriorityChip } from "@/components/crisis/atoms/PriorityChip";
import { SeverityBadge } from "@/components/crisis/atoms/SeverityBadge";
import { Check, X, Edit3, Sparkles, Clock, Globe } from "lucide-react";

export interface ApprovalCardProps {
  id: string;
  title: string;
  incidentTitle: string;
  incidentSeverity?: "critical" | "high" | "medium" | "low" | "info";
  priorityLane: "now" | "next" | "later";
  priorityScore: number;
  channels: string[];
  audience: string;
  recipientsCount: number;
  bodyEn: string;
  bodyAr: string;
  isAiGenerated?: boolean;
  createdAt: string;
  onApprove?: (id: string) => void;
  onReject?: (id: string, reason: string) => void;
  onEdit?: (id: string) => void;
}

export function ApprovalCard({
  id,
  title,
  incidentTitle,
  incidentSeverity = "high",
  priorityLane,
  priorityScore,
  channels,
  audience,
  recipientsCount,
  bodyEn,
  bodyAr,
  isAiGenerated = true,
  createdAt,
  onApprove,
  onReject,
  onEdit
}: ApprovalCardProps) {
  const t = useTranslations("components");
  const [activeTab, setActiveTab] = useState<"sideBySide" | "en" | "ar">("sideBySide");
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border-subtle pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <SeverityBadge severity={incidentSeverity} />
            <PriorityChip lane={priorityLane} score={priorityScore} />
            {isAiGenerated && (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/10 px-2 py-0.5 text-[11px] font-medium text-brand-500 border border-brand-500/20">
                <Sparkles className="h-3 w-3" />
                AI draft — needs approval
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-text-main">{title}</h3>
          <p className="text-xs text-text-muted">
            Incident: <span className="text-text-main font-medium">{incidentTitle}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Clock className="h-3.5 w-3.5" />
          <Ltr>{createdAt}</Ltr>
        </div>
      </div>

      {/* Targets metadata */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-surface-base p-2.5 rounded-lg border border-border-subtle">
        <div>
          <span className="text-text-muted block text-[10px]">{t("audience")}</span>
          <span className="font-medium text-text-main">{audience}</span>
        </div>
        <div>
          <span className="text-text-muted block text-[10px]">{t("recipients")}</span>
          <span className="font-medium text-text-main"><Ltr>{recipientsCount.toLocaleString()}</Ltr> contacts</span>
        </div>
        <div>
          <span className="text-text-muted block text-[10px]">{t("channels")}</span>
          <div className="flex items-center gap-1 mt-0.5">
            {channels.map((c) => (
              <span key={c} className="uppercase px-1.5 py-0.5 rounded text-[10px] bg-surface-elevated border border-border-subtle font-medium">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bilingual Content Preview Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-text-muted flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5" /> Bilingual Message Body
          </span>
          <div className="inline-flex rounded-lg border border-border-subtle bg-surface-base p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("sideBySide")}
              className={`rounded px-2 py-0.5 font-medium transition ${
                activeTab === "sideBySide" ? "bg-surface-elevated text-text-main font-semibold shadow-xs" : "text-text-muted"
              }`}
            >
              Side-by-Side
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("en")}
              className={`rounded px-2 py-0.5 font-medium transition ${
                activeTab === "en" ? "bg-surface-elevated text-text-main font-semibold shadow-xs" : "text-text-muted"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ar")}
              className={`rounded px-2 py-0.5 font-medium transition ${
                activeTab === "ar" ? "bg-surface-elevated text-text-main font-semibold shadow-xs" : "text-text-muted"
              }`}
            >
              العربية
            </button>
          </div>
        </div>

        {/* Content Box */}
        {activeTab === "sideBySide" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border-subtle bg-surface-base p-3 text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{t("englishSource")}</span>
              <p className="text-text-main whitespace-pre-line leading-relaxed">{bodyEn}</p>
            </div>
            <div className="rounded-lg border border-border-subtle bg-surface-base p-3 text-xs space-y-1" dir="rtl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">العربية (Arabic)</span>
              <p className="text-text-main whitespace-pre-line leading-relaxed font-arabic">{bodyAr}</p>
            </div>
          </div>
        ) : activeTab === "en" ? (
          <div className="rounded-lg border border-border-subtle bg-surface-base p-3 text-xs space-y-1">
            <p className="text-text-main whitespace-pre-line leading-relaxed">{bodyEn}</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border-subtle bg-surface-base p-3 text-xs space-y-1" dir="rtl">
            <p className="text-text-main whitespace-pre-line leading-relaxed font-arabic">{bodyAr}</p>
          </div>
        )}
      </div>

      {/* Reject Reason input dialog inline */}
      {isRejecting ? (
        <div className="rounded-lg border border-critical-500/30 bg-critical-500/5 p-3 space-y-2">
          <label className="text-xs font-semibold text-critical-400 block">
            Reason for rejection (logged to audit trail)
          </label>
          <input
            type="text"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder={t("rejectPlaceholder")}
            className="w-full rounded-md border border-border-subtle bg-surface-elevated px-3 py-1.5 text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-critical-500"
          />
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsRejecting(false)}
              className="px-2.5 py-1 text-xs rounded border border-border-subtle bg-surface-base text-text-muted hover:text-text-main"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onReject?.(id, rejectReason || "Rejected by commander");
                setIsRejecting(false);
              }}
              className="px-3 py-1 text-xs rounded bg-critical-600 font-medium text-white hover:bg-critical-700"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      ) : (
        /* Action buttons */
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border-subtle pt-3">
          <span className="text-[11px] text-text-muted">
            Rule: <span className="font-mono text-text-main">SEV1_COMM_EXTERNAL_APPROVAL</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsRejecting(true)}
              className="inline-flex items-center gap-1 rounded-lg border border-border-subtle bg-surface-base px-3 py-1.5 text-xs font-medium text-text-muted hover:bg-critical-500/10 hover:text-critical-400 transition"
            >
              <X className="h-3.5 w-3.5" />
              Reject
            </button>

            <button
              type="button"
              onClick={() => onEdit?.(id)}
              className="inline-flex items-center gap-1 rounded-lg border border-border-subtle bg-surface-base px-3 py-1.5 text-xs font-medium text-text-main hover:bg-surface-elevated transition"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit Draft
            </button>

            <button
              type="button"
              onClick={() => onApprove?.(id)}
              className="inline-flex items-center gap-1 rounded-lg bg-brand-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-600 transition"
            >
              <Check className="h-3.5 w-3.5" />
              Approve & Dispatch
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
