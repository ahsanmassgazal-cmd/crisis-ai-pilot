"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { ColumnDef } from "@tanstack/react-table";
import {
  Table,
  Kanban,
  Clock,
  Calendar,
  MapPin,
  Plus,
  ArrowRight,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { Incident } from "@/lib/repo/types";
import { SEED_INCIDENTS, SEED_SITES } from "@/seed/data";
import { SeverityBadge } from "@/components/crisis/atoms/SeverityBadge";
import { StatusBadge } from "@/components/crisis/atoms/StatusBadge";
import { CategoryTag } from "@/components/crisis/atoms/CategoryTag";
import { SlaRing } from "@/components/crisis/display/SlaRing";
import { DataTable } from "@/components/crisis/views/DataTable";
import { KanbanBoard, KanbanItem } from "@/components/crisis/views/KanbanBoard";
import { Timeline, TimelineEvent } from "@/components/crisis/display/Timeline";
import { CalendarView, CalendarEvent } from "@/components/crisis/views/CalendarView";
import { MapPanel } from "@/components/crisis/views/MapPanel";
import { SavedViewTabs } from "@/components/crisis/views/SavedViewTabs";
import { FilterBar, ActiveFilter } from "@/components/crisis/views/FilterBar";
import { Ltr } from "@/components/common/Ltr";

export default function IncidentsPage() {
  const t = useTranslations();
  const locale = useLocale();

  const [activeTab, setActiveTab] = useState("active");
  const [activeView, setActiveView] = useState<"table" | "kanban" | "timeline" | "calendar" | "map">("table");

  const [filters, setFilters] = useState<ActiveFilter[]>([
    { id: "f-1", field: "Status", operator: "=", value: "Active" },
  ]);

  const savedViews = [
    { id: "active", name: "Active Incidents", count: 2 },
    { id: "my", name: "My Incidents (Assigned)", count: 1 },
    { id: "critical", name: "SEV1 & SEV2 Critical", count: 1 },
    { id: "all", name: "All Incidents (Last 30 Days)", count: 5 },
  ];

  // TanStack columns
  const columns: ColumnDef<Incident>[] = [
    {
      accessorKey: "number",
      header: "Incident ID",
      cell: ({ row }) => (
        <span className="font-mono font-bold text-xs text-brand-600">
          <Ltr>{row.original.number}</Ltr>
        </span>
      ),
    },
    {
      accessorKey: "title_en",
      header: "Title & Scenario",
      cell: ({ row }) => (
        <div className="space-y-0.5 max-w-md">
          <div className="font-bold text-app-text text-xs">
            {locale === "ar" ? row.original.title_ar : row.original.title_en}
          </div>
          <div className="text-[10px] text-app-muted truncate">
            {locale === "ar" ? row.original.title_en : row.original.title_ar}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <CategoryTag category={row.original.category} />,
    },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => <SeverityBadge level={row.original.severity} />,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "sla",
      header: "SLA Window",
      cell: ({ row }) => (
        <SlaRing
          totalMinutes={row.original.sla_minutes}
          elapsedMinutes={row.original.severity === "critical" ? 25 : 60}
          size={44}
        />
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="text-end">
          <Link
            href={`/app/incidents/${row.original.id}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-brand-50 text-brand-600 hover:bg-brand-600 hover:text-white transition-colors font-bold text-xs"
          >
            <span>{t("incidentRoom.openRoom")}</span>
            <ArrowRight className="w-3 h-3 dir-aware-flip" />
          </Link>
        </div>
      ),
    },
  ];

  // Transform for Kanban
  const kanbanItems: KanbanItem[] = SEED_INCIDENTS.map((inc) => ({
    id: inc.id,
    title: locale === "ar" ? inc.title_ar : inc.title_en,
    owner: "Eng. Tariq Al-Busaidi",
    priority: inc.severity === "critical" ? "p1" : inc.severity === "high" ? "p2" : "p3",
    status: inc.status === "active" ? "doing" : inc.status === "resolved" || inc.status === "closed" ? "done" : "todo",
    dueMinutes: inc.sla_minutes,
    priorityScore: inc.priority_score,
  }));

  // Transform for Timeline
  const timelineEvents: TimelineEvent[] = SEED_INCIDENTS.map((inc) => ({
    id: inc.id,
    time: inc.started_at.slice(11, 16) + " GST",
    title: `${inc.number} — ${locale === "ar" ? inc.title_ar : inc.title_en}`,
    description: `Severity: ${inc.severity.toUpperCase()} · Status: ${inc.status.toUpperCase()}`,
    badge: inc.severity.toUpperCase(),
    badgeColorClass: inc.severity === "critical" ? "bg-severity-critical-tint text-severity-critical" : "bg-app-surface-subtle",
  }));

  // Transform for Calendar
  const calendarEvents: CalendarEvent[] = [
    { id: "e-1", day: 24, title: "INC-2026-001 (SCADA Cyber)", type: "drill" },
    { id: "e-2", day: 24, title: "INC-2026-002 (Reagent Logistics)", type: "drill" },
    { id: "e-3", day: 20, title: "INC-2026-004 (Duqm Feeder Trip)", type: "audit" },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header with Title & Quick Activate Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-app-text tracking-tight">
            Incidents Lifecycle Management
          </h1>
          <p className="text-xs text-app-muted mt-0.5">
            Active and historical emergency scenarios across GCC utility and industrial operations
          </p>
        </div>

        <Link
          href="/app/incidents/new"
          className="px-4 py-2 bg-brand-600 hover:bg-brand-hover text-white text-xs font-bold rounded-input shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t("common.activateIncident")}</span>
        </Link>
      </div>

      {/* Saved Views Navigation Tabs */}
      <SavedViewTabs
        views={savedViews}
        activeViewId={activeTab}
        onSelectView={setActiveTab}
      />

      {/* Control Bar: Filter Bar + 5 View Switcher Buttons */}
      <div className="p-3 rounded-card bg-app-surface border border-app-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
        <FilterBar
          filters={filters}
          onRemoveFilter={(id) => setFilters(filters.filter((f) => f.id !== id))}
          onAddFilter={() => {}}
          onClearAll={() => setFilters([])}
        />

        {/* View Switchers (Table, Kanban, Timeline, Calendar, Map) */}
        <div className="flex items-center gap-1 p-1 rounded-input bg-app-surface-subtle border border-app-border text-xs self-start md:self-auto">
          <button
            onClick={() => setActiveView("table")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              activeView === "table" ? "bg-app-surface text-brand-600 shadow-xs" : "text-app-muted hover:text-app-text"
            }`}
            title={t("incidentRoom.tableView")}
          >
            <Table className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t("incidentRoom.table")}</span>
          </button>

          <button
            onClick={() => setActiveView("kanban")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              activeView === "kanban" ? "bg-app-surface text-brand-600 shadow-xs" : "text-app-muted hover:text-app-text"
            }`}
            title={t("incidentRoom.kanbanView")}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t("incidentRoom.kanban")}</span>
          </button>

          <button
            onClick={() => setActiveView("timeline")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              activeView === "timeline" ? "bg-app-surface text-brand-600 shadow-xs" : "text-app-muted hover:text-app-text"
            }`}
            title={t("incidentRoom.timelineView")}
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t("incidentRoom.timeline")}</span>
          </button>

          <button
            onClick={() => setActiveView("calendar")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              activeView === "calendar" ? "bg-app-surface text-brand-600 shadow-xs" : "text-app-muted hover:text-app-text"
            }`}
            title={t("incidentRoom.calendarView")}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t("incidentRoom.calendar")}</span>
          </button>

          <button
            onClick={() => setActiveView("map")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              activeView === "map" ? "bg-app-surface text-brand-600 shadow-xs" : "text-app-muted hover:text-app-text"
            }`}
            title={t("incidentRoom.mapView")}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t("incidentRoom.map")}</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {activeView === "table" && (
        <DataTable columns={columns} data={SEED_INCIDENTS} searchPlaceholder="Search incident ID, scenario, site..." />
      )}

      {activeView === "kanban" && (
        <KanbanBoard items={kanbanItems} />
      )}

      {activeView === "timeline" && (
        <div className="p-6 rounded-card bg-app-surface border border-app-border">
          <Timeline events={timelineEvents} />
        </div>
      )}

      {activeView === "calendar" && (
        <CalendarView events={calendarEvents} />
      )}

      {activeView === "map" && (
        <MapPanel sites={SEED_SITES} />
      )}
    </div>
  );
}
