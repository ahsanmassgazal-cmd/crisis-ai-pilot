"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  GraduationCap,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  ArrowRight,
  Shield,
  FileText,
} from "lucide-react";
import { Ltr } from "@/components/layout/Ltr";
import { showToast } from "@/lib/toast";

interface CapaItem {
  id: string;
  code: string;
  title_en: string;
  title_ar: string;
  incidentCode: string;
  rootCause: string;
  assignedTo: string;
  deadline: string;
  status: "todo" | "in_progress" | "done";
  priority: "high" | "medium" | "low";
}

export default function LessonsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [search, setSearch] = useState("");

  const [items, setItems] = useState<CapaItem[]>([
    {
      id: "CAPA-01",
      code: "CAPA-01",
      title_en: "Enforce multi-factor authentication on legacy SCADA telemetry modems",
      title_ar: "فرض المصادقة متعددة العوامل على أجهزة مودم التحكم القديمة SCADA",
      incidentCode: "INC-2026-001",
      rootCause: "Credential Spraying & Weak OT Gateways",
      assignedTo: "Eng. Salim Al-Harthy",
      deadline: "2026-12-15",
      status: "in_progress",
      priority: "high",
    },
    {
      id: "CAPA-02",
      code: "CAPA-02",
      title_en: "Establish secondary chemical reagent backup depot in Nizwa",
      title_ar: "إنشاء مستودع كواشف كيميائية احتياطي بديل في نزوى",
      incidentCode: "INC-2026-002",
      rootCause: "Single Source Supply Chain Failure",
      assignedTo: "Fatima Al-Riyami",
      deadline: "2026-12-30",
      status: "todo",
      priority: "medium",
    },
    {
      id: "CAPA-03",
      code: "CAPA-03",
      title_en: "Update coastal flood drainage channels around auxiliary substation",
      title_ar: "تحديث قنوات تصريف مياه السيول حول المحطة الكهربائية الفرعية",
      incidentCode: "INC-2026-003",
      rootCause: "Hydraulic Culvert Overflow",
      assignedTo: "Tariq Al-Farsi",
      deadline: "2026-11-10",
      status: "done",
      priority: "high",
    },
    {
      id: "CAPA-04",
      code: "CAPA-04",
      title_en: "Automate EOC bilingual SMS blast to municipal executive leadership",
      title_ar: "أتمتة البث الإسعافي المزدوج لقيادات البلدية التنفيذية",
      incidentCode: "INC-2026-001",
      rootCause: "Manual Approval Latency",
      assignedTo: "Nasser Al-Balushi",
      deadline: "2026-12-01",
      status: "in_progress",
      priority: "high",
    },
  ]);

  const handleMove = (id: string, newStatus: CapaItem["status"]) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    showToast({
      title: id,
      description: `Action status updated to ${newStatus}.`,
      tone: "brand",
    });
  };

  const filteredItems = items.filter((item) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      item.code.toLowerCase().includes(term) ||
      item.title_en.toLowerCase().includes(term) ||
      item.title_ar.includes(search) ||
      item.incidentCode.toLowerCase().includes(term)
    );
  });

  const lanes: { id: CapaItem["status"]; label: string; toneBorder: string }[] = [
    { id: "todo", label: t("lessonsCenter.todoLane"), toneBorder: "border-slate-400" },
    { id: "in_progress", label: t("lessonsCenter.inProgressLane"), toneBorder: "border-brand-500" },
    { id: "done", label: t("lessonsCenter.doneLane"), toneBorder: "border-emerald-500" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-app-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-brand-600" />
            <h1 className="text-xl font-bold text-app-text">{t("lessonsCenter.title")}</h1>
          </div>
          <p className="text-xs text-app-muted mt-1">{t("lessonsCenter.subtitle")}</p>
        </div>

        {/* Search & New Action */}
        <div className="flex items-center gap-3">
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

          <button
            onClick={() =>
              showToast({
                title: t("lessonsCenter.createAction"),
                description: "New corrective action form opened.",
                tone: "brand",
              })
            }
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-input font-bold text-xs shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t("lessonsCenter.createAction")}</span>
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {lanes.map((lane) => {
          const laneItems = filteredItems.filter((i) => i.status === lane.id);
          return (
            <div
              key={lane.id}
              className="p-4 bg-app-surface-subtle/40 border border-app-border rounded-card flex flex-col min-h-[480px] space-y-3"
            >
              <div className={`flex items-center justify-between pb-2 border-b-2 ${lane.toneBorder}`}>
                <h2 className="text-xs font-bold text-app-text uppercase tracking-wider">
                  {lane.label}
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-app-surface border border-app-border text-app-muted">
                  <Ltr>{laneItems.length}</Ltr>
                </span>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto">
                {laneItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-app-surface border border-app-border rounded-card hover:border-brand-300 transition-all space-y-3 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded">
                        <Ltr>{item.code}</Ltr>
                      </span>
                      <span className="text-[10px] text-app-muted font-mono">
                        <Ltr>{item.incidentCode}</Ltr>
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-app-text">
                      {locale === "ar" ? item.title_ar : item.title_en}
                    </h3>

                    <div className="space-y-1 text-[11px] text-app-muted border-t border-app-border/40 pt-2">
                      <div>
                        <span className="font-medium text-app-text">{t("lessonsCenter.rootCauseLabel")}: </span>
                        <span>{item.rootCause}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{item.assignedTo}</span>
                        </span>
                        <span className="font-mono font-bold text-brand-600">
                          <Ltr>{item.deadline}</Ltr>
                        </span>
                      </div>
                    </div>

                    {/* Move Action buttons */}
                    <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-app-border/40 text-[11px]">
                      {lane.id !== "todo" && (
                        <button
                          onClick={() => handleMove(item.id, "todo")}
                          className="px-2 py-0.5 rounded hover:bg-app-surface-subtle text-app-muted"
                        >
                          To Do
                        </button>
                      )}
                      {lane.id !== "in_progress" && (
                        <button
                          onClick={() => handleMove(item.id, "in_progress")}
                          className="px-2 py-0.5 rounded hover:bg-app-surface-subtle text-brand-600 font-semibold"
                        >
                          In Progress
                        </button>
                      )}
                      {lane.id !== "done" && (
                        <button
                          onClick={() => handleMove(item.id, "done")}
                          className="px-2 py-0.5 rounded hover:bg-app-surface-subtle text-emerald-600 font-semibold"
                        >
                          Done
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
