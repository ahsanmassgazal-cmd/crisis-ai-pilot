"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowLeft,
  Smartphone,
  ShieldCheck,
  MapPin,
  ListTodo,
} from "lucide-react";
import { Ltr } from "@/components/layout/Ltr";
import { useRepo, Task, Delivery } from "@/lib/repo";
import { showToast } from "@/lib/toast";
import { demoSync } from "@/lib/engine/sync";

export default function ResponderAppPage() {
  const t = useTranslations();
  const repo = useRepo();

  const [responseStatus, setResponseStatus] = useState<"safe" | "help" | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeDelivery, setActiveDelivery] = useState<Delivery | null>(null);

  useEffect(() => {
    async function loadData() {
      const allTasks = await repo.tasks.getAll();
      setTasks(allTasks.slice(0, 3));

      const deliveries = await repo.deliveries.getAll();
      const latest = deliveries.find((d) => d.state === "delivered" || d.state === "sending");
      if (latest) {
        setActiveDelivery(latest);
      }
    }
    loadData();
  }, [repo]);

  const handleAcknowledgeSafe = async () => {
    setResponseStatus("safe");

    if (activeDelivery) {
      await repo.deliveries.update(activeDelivery.id, {
        state: "acknowledged",
        acked_at: new Date().toISOString(),
      });
    }

    // Log in audit ledger
    await repo.audit.append({
      tenant_id: "gulf_water",
      actor_id: "usr-001",
      actor_role: "responder",
      action: "RESPONDER_ACKNOWLEDGED_SAFE",
      entity: "delivery",
      entity_id: activeDelivery?.id || "deliv-active",
      after_json: { status: "safe", acknowledgedAt: new Date().toISOString() },
      reason: "Responder tapped 'I am safe & acknowledged' button in Mobile PWA.",
      ip_hint: "10.200.4.15",
      created_at: new Date().toISOString(),
    });

    showToast({
      title: t("responder.imSafeAcked"),
      description: "Acknowledgment securely transmitted to Incident Room.",
      tone: "emerald",
    });

    demoSync.broadcast({
      type: "DELIVERY_ACKNOWLEDGED",
      deliveryId: activeDelivery?.id || "deliv-active",
      status: "safe",
      timestamp: new Date().toISOString(),
    });
  };

  const handleNeedHelp = async () => {
    setResponseStatus("help");

    // Log critical distress alert
    await repo.audit.append({
      tenant_id: "gulf_water",
      actor_id: "usr-001",
      actor_role: "responder",
      action: "RESPONDER_DISTRESS_ALERT_RAISED",
      entity: "incident",
      entity_id: "inc-2026-001",
      after_json: { status: "help_required", priority: "URGENT_EVACUATION" },
      reason: "Emergency distress signal raised from Responder PWA.",
      ip_hint: "10.200.4.15",
      created_at: new Date().toISOString(),
    });

    showToast({
      title: "URGENT Distress Signal Sent",
      description: "Emergency dispatch and Incident Commander notified of your location.",
      tone: "rose",
    });
  };

  const handleToggleTask = async (taskId: string) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;

    const newStatus = target.status === "done" ? "doing" : "done";
    await repo.tasks.update(taskId, { status: newStatus });

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    showToast({
      title: `Task Updated: ${newStatus.toUpperCase()}`,
      description: target.title_en,
      tone: newStatus === "done" ? "emerald" : "brand",
    });
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col items-center justify-start p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md space-y-5">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-app-border pb-3">
          <div className="flex items-center gap-2">
            <Link href="/app" aria-label={t("common.back")} className="text-app-muted hover:text-brand-600 transition-colors">
              <ArrowLeft className="w-4 h-4 dir-aware-flip" />
            </Link>
            <div className="flex items-center gap-1.5 font-bold text-sm">
              <Smartphone className="w-4 h-4 text-brand-600" />
              <span>{t("portals.responderApp")}</span>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300 font-bold">
            ON-CALL
          </span>
        </div>

        {/* Current Active Emergency Alert Card */}
        <div className="p-4 rounded-card border-2 border-status-critical bg-app-surface shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-status-critical">
              <Bell className="w-4 h-4 animate-bounce shrink-0" />
              <span>{t("responder.criticalAlert")}</span>
            </div>
            <span className="text-[11px] font-mono text-app-muted">
              <Clock className="w-3 h-3 inline me-1" />
              <Ltr>06:16</Ltr> GST
            </span>
          </div>

          <h2 className="font-bold text-base text-app-text">
            SCADA Telemetry Disruption — Evacuate Section 4
          </h2>

          <p className="text-xs text-app-muted leading-relaxed">
            All engineering and maintenance personnel in Sohar Desalination Plant Section 4 must report to Assembly Point B immediately.
          </p>

          <div className="flex items-center gap-1.5 text-[11px] text-app-muted pt-1">
            <MapPin className="w-3.5 h-3.5 text-status-critical shrink-0" />
            <span>{t("responder.plantLocation")}</span>
          </div>

          {/* Big Action Buttons (Fitts's Law) */}
          <div className="pt-2 space-y-2">
            <button
              onClick={handleAcknowledgeSafe}
              data-testid="responder-im-safe-btn"
              className={`w-full py-3.5 px-4 rounded-input font-bold text-sm flex items-center justify-center gap-2 shadow transition-all ${
                responseStatus === "safe"
                  ? "bg-emerald-600 text-white ring-2 ring-emerald-400"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{t("responder.imSafeAcked")}</span>
            </button>

            <button
              onClick={handleNeedHelp}
              className={`w-full py-3.5 px-4 rounded-input font-bold text-sm flex items-center justify-center gap-2 border transition-all ${
                responseStatus === "help"
                  ? "bg-status-critical text-white"
                  : "border-status-critical text-status-critical hover:bg-status-critical/10"
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
              <span>{t("responder.needHelp")}</span>
            </button>
          </div>

          {responseStatus && (
            <div className="text-center text-xs font-semibold text-emerald-600 pt-1">
              ✓ Status recorded in live Incident Command ledger
            </div>
          )}
        </div>

        {/* Assigned Responder Tasks */}
        <div className="rounded-card bg-app-surface border border-app-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-app-text uppercase tracking-wider flex items-center gap-1.5">
              <ListTodo className="w-4 h-4 text-brand-600" />
              <span>My Assigned Tasks ({tasks.length})</span>
            </h3>
            <span className="text-[10px] font-mono text-app-muted">{t("responder.sla15m")}</span>
          </div>

          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleToggleTask(task.id)}
                className={`p-3 rounded-input border text-xs cursor-pointer flex items-center justify-between transition ${
                  task.status === "done"
                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-600"
                    : "bg-app-surface-subtle border-app-border text-app-text hover:bg-app-border/40"
                }`}
              >
                <div className="space-y-0.5 truncate me-2">
                  <div className={`font-semibold truncate ${task.status === "done" ? "line-through text-app-muted" : ""}`}>
                    {task.title_en}
                  </div>
                  <div className="text-[10px] text-app-muted font-mono">
                    Due in <Ltr>{task.due_minutes}</Ltr>m • Priority {task.priority.toUpperCase()}
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded flex items-center justify-center border shrink-0 ${
                    task.status === "done"
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "border-app-border"
                  }`}
                >
                  {task.status === "done" && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Channel Verification Status */}
        <div className="p-3 rounded-card bg-app-surface border border-app-border flex items-center justify-between text-xs text-app-muted">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{t("responder.smsTeamsVerification")}</span>
          </div>
          <span className="text-emerald-600 font-bold font-mono">{t("responder.verifiedStatus")}</span>
        </div>
      </div>
    </div>
  );
}
