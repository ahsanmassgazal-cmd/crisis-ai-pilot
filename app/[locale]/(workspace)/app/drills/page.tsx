"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Flame,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  ChevronRight,
  TrendingUp,
  FileCheck,
} from "lucide-react";
import { Ltr } from "@/components/layout/Ltr";
import { CalendarView, CalendarEvent } from "@/components/crisis/views/CalendarView";
import { ReadinessGauge } from "@/components/crisis/display/ReadinessGauge";
import { showToast } from "@/lib/toast";

export default function DrillsPage() {
  const t = useTranslations();
  const locale = useLocale();

  const [activeTab, setActiveTab] = useState<"upcoming" | "calendar" | "injects" | "scorecard">("upcoming");

  const drills = [
    {
      id: "DRL-2026-04",
      code: "DRL-2026-04",
      title_en: "Unannounced Coastal SCADA Ransomware Simulation",
      title_ar: "محاكاة هجوم فدية مباغت على شبكات SCADA الساحلية",
      type: "drill" as const,
      status: "scheduled",
      scheduledDate: "2026-12-05",
      participantsCount: 38,
      readinessScore: 92,
      scenario: "cyber_industrial",
    },
    {
      id: "DRL-2026-03",
      code: "DRL-2026-03",
      title_en: "Chlorine Gas Vapor Leak & Dual-Plant Evacuation",
      title_ar: "محاكاة تسرب أبخرة الكلور وإخلاء المحطتين",
      type: "drill" as const,
      status: "completed",
      scheduledDate: "2026-10-14",
      participantsCount: 52,
      readinessScore: 88,
      scenario: "hazmat",
    },
    {
      id: "DRL-2026-02",
      code: "DRL-2026-02",
      title_en: "Total National Grid Power Blackout & Generator Failover",
      title_ar: "مناورة الانقطاع الكلي للشبكة وتشغيل المولدات البديلة",
      type: "drill" as const,
      status: "completed",
      scheduledDate: "2026-08-20",
      participantsCount: 44,
      readinessScore: 94,
      scenario: "blackout",
    },
  ];

  const calendarEvents: CalendarEvent[] = [
    { id: "e1", day: 5, title: "SCADA Cyber Drill", type: "drill" },
    { id: "e2", day: 14, title: "ISO 22301 Audit", type: "audit" },
    { id: "e3", day: 22, title: "Hazmat Permit Renewal", type: "expiry" },
    { id: "e4", day: 28, title: "EOC Shift Rotation", type: "shift" },
  ];

  const injects = [
    {
      timeOffset: "T+00m",
      title_en: "Initial alert inject: Telemetry values drop to zero across Unit 4",
      title_ar: "الحقن الأولي: هبوط قراءات القياس إلى الصفر في الوحدة 4",
      target: "SCADA Operational Lead",
      status: "delivered",
    },
    {
      timeOffset: "T+15m",
      title_en: "Media inquiry simulation: Oman Daily Observer calls EOC press line",
      title_ar: "محاكاة استفسار إعلامي: صحيفة عمان تتصل بالخط الساخن لغرفة العمليات",
      target: "Communications Lead",
      status: "pending",
    },
    {
      timeOffset: "T+35m",
      title_en: "Critical inject: Primary backup generator sensor fails self-test",
      title_ar: "حقن حرج: فشل الفحص الذاتي لحساس المولد الاحتياطي الأساسي",
      target: "Engineering On-Call",
      status: "pending",
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-app-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-brand-600" />
            <h1 className="text-xl font-bold text-app-text">{t("drillsCenter.title")}</h1>
          </div>
          <p className="text-xs text-app-muted mt-1">{t("drillsCenter.subtitle")}</p>
        </div>

        {/* Schedule Drill CTA */}
        <button
          onClick={() =>
            showToast({
              title: t("drillsCenter.scheduleDrill"),
              description: "New drill simulation wizard opened.",
              tone: "brand",
            })
          }
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-input font-bold text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t("drillsCenter.scheduleDrill")}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-app-surface-subtle border border-app-border rounded-input text-xs w-fit">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === "upcoming"
              ? "bg-app-surface text-brand-600 shadow-sm font-semibold"
              : "text-app-muted hover:text-app-text"
          }`}
        >
          {t("drillsCenter.upcomingDrillsTab")}
        </button>
        <button
          onClick={() => setActiveTab("calendar")}
          className={`px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === "calendar"
              ? "bg-app-surface text-brand-600 shadow-sm font-semibold"
              : "text-app-muted hover:text-app-text"
          }`}
        >
          {t("drillsCenter.drillCalendarTab")}
        </button>
        <button
          onClick={() => setActiveTab("injects")}
          className={`px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === "injects"
              ? "bg-app-surface text-brand-600 shadow-sm font-semibold"
              : "text-app-muted hover:text-app-text"
          }`}
        >
          {t("drillsCenter.activeDrillInjectsTab")}
        </button>
        <button
          onClick={() => setActiveTab("scorecard")}
          className={`px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === "scorecard"
              ? "bg-app-surface text-brand-600 shadow-sm font-semibold"
              : "text-app-muted hover:text-app-text"
          }`}
        >
          {t("drillsCenter.drillScorecardsTab")}
        </button>
      </div>

      {/* Tab 1: Upcoming Drills List */}
      {activeTab === "upcoming" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {drills.map((drill) => (
            <div
              key={drill.id}
              className="p-5 bg-app-surface border border-app-border rounded-card hover:border-brand-300 transition-all space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded">
                  <Ltr>{drill.code}</Ltr>
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    drill.status === "scheduled"
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                      : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                  }`}
                >
                  {drill.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-app-text">
                  {locale === "ar" ? drill.title_ar : drill.title_en}
                </h3>
                <div className="flex items-center gap-3 text-xs text-app-muted mt-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span><Ltr>{drill.scheduledDate}</Ltr></span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t("drillsCenter.staffCount", { count: drill.participantsCount })}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-app-border flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-app-muted">{t("drillsCenter.overallScore")}:</span>
                  <span className="font-bold text-brand-600"><Ltr>{drill.readinessScore}%</Ltr></span>
                </div>
                <button
                  onClick={() =>
                    showToast({
                      title: drill.code,
                      description: "Drill exercise packet opened.",
                      tone: "brand",
                    })
                  }
                  className="text-xs text-brand-600 font-bold hover:underline"
                >
                  {t("common.details")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Calendar */}
      {activeTab === "calendar" && (
        <CalendarView monthName="November 2026" events={calendarEvents} />
      )}

      {/* Tab 3: Active Drill Injects */}
      {activeTab === "injects" && (
        <div className="p-5 bg-app-surface border border-app-border rounded-card space-y-4">
          <div className="flex items-center justify-between border-b border-app-border pb-3">
            <div>
              <h2 className="text-base font-bold text-app-text">{t("drillsCenter.injectTitle")}</h2>
              <p className="text-xs text-app-muted">{t("drillsCenter.scenarioPrefix", { code: "DRL-2026-04" })}</p>
            </div>
            <button
              onClick={() =>
                showToast({
                  title: t("drillsCenter.addInject"),
                  description: "Inject builder dialog triggered.",
                  tone: "brand",
                })
              }
              className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-input text-xs font-bold"
            >
              {t("drillsCenter.addInject")}
            </button>
          </div>

          <div className="space-y-3">
            {injects.map((inj, i) => (
              <div
                key={i}
                className="p-3 bg-app-surface-subtle border border-app-border rounded-input flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-brand-50 dark:bg-brand-950/40 text-brand-600 font-mono font-bold text-xs rounded">
                    <Ltr>{inj.timeOffset}</Ltr>
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-app-text">
                      {locale === "ar" ? inj.title_ar : inj.title_en}
                    </h4>
                    <span className="text-[11px] text-app-muted">
                      {t("drillsCenter.injectTarget")}: {inj.target}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    inj.status === "delivered"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30"
                      : "bg-amber-50 text-amber-700 dark:bg-amber-950/30"
                  }`}
                >
                  {inj.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Scorecards */}
      {activeTab === "scorecard" && (
        <div className="p-5 bg-app-surface border border-app-border rounded-card space-y-6">
          <h2 className="text-base font-bold text-app-text">{t("drillsCenter.drillScorecardsTab")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 bg-app-surface-subtle border border-app-border rounded-card flex flex-col items-center text-center space-y-2">
              <ReadinessGauge score={92} />
              <div className="text-xs font-bold text-app-text">{t("drillsCenter.overallScore")}</div>
            </div>
            <div className="p-4 bg-app-surface-subtle border border-app-border rounded-card flex flex-col items-center justify-center text-center space-y-2">
              <div className="text-3xl font-black text-status-normal"><Ltr>94%</Ltr></div>
              <div className="text-xs font-bold text-app-text">{t("drillsCenter.targetAckMet")}</div>
              <p className="text-[11px] text-app-muted">{t("drillsCenter.within8Min")}</p>
            </div>
            <div className="p-4 bg-app-surface-subtle border border-app-border rounded-card flex flex-col items-center justify-center text-center space-y-2">
              <div className="text-3xl font-black text-brand-600"><Ltr>88%</Ltr></div>
              <div className="text-xs font-bold text-app-text">{t("drillsCenter.slaAdherence")}</div>
              <p className="text-[11px] text-app-muted">{t("drillsCenter.containmentMet")}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
