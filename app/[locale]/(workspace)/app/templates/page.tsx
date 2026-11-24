"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Ltr } from "@/components/common/Ltr";
import { PhonePreview } from "@/components/crisis/display/PhonePreview";
import { FileText, CheckCircle2, Copy, Sparkles, Filter, Search, Plus, Eye } from "lucide-react";

export default function MessageTemplatesPage() {
  const t = useTranslations();
  const [filterCat, setFilterCat] = useState("all");
  const [search, setSearch] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const templates = [
    {
      id: "TPL-001",
      category: "cyber",
      name: "SCADA Telemetry Outlier Alert",
      channels: ["sms", "teams"],
      preApproved: true,
      variables: ["site_name", "rack_id", "commander_name", "eta"],
      bodyEn:
        "CRITICAL ALERT: SCADA anomaly detected at {{site_name}} (Rack {{rack_id}}). Immediate containment protocol activated. Report to command room. - {{commander_name}}",
      bodyAr:
        "تنبيه حرج: تم رصد خلل في شبكة سكادا في {{site_name}} (قسم {{rack_id}}). تم تفعيل بروتوكول الاحتواء الفوري. الحضور فوراً لغرفة العمليات. - {{commander_name}}"
    },
    {
      id: "TPL-002",
      category: "power",
      name: "Substation Grid Trip Notification",
      channels: ["sms", "email"],
      preApproved: true,
      variables: ["site_name", "voltage_kv", "affected_area", "backup_status"],
      bodyEn:
        "EMERGENCY NOTICE: Primary 33kV feed tripped at {{site_name}}. Backup generators active. Technicians deployed to {{affected_area}}.",
      bodyAr:
        "إشعار طوارئ: انقطاع التغذية الكهربائية الرئيسية 33 ك.ف بمحطة {{site_name}}. تم تشغيل المولدات الاحتياطية وتوجيه الفرق الفنية."
    },
    {
      id: "TPL-003",
      category: "weather",
      name: "Severe Flash Flood Triage Warning",
      channels: ["sms", "teams", "email"],
      preApproved: true,
      variables: ["wadis_affected", "rainfall_mm", "evacuation_gate"],
      bodyEn:
        "WEATHER ADVISORY: Flash flood surge approaching plant perimeter via {{wadis_affected}}. Secure lower drainage gates and assemble at {{evacuation_gate}}.",
      bodyAr:
        "تحذير جوي: تدفق سيول جارفة تقترب من محيط المنشأة عبر {{wadis_affected}}. يرجى إغلاق بوابات التصريف والتجمع فوراً عند {{evacuation_gate}}."
    },
    {
      id: "TPL-004",
      category: "reputation",
      name: "Media Holding Statement (Water Quality)",
      channels: ["email"],
      preApproved: false,
      variables: ["company_name", "plant_name", "quality_metric"],
      bodyEn:
        "{{company_name}} confirms water distribution continues under verified safety parameters at {{plant_name}}. Independent laboratory samples show {{quality_metric}} compliance.",
      bodyAr:
        "تؤكد {{company_name}} استمرار ضخ المياه وفق أعلى معايير السلامة بمحطة {{plant_name}}. وتؤكد الفحوصات المخبرية مطابقة الجودة للمواصفات القياسية."
    }
  ];

  const [activeTemplate, setActiveTemplate] = useState(templates[0]);

  const filtered = templates.filter((tpl) => {
    if (filterCat !== "all" && tpl.category !== filterCat) return false;
    if (search && !tpl.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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
            {t("nav.templates")}
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Pre-approved bilingual message templates with dynamic variable insertion and device previews.
          </p>
        </div>

        <button
          type="button"
          onClick={() => showToast("Opened New Template Builder")}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 shadow-sm transition"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Template</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-border-subtle bg-surface-base p-1 text-xs">
          {["all", "cyber", "power", "weather", "reputation"].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilterCat(c)}
              className={`px-3 py-1 rounded font-medium capitalize transition ${
                filterCat === c
                  ? "bg-surface-elevated text-text-main shadow-xs font-semibold"
                  : "text-text-muted hover:text-text-main"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute inset-inline-start-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates by name..."
            className="w-full rounded-lg border border-border-subtle bg-surface-elevated ps-8 pe-3 py-1.5 text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Main Grid: Library on left, Preview on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Cards */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((tpl) => {
            const isSelected = activeTemplate.id === tpl.id;
            return (
              <div
                key={tpl.id}
                onClick={() => setActiveTemplate(tpl)}
                className={`rounded-xl border p-4 cursor-pointer transition space-y-3 ${
                  isSelected
                    ? "border-brand-500 bg-surface-elevated shadow-md"
                    : "border-border-subtle bg-surface-base hover:border-brand-500/40"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-2.5">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase font-bold text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded border border-brand-500/20">
                        {tpl.id}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-text-muted">
                        {tpl.category}
                      </span>
                      {tpl.preApproved ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                          Pre-Approved
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
                          Needs Approval
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-text-main">{tpl.name}</h3>
                  </div>

                  <div className="flex items-center gap-1">
                    {tpl.channels.map((ch) => (
                      <span key={ch} className="uppercase text-[10px] px-1.5 py-0.5 rounded bg-surface-elevated border border-border-subtle text-text-muted font-mono font-medium">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Variable Chips */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-text-muted">Variables:</span>
                  {tpl.variables.map((v) => (
                    <span
                      key={v}
                      className="font-mono text-[10px] bg-surface-elevated px-1.5 py-0.5 rounded border border-border-subtle text-text-main font-semibold"
                    >
                      {"{{" + v + "}}"}
                    </span>
                  ))}
                </div>

                {/* Content snippet */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="rounded bg-surface-elevated p-2 border border-border-subtle text-text-muted line-clamp-2">
                    {tpl.bodyEn}
                  </div>
                  <div className="rounded bg-surface-elevated p-2 border border-border-subtle text-text-muted line-clamp-2 font-arabic" dir="rtl">
                    {tpl.bodyAr}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Device Phone Preview */}
        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4 flex flex-col items-center">
          <div className="w-full border-b border-border-subtle pb-3 mb-3 text-center">
            <h3 className="font-bold text-xs text-text-main">Template Device Preview</h3>
            <p className="text-[10px] text-text-muted">{activeTemplate.name}</p>
          </div>

          <PhonePreview
            channel="sms"
            title={activeTemplate.name}
            bodyEn={activeTemplate.bodyEn}
            bodyAr={activeTemplate.bodyAr}
          />
        </div>
      </div>
    </div>
  );
}
