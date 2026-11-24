"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import {
  PieChart,
  Download,
  Calendar,
  BarChart3,
  TrendingUp,
  Radio,
  Clock,
  Shield,
  Layers,
} from "lucide-react";
import { Ltr } from "@/components/layout/Ltr";
import { ChartCard, ChartDataPoint } from "@/components/crisis/views/ChartCard";
import { PivotTable } from "@/components/crisis/views/PivotTable";
import { showToast } from "@/lib/toast";

export default function ReportsPage() {
  const t = useTranslations();
  const locale = useLocale();

  const router = useRouter();
  const [dateRange, setDateRange] = useState("last30");

  const severityChartData: ChartDataPoint[] = [
    { label: "P1 Critical", value: 3, colorClass: "bg-severity-critical" },
    { label: "P2 High", value: 8, colorClass: "bg-severity-high" },
    { label: "P3 Medium", value: 14, colorClass: "bg-severity-medium" },
    { label: "P4 Low", value: 29, colorClass: "bg-severity-low" },
  ];

  const channelDeliveryData: ChartDataPoint[] = [
    { label: "SMS Gateways (Route A/Route B)", value: 1420, colorClass: "bg-brand-600" },
    { label: "Microsoft Teams Bot Alerts", value: 890, colorClass: "bg-indigo-600" },
    { label: "High-Priority SMTP Email", value: 2150, colorClass: "bg-emerald-600" },
    { label: "Public Status Page Hits", value: 4800, colorClass: "bg-blue-600" },
  ];

  const pivotRows = [
    { dimension: "Sohar Desalination Plant", sms: 450, email: 620, teams: 310, total: 1380 },
    { dimension: "Muscat Central Pumping Station", sms: 380, email: 510, teams: 240, total: 1130 },
    { dimension: "Nizwa Regional Distribution", sms: 290, email: 430, teams: 180, total: 900 },
    { dimension: "Salalah Coastal Terminal", sms: 300, email: 590, teams: 160, total: 1050 },
  ];

  const handleExportPdf = () => {
    router.push(`/${locale}/app/reports/print/executive-summary`);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-app-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <PieChart className="w-6 h-6 text-brand-600" />
            <h1 className="text-xl font-bold text-app-text">{t("reportsCenter.title")}</h1>
          </div>
          <p className="text-xs text-app-muted mt-1">{t("reportsCenter.subtitle")}</p>
        </div>

        {/* Date Filter & Export Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-app-surface border border-app-border rounded-input text-xs">
            <Calendar className="w-3.5 h-3.5 text-app-muted ms-1" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent text-app-text text-xs focus:outline-none py-1 pe-2"
            >
              <option value="last30">{t("reportsCenter.last30Days")}</option>
              <option value="last90">{t("reportsCenter.last90Days")}</option>
              <option value="ytd">{t("reportsCenter.yearToDate")}</option>
            </select>
          </div>

          <button
            onClick={handleExportPdf}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-input font-bold text-xs shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{t("reportsCenter.exportReport")}</span>
          </button>
        </div>
      </div>

      {/* KPI Tiles Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-app-surface border border-app-border rounded-card">
          <span className="text-[11px] font-bold text-app-muted uppercase tracking-wider block">
            Total Incidents
          </span>
          <div className="text-2xl font-black text-app-text mt-1"><Ltr>54</Ltr></div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            -18% vs previous period
          </span>
        </div>

        <div className="p-4 bg-app-surface border border-app-border rounded-card">
          <span className="text-[11px] font-bold text-app-muted uppercase tracking-wider block">
            Mean Time to Acknowledge
          </span>
          <div className="text-2xl font-black text-app-text mt-1"><Ltr>2m 44s</Ltr></div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            Target &lt; 5m (Met)
          </span>
        </div>

        <div className="p-4 bg-app-surface border border-app-border rounded-card">
          <span className="text-[11px] font-bold text-app-muted uppercase tracking-wider block">
            Mean Time to Contain
          </span>
          <div className="text-2xl font-black text-app-text mt-1"><Ltr>48m</Ltr></div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            Target &lt; 60m (Met)
          </span>
        </div>

        <div className="p-4 bg-app-surface border border-app-border rounded-card">
          <span className="text-[11px] font-bold text-app-muted uppercase tracking-wider block">
            Channel Delivery Rate
          </span>
          <div className="text-2xl font-black text-app-text mt-1"><Ltr>99.4%</Ltr></div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            Zero gateway failures
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard
          title={t("reportsCenter.incidentsBySeverityTitle")}
          subtitle="Annual breakdown categorized by severity tier"
          data={severityChartData}
        />
        <ChartCard
          title={t("reportsCenter.channelDeliveryMetricsTitle")}
          subtitle="Total delivered broadcasts across communication channels"
          data={channelDeliveryData}
        />
      </div>

      {/* Pivot Table Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-brand-600" />
          <h2 className="text-sm font-bold text-app-text">
            {t("reportsCenter.pivotAnalyticsTitle")}
          </h2>
        </div>
        <PivotTable rows={pivotRows} />
      </div>
    </div>
  );
}
