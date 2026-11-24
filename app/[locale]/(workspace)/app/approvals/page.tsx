"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Ltr } from "@/components/common/Ltr";
import { ApprovalCard } from "@/components/crisis/display/ApprovalCard";
import { CheckCheck, Clock, CheckCircle2, XCircle, Filter, Sparkles } from "lucide-react";

export default function ApprovalsInboxPage() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const [pendingApprovals, setPendingApprovals] = useState([
    {
      id: "APP-001",
      title: "Bilingual Emergency SMS Broadcast to Sohar Plant On-Call Engineers",
      incidentTitle: "SCADA Telemetry Anomaly (Sohar Plant)",
      incidentSeverity: "critical" as const,
      priorityLane: "now" as const,
      priorityScore: 94,
      channels: ["sms", "teams"],
      audience: "Primary SCADA On-Call Engineers",
      recipientsCount: 14,
      bodyEn:
        "CRITICAL ALERT: SCADA containment active at Sohar Plant. On-call engineers report to Command Room immediately.",
      bodyAr:
        "تنبيه حرج: تفعيل خطة الاحتواء لشبكة سكادا في محطة صحار. على مهندسي المناوبة الحضور فوراً إلى غرفة العمليات.",
      isAiGenerated: true,
      createdAt: "10:11 AM"
    },
    {
      id: "APP-002",
      title: "Regional Water Authority Regulatory Notification",
      incidentTitle: "SCADA Telemetry Anomaly (Sohar Plant)",
      incidentSeverity: "high" as const,
      priorityLane: "now" as const,
      priorityScore: 91,
      channels: ["email"],
      audience: "Oman Water Authority Regulatory Directorate",
      recipientsCount: 3,
      bodyEn:
        "Formal notification regarding temporary 28% throughput modulation on Sohar Desalination Rack 3 following telemetry outlier detection. Municipal water distribution remains stable via backup reservoirs.",
      bodyAr:
        "إشعار رسمي بشأن التعديل المؤقت للإنتاج بنسبة 28% في محطة صحار لتحلية المياه عقب رصد قراءات غير اعتيادية. توزيع المياه للبلدية مستقر ومستمر عبر الخزانات الاحتياطية.",
      isAiGenerated: true,
      createdAt: "10:19 AM"
    },
    {
      id: "APP-003",
      title: "Public Holding Statement for Muscat Press & News Media",
      incidentTitle: "SCADA Telemetry Anomaly (Sohar Plant)",
      incidentSeverity: "medium" as const,
      priorityLane: "next" as const,
      priorityScore: 72,
      channels: ["email"],
      audience: "Accredited Media & Press Agencies",
      recipientsCount: 42,
      bodyEn:
        "Sample Gulf Water & Power Co. confirms routine preventive maintenance checks are currently underway at Sohar Plant. No disruption to residential drinking water supplies has occurred.",
      bodyAr:
        "تؤكد شركة مياه وكهرباء الخليج إجراء فحوصات وقائية روتينية في محطة صحار. لم يحدث أي انقطاع في إمدادات مياه الشرب للمناطق السكنية.",
      isAiGenerated: false,
      createdAt: "10:25 AM"
    }
  ]);

  const [historyItems, setHistoryItems] = useState([
    {
      id: "HIST-001",
      title: "Initial Executive Crisis Committee Teams Briefing",
      status: "approved",
      decisionBy: "Eng. Salem Al-Harthy",
      time: "10:05 AM"
    }
  ]);

  const handleApprove = (id: string) => {
    const item = pendingApprovals.find((x) => x.id === id);
    if (!item) return;
    setPendingApprovals(pendingApprovals.filter((x) => x.id !== id));
    setHistoryItems([
      {
        id: `HIST-${Date.now()}`,
        title: item.title,
        status: "approved",
        decisionBy: "Eng. Salem Al-Harthy",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      },
      ...historyItems
    ]);
    showToast(`Approved & dispatched: "${item.title}"`);
  };

  const handleReject = (id: string, reason: string) => {
    const item = pendingApprovals.find((x) => x.id === id);
    if (!item) return;
    setPendingApprovals(pendingApprovals.filter((x) => x.id !== id));
    setHistoryItems([
      {
        id: `HIST-${Date.now()}`,
        title: item.title,
        status: "rejected",
        decisionBy: `Eng. Salem Al-Harthy (Reason: ${reason})`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      },
      ...historyItems
    ]);
    showToast(`Rejected draft: "${item.title}"`);
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
            {t("nav.approvals")}
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Executive approval inbox for automated & AI-drafted messages, stakeholder alerts, and public statements.
          </p>
        </div>

        {/* Tab switch */}
        <div className="inline-flex rounded-lg border border-border-subtle bg-surface-base p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("pending")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "pending"
                ? "bg-surface-elevated text-text-main shadow-xs font-semibold"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>{t("approvalsCenter.pendingApprovals")} ({pendingApprovals.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "history"
                ? "bg-surface-elevated text-text-main shadow-xs font-semibold"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            <CheckCheck className="h-3.5 w-3.5" />
            <span>{t("approvalsCenter.auditHistory")} ({historyItems.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === "pending" ? (
        <div className="space-y-4">
          {pendingApprovals.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border-subtle p-12 text-center text-xs space-y-2 bg-surface-elevated">
              <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
              <p className="font-semibold text-text-main">{t("approvalsCenter.inboxClear")}</p>
              <p className="text-text-muted">{t("approvalsCenter.inboxClearSub")}</p>
            </div>
          ) : (
            pendingApprovals.map((app) => (
              <ApprovalCard
                key={app.id}
                id={app.id}
                title={app.title}
                incidentTitle={app.incidentTitle}
                incidentSeverity={app.incidentSeverity}
                priorityLane={app.priorityLane}
                priorityScore={app.priorityScore}
                channels={app.channels}
                audience={app.audience}
                recipientsCount={app.recipientsCount}
                bodyEn={app.bodyEn}
                bodyAr={app.bodyAr}
                isAiGenerated={app.isAiGenerated}
                createdAt={app.createdAt}
                onApprove={handleApprove}
                onReject={handleReject}
                onEdit={(id) => showToast(`Opening editor drawer for draft [${id}]`)}
              />
            ))
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4 text-xs">
          <div className="border-b border-border-subtle pb-2 mb-3">
            <h3 className="font-bold text-text-main">{t("approvalsCenter.decisionLogTitle")}</h3>
            <p className="text-[10px] text-text-muted">{t("approvalsCenter.decisionLogSub")}</p>
          </div>

          <div className="divide-y divide-border-subtle">
            {historyItems.map((h) => (
              <div key={h.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-text-main">{h.title}</p>
                  <p className="text-[10px] text-text-muted">{t("approvalsCenter.signedBy")}: {h.decisionBy}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${
                      h.status === "approved"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-critical-500/10 text-critical-400 border border-critical-500/20"
                    }`}
                  >
                    {h.status}
                  </span>
                  <span className="text-[10px] text-text-muted font-mono"><Ltr>{h.time}</Ltr></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
