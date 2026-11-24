"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  ShieldCheck,
  FileDown,
  Clock,
  ArrowLeft,
  Activity,
  CheckCircle2,
  FileArchive,
  Lock,
} from "lucide-react";
import { Ltr } from "@/components/layout/Ltr";
import { useRepo, Message } from "@/lib/repo";
import { generateEvidenceZip } from "@/lib/engine/export";
import { showToast } from "@/lib/toast";

export default function StakeholderPortalPage() {
  const t = useTranslations();
  const repo = useRepo();

  const [approvedMessage, setApprovedMessage] = useState<Message | null>(null);
  const [downloadingZip, setDownloadingZip] = useState(false);

  useEffect(() => {
    async function loadData() {
      const msgs = await repo.messages.getAll();
      const approved = msgs.find((m) => m.status === "approved") || msgs[0];
      if (approved) setApprovedMessage(approved);
    }
    loadData();
  }, [repo]);

  const handleDownloadEvidenceZip = async () => {
    setDownloadingZip(true);
    try {
      const { zipBlob } = await generateEvidenceZip(repo, "inc-2026-001");
      const url = URL.createObjectURL(zipBlob as Blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `crisis_evidence_pack_inc_2026_001.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast({
        title: "Evidence ZIP Generated",
        description: "Official ZIP downloaded with manifest.json and SHA-256 checksums.",
        tone: "emerald",
      });
    } catch (e) {
      console.error(e);
      showToast({
        title: "Download Failed",
        description: "Could not generate evidence ZIP.",
        tone: "rose",
      });
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col font-sans">
      {/* Calm, branded header */}
      <header className="border-b border-app-border bg-app-surface px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/app" className="text-app-muted hover:text-brand-600 transition-colors">
            <ArrowLeft className="w-4 h-4 dir-aware-flip" />
          </Link>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
            <h1 className="font-bold text-base text-app-text">
              {t("portals.stakeholderPortal")}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-app-muted">{t("portal.orgLabel")}:</span>
          <span className="font-bold text-app-text">{t("tenants.gulf_water")}</span>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-4xl w-full mx-auto space-y-6">
        {/* Approved Incident Briefing */}
        <div className="p-6 rounded-card bg-app-surface border border-app-border space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-app-border pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                {t("portal.officialExecutiveUpdate")}
              </span>
              <span className="text-xs text-app-muted font-mono">
                <Clock className="w-3.5 h-3.5 inline me-1" />
                <Ltr>2026-11-24 06:20 GST</Ltr>
              </span>
            </div>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t("portal.approvedByCommander")}</span>
            </span>
          </div>

          <h2 className="text-lg font-bold text-app-text">
            {approvedMessage?.subject_en || t("portal.incidentBriefingTitle")}
          </h2>

          <div className="prose text-xs text-app-text/90 leading-relaxed space-y-2">
            <p>
              {approvedMessage?.body_en ||
                "At 06:15 GST, technical telemetry sensors detected an anomaly within Section 4 of the Sohar plant. Backup analog controls have engaged automatically to ensure safe continuous potable water generation."}
            </p>
            <p>
              <strong>{t("portal.publicSupplyImpact")}:</strong> Nil. Strategic reserve tanks across Muscat and Al Batinah remain at 96% capacity, representing over 72 hours of uninterrupted water distribution.
            </p>
            <p>
              <strong>{t("portal.nextBriefing")}:</strong> 08:00 GST.
            </p>
          </div>

          <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-app-border">
            <div className="flex items-center gap-1.5 text-xs text-app-muted">
              <Lock className="w-3.5 h-3.5 text-brand-600" />
              <span>{t("portal.confidentialClassification")}</span>
            </div>

            <button
              onClick={handleDownloadEvidenceZip}
              disabled={downloadingZip}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-brand-600 text-white rounded-input text-xs font-semibold hover:bg-brand-hover shadow-sm transition disabled:opacity-50"
            >
              <FileArchive className="w-4 h-4" />
              <span>{downloadingZip ? "Generating..." : t("portal.downloadEvidenceZip")}</span>
            </button>
          </div>
        </div>

        {/* Operational Status Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-card bg-app-surface border border-app-border space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-app-muted">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span>{t("portal.waterContinuity")}</span>
            </div>
            <div className="text-2xl font-black text-emerald-600">{t("portal.stable")}</div>
            <p className="text-[11px] text-app-muted">
              Secondary distribution networks operational without disruption.
            </p>
          </div>

          <div className="p-4 rounded-card bg-app-surface border border-app-border space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-app-muted">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <span>{t("portal.reportingCompliance")}</span>
            </div>
            <div className="text-2xl font-black text-brand-600">{t("portal.onTrack")}</div>
            <p className="text-[11px] text-app-muted">
              Mandatory 1-hour public authority notice submitted within SLA.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
