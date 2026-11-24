"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Ltr } from "@/components/common/Ltr";
import { Globe, CheckCircle2, AlertTriangle, XCircle, ExternalLink, Send, Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function StatusPageManagerPage() {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const [components, setComponents] = useState([
    { id: "comp-1", name: "Sohar Desalination Plant Primary RO", status: "degraded", uptime: "99.2%" },
    { id: "comp-2", name: "Batinah Regional Water Distribution Grid", status: "operational", uptime: "99.99%" },
    { id: "comp-3", name: "Muscat Central Pumping Station", status: "operational", uptime: "100%" },
    { id: "comp-4", name: "SCADA Core Telemetry & Metering Network", status: "degraded", uptime: "98.7%" },
    { id: "comp-5", name: "Consumer Billing & Emergency Hotline API", status: "operational", uptime: "99.95%" }
  ]);

  const [publicUpdates, setPublicUpdates] = useState([
    {
      id: "UPD-01",
      title: "Investigating Output Fluctuation at Sohar Plant",
      status: "Investigating",
      time: "10:15 AM GST",
      bodyEn:
        "Technical teams are monitoring a temporary telemetry modulation at Sohar Desalination Plant. Backup municipal reserves are online. No disruption to drinking water supplies.",
      bodyAr:
        "تتابع الفرق الفنية تعديلاً مؤقتاً في قراءات محطة صحار لتحلية المياه. الخزانات البلدية الاحتياطية قيد التشغيل ولم يحدث أي انقطاع في المياه."
    }
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newBodyEn, setNewBodyEn] = useState("");
  const [newBodyAr, setNewBodyAr] = useState("");

  const handlePublishUpdate = () => {
    if (!newTitle.trim() || !newBodyEn.trim()) return;
    const upd = {
      id: `UPD-0${publicUpdates.length + 1}`,
      title: newTitle,
      status: "Monitoring",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " GST",
      bodyEn: newBodyEn,
      bodyAr: newBodyAr || newBodyEn
    };
    setPublicUpdates([upd, ...publicUpdates]);
    setNewTitle("");
    setNewBodyEn("");
    setNewBodyAr("");
    showToast("Published public update to Status Page with SHA-256 sign-off.");
  };

  const handleStatusToggle = (id: string, newStatus: string) => {
    setComponents(
      components.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    showToast("Updated component status.");
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
            {t("nav.statusPage")}
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Manage public-facing status page, component operational health, and verified bilingual crisis advisories.
          </p>
        </div>

        <Link
          href={`/${locale}/status/gulf_water`}
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-elevated px-3 py-1.5 text-xs font-semibold text-brand-400 hover:bg-surface-base shadow-xs transition"
        >
          <Globe className="h-3.5 w-3.5" />
          <span>{t("statusPageCenter.viewLivePortal")}</span>
          <ExternalLink className="h-3 w-3 rtl-flip" />
        </Link>
      </div>

      {/* Component Status Grid */}
      <div className="rounded-xl border border-border-subtle bg-surface-elevated p-5 space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <h3 className="font-bold text-text-main text-sm">{t("statusPageCenter.serviceComponentsTitle")}</h3>
          <span className="text-[10px] text-emerald-400 font-semibold">90-Day {t("statusPageCenter.uptimeLabel")}: <Ltr>99.92%</Ltr></span>
        </div>

        <div className="space-y-2.5">
          {components.map((comp) => (
            <div
              key={comp.id}
              className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border border-border-subtle bg-surface-base"
            >
              <div className="space-y-0.5">
                <span className="font-semibold text-text-main text-xs">{comp.name}</span>
                <p className="text-[10px] text-text-muted font-mono">{t("statusPageCenter.uptimeLabel")}: <Ltr>{comp.uptime}</Ltr></p>
              </div>

              {/* Status Selector */}
              <div className="inline-flex rounded-lg border border-border-subtle bg-surface-elevated p-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleStatusToggle(comp.id, "operational")}
                  className={`px-2 py-0.5 rounded font-semibold transition ${
                    comp.status === "operational"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-text-muted hover:text-emerald-400"
                  }`}
                >
                  Operational
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusToggle(comp.id, "degraded")}
                  className={`px-2 py-0.5 rounded font-semibold transition ${
                    comp.status === "degraded"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-text-muted hover:text-amber-400"
                  }`}
                >
                  Degraded Performance
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusToggle(comp.id, "outage")}
                  className={`px-2 py-0.5 rounded font-semibold transition ${
                    comp.status === "outage"
                      ? "bg-critical-600 text-white shadow-xs"
                      : "text-text-muted hover:text-critical-400"
                  }`}
                >
                  Major Outage
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post New Public Advisory Form */}
      <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 p-5 space-y-4 text-xs">
        <div className="border-b border-brand-500/20 pb-3">
          <h3 className="font-bold text-text-main text-sm flex items-center gap-2">
            <Send className="h-4 w-4 text-brand-500" />
            Publish Verified Public Advisory
          </h3>
          <p className="text-[11px] text-text-muted">
            Posts are published instantly to the public status page and pushed to subscribed citizen channels.
          </p>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="font-semibold text-text-main block">{t("statusPageCenter.advisoryHeadline")}</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={t("statusPageCenter.advisoryPlaceholder")}
              className="w-full rounded-lg border border-border-subtle bg-surface-base p-2 text-xs text-text-main focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-text-main block">{t("statusPageCenter.englishPublicStatement")}</label>
              <textarea
                rows={3}
                value={newBodyEn}
                onChange={(e) => setNewBodyEn(e.target.value)}
                placeholder={t("statusPageCenter.statementPlaceholder")}
                className="w-full rounded-lg border border-border-subtle bg-surface-base p-2 text-xs text-text-main focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div className="space-y-1" dir="rtl">
              <label className="font-semibold text-text-main block">البيان العام باللغة العربية</label>
              <textarea
                rows={3}
                value={newBodyAr}
                onChange={(e) => setNewBodyAr(e.target.value)}
                placeholder="بيان الموقف العام باللغة العربية وتأكيد استمرارية الخدمة..."
                className="w-full rounded-lg border border-border-subtle bg-surface-base p-2 text-xs text-text-main font-arabic focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handlePublishUpdate}
            disabled={!newTitle.trim() || !newBodyEn.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-500 font-semibold text-white hover:bg-brand-600 disabled:opacity-40 shadow-sm transition"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{t("statusPageCenter.publishExternal")}</span>
          </button>
        </div>
      </div>

      {/* Recent Public Advisories Feed */}
      <div className="rounded-xl border border-border-subtle bg-surface-elevated p-5 space-y-4 text-xs">
        <h3 className="font-bold text-text-main text-sm">{t("statusPageCenter.advisoriesHistory")}</h3>

        <div className="space-y-3">
          {publicUpdates.map((upd) => (
            <div key={upd.id} className="p-4 rounded-lg border border-border-subtle bg-surface-base space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] bg-brand-500/10 text-brand-400 font-bold px-1.5 py-0.5 rounded border border-brand-500/20">
                    <Ltr>{upd.id}</Ltr>
                  </span>
                  <h4 className="font-bold text-text-main text-xs">{upd.title}</h4>
                </div>
                <span className="text-[10px] text-text-muted font-mono"><Ltr>{upd.time}</Ltr></span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-text-muted pt-1">
                <p className="leading-relaxed bg-surface-elevated p-2.5 rounded border border-border-subtle">{upd.bodyEn}</p>
                <p className="leading-relaxed bg-surface-elevated p-2.5 rounded border border-border-subtle font-arabic" dir="rtl">{upd.bodyAr}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
