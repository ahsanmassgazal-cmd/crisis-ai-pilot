"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Ltr } from "@/components/layout/Ltr";
import { mockRepository } from "@/lib/repo";
import { PriorityChip } from "@/components/crisis/atoms/PriorityChip";
import { SeverityBadge } from "@/components/crisis/atoms/SeverityBadge";
import { StatusBadge } from "@/components/crisis/atoms/StatusBadge";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Filter,
  CheckCheck,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AttentionQueuePage() {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  const queueItems = mockRepository.getAttentionQueue();
  const [items, setItems] = useState(queueItems);
  const [filterLane, setFilterLane] = useState<"all" | "now" | "next" | "later">("all");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const nowCount = items.filter((i) => i.lane === "now").length;
  const nextCount = items.filter((i) => i.lane === "next").length;
  const laterCount = items.filter((i) => i.lane === "later").length;

  const filteredItems = items.filter((item) => {
    if (filterLane === "all") return true;
    return item.lane === filterLane;
  });

  const handleAction = (id: string, actionName: string) => {
    showToast(`Executed: ${actionName} on item [${id}]`);
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const handleBulkAck = () => {
    showToast(`Acknowledged all ${nextCount} items in Next lane.`);
    setItems((prev) => prev.filter((x) => x.lane !== "next"));
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 inset-inline-end-6 z-50 rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-semibold text-white shadow-xl animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-main">
            {t("nav.attentionQueue")}
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Prioritized operational queue powered by algorithmic 0–100 scoring. Ranked into Now / Next / Later.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBulkAck}
            disabled={nextCount === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-elevated px-3 py-1.5 text-xs font-medium text-text-main shadow-xs hover:bg-surface-base disabled:opacity-40 transition"
          >
            <CheckCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Acknowledge All Next ({nextCount})</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => setFilterLane(filterLane === "now" ? "all" : "now")}
          className={`rounded-xl border p-4 text-start transition flex items-center justify-between ${
            filterLane === "now"
              ? "border-critical-500 bg-critical-500/10 shadow-sm"
              : "border-border-subtle bg-surface-elevated hover:border-critical-500/40"
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5 text-critical-400 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="h-4 w-4" />
              <span>{t("attentionQueue.laneNowTitle")}</span>
            </div>
            <p className="text-2xl font-bold text-text-main mt-1">
              <Ltr>{nowCount}</Ltr>
            </p>
            <p className="text-[11px] text-text-muted mt-0.5">{t("attentionQueue.laneNowSub")}</p>
          </div>
          <span className="h-3 w-3 rounded-full bg-critical-500 animate-pulse" />
        </button>

        <button
          type="button"
          onClick={() => setFilterLane(filterLane === "next" ? "all" : "next")}
          className={`rounded-xl border p-4 text-start transition flex items-center justify-between ${
            filterLane === "next"
              ? "border-amber-500 bg-amber-500/10 shadow-sm"
              : "border-border-subtle bg-surface-elevated hover:border-amber-500/40"
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Clock className="h-4 w-4" />
              <span>{t("attentionQueue.laneNextTitle")}</span>
            </div>
            <p className="text-2xl font-bold text-text-main mt-1">
              <Ltr>{nextCount}</Ltr>
            </p>
            <p className="text-[11px] text-text-muted mt-0.5">{t("attentionQueue.laneNextSub")}</p>
          </div>
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
        </button>

        <button
          type="button"
          onClick={() => setFilterLane(filterLane === "later" ? "all" : "later")}
          className={`rounded-xl border p-4 text-start transition flex items-center justify-between ${
            filterLane === "later"
              ? "border-slate-500 bg-slate-500/10 shadow-sm"
              : "border-border-subtle bg-surface-elevated hover:border-slate-500/40"
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4" />
              <span>{t("attentionQueue.laneLaterTitle")}</span>
            </div>
            <p className="text-2xl font-bold text-text-main mt-1">
              <Ltr>{laterCount}</Ltr>
            </p>
            <p className="text-[11px] text-text-muted mt-0.5">{t("attentionQueue.laneLaterSub")}</p>
          </div>
          <span className="h-2.5 w-2.5 rounded-full bg-slate-500" />
        </button>
      </div>

      {/* Main Queue List */}
      <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-text-main">
              Showing {filteredItems.length} Queue Items
            </span>
            {filterLane !== "all" && (
              <span className="text-[11px] text-brand-500 font-medium">
                (Filtered to: {filterLane.toUpperCase()})
              </span>
            )}
          </div>

          <div className="inline-flex rounded-lg border border-border-subtle bg-surface-base p-1 text-xs">
            <button
              type="button"
              onClick={() => setFilterLane("all")}
              className={`px-2.5 py-1 rounded font-medium transition ${
                filterLane === "all" ? "bg-surface-elevated text-text-main shadow-xs" : "text-text-muted"
              }`}
            >
              All (<Ltr>{items.length}</Ltr>)
            </button>
            <button
              type="button"
              onClick={() => setFilterLane("now")}
              className={`px-2.5 py-1 rounded font-medium transition ${
                filterLane === "now" ? "bg-critical-500 text-white shadow-xs" : "text-critical-400"
              }`}
            >
              Now (<Ltr>{nowCount}</Ltr>)
            </button>
            <button
              type="button"
              onClick={() => setFilterLane("next")}
              className={`px-2.5 py-1 rounded font-medium transition ${
                filterLane === "next" ? "bg-amber-500 text-white shadow-xs" : "text-amber-400"
              }`}
            >
              Next (<Ltr>{nextCount}</Ltr>)
            </button>
            <button
              type="button"
              onClick={() => setFilterLane("later")}
              className={`px-2.5 py-1 rounded font-medium transition ${
                filterLane === "later" ? "bg-slate-700 text-white shadow-xs" : "text-slate-400"
              }`}
            >
              Later (<Ltr>{laterCount}</Ltr>)
            </button>
          </div>
        </div>

        {/* List Cards */}
        <div className="space-y-2.5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border p-4 transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                item.lane === "now"
                  ? "border-critical-500/40 bg-critical-500/5 hover:border-critical-500"
                  : item.lane === "next"
                  ? "border-amber-500/30 bg-surface-base hover:border-amber-500/60"
                  : "border-border-subtle bg-surface-base hover:border-border-subtle/80"
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <PriorityChip lane={item.lane} score={item.priorityScore} />
                  <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-surface-elevated border border-border-subtle text-text-muted">
                    {item.reason}
                  </span>
                  <span className="text-xs text-text-muted">
                    Incident:{" "}
                    <Link
                      href={`/${locale}/app/incidents/${item.incidentId}`}
                      className="text-brand-500 hover:underline font-medium"
                    >
                      {item.incidentTitle}
                    </Link>
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-text-main">{item.title}</h3>

                <div className="flex items-center gap-4 text-xs text-text-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {t("attentionQueue.dueWithin", { minutes: item.dueMinutes })}
                  </span>
                  <span>{t("attentionQueue.typeLabel")}: <span className="capitalize text-text-main">{item.type}</span></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/${locale}/app/incidents/${item.incidentId}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-border-subtle bg-surface-elevated px-3 py-1.5 text-xs font-medium text-text-muted hover:text-text-main transition"
                >
                  <span>{t("attentionQueue.viewDetails")}</span>
                  <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
                </Link>

                <button
                  type="button"
                  onClick={() => handleAction(item.id, item.suggestedAction)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold shadow-xs transition ${
                    item.lane === "now"
                      ? "bg-critical-500 text-white hover:bg-critical-600"
                      : "bg-brand-500 text-white hover:bg-brand-600"
                  }`}
                >
                  <span>{item.suggestedAction}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
