"use client";

import React, { useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Ltr } from "@/components/common/Ltr";
import { mockRepository } from "@/lib/repo";
import { SeverityBadge } from "@/components/crisis/atoms/SeverityBadge";
import { StatusBadge } from "@/components/crisis/atoms/StatusBadge";
import { PriorityChip } from "@/components/crisis/atoms/PriorityChip";
import { CategoryTag } from "@/components/crisis/atoms/CategoryTag";
import { DeliveryStateDot } from "@/components/crisis/atoms/DeliveryStateDot";
import { SlaRing } from "@/components/crisis/display/SlaRing";
import { MapPanel } from "@/components/crisis/views/MapPanel";
import { KanbanBoard } from "@/components/crisis/views/KanbanBoard";
import { GanttTimeline } from "@/components/crisis/views/GanttTimeline";
import { DataTable } from "@/components/crisis/views/DataTable";
import { FileDropzone } from "@/components/crisis/display/FileDropzone";
import { AiCopilotDrawer } from "@/components/crisis/ai/AiCopilotDrawer";
import { AiSuggestionCard } from "@/components/crisis/ai/AiSuggestionCard";
import {
  ShieldAlert,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Users,
  Send,
  FileText,
  History,
  Lock,
  Layers,
  Check,
  X,
  Plus,
  Share2,
  PhoneCall,
  Flame,
  LayoutGrid,
  List,
  CalendarDays
} from "lucide-react";

export default function IncidentRoomPage() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  const incidentId = (params?.id as string) || "inc-1";

  // Active state
  const [activeTab, setActiveTab] = useState<
    "overview" | "timeline" | "tasks" | "comms" | "responders" | "documents" | "decisions" | "audit"
  >("overview");

  const [severity, setSeverity] = useState<"critical" | "high" | "medium" | "low">("critical");
  const [showSevModal, setShowSevModal] = useState(false);
  const [sevReason, setSevReason] = useState("");
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [tasksView, setTasksView] = useState<"kanban" | "table" | "gantt">("kanban");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  interface IncidentTaskItem {
    id: string;
    title: string;
    status: "todo" | "inprogress" | "done";
    priority: "p1" | "p2" | "p3" | "p4";
    assignee: string;
    due: string;
  }

  // Seed tasks for this incident
  const [tasks, setTasks] = useState<IncidentTaskItem[]>([
    {
      id: "task-1",
      title: "Isolate High-Pressure RO Rack 3 Telemetry Gateway",
      status: "done",
      priority: "p1",
      assignee: "Tariq Al-Lawati",
      due: "10:30 AM"
    },
    {
      id: "task-2",
      title: "Switch Potable Water Distribution to Backup Reservoirs",
      status: "inprogress",
      priority: "p1",
      assignee: "Eng. Salem Al-Harthy",
      due: "11:00 AM"
    },
    {
      id: "task-3",
      title: "Draft Regulatory Holding Statement for Authority",
      status: "inprogress",
      priority: "p2",
      assignee: "Fatima Al-Balushi",
      due: "11:30 AM"
    },
    {
      id: "task-4",
      title: "Conduct Plant Site Physical Access Verification",
      status: "todo",
      priority: "p2",
      assignee: "Security Operations",
      due: "12:00 PM"
    }
  ]);

  // Seed decisions log
  const [decisions, setDecisions] = useState([
    {
      id: "DEC-001",
      timestamp: "10:04 AM",
      commander: "Eng. Salem Al-Harthy (Incident Commander)",
      decision: "Authorized immediate physical disconnection of SCADA WAN interface 2 at Sohar Plant.",
      rationale: "Abnormal TCP packet storm observed from unauthorized external IP subnet.",
      approved: true
    },
    {
      id: "DEC-002",
      timestamp: "10:18 AM",
      commander: "Eng. Salem Al-Harthy (Incident Commander)",
      decision: "Declared Level 2 escalation to Regional Emergency Directorate.",
      rationale: "Plant output throttled by 28%; regional reservoir draw initiated.",
      approved: true
    }
  ]);

  const [newDecision, setNewDecision] = useState("");
  const [newRationale, setNewRationale] = useState("");

  const handleAddDecision = () => {
    if (!newDecision.trim()) return;
    const item = {
      id: `DEC-00${decisions.length + 1}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      commander: "Eng. Salem Al-Harthy (Incident Commander)",
      decision: newDecision,
      rationale: newRationale || "Operational necessity per crisis playbook CP-DESAL-04",
      approved: true
    };
    setDecisions([item, ...decisions]);
    setNewDecision("");
    setNewRationale("");
    showToast("Decision logged to immutable ledger and signed with SHA-256.");
  };

  const handleSeverityChange = () => {
    if (!sevReason.trim()) return;
    showToast(`Severity changed to ${severity.toUpperCase()} (Logged reason: ${sevReason})`);
    setShowSevModal(false);
    setSevReason("");
  };

  interface IncidentTabItem {
    key: "overview" | "timeline" | "tasks" | "comms" | "responders" | "documents" | "decisions" | "audit";
    label: string;
    icon: any;
    badge?: number;
  }

  const tabs: IncidentTabItem[] = [
    { key: "overview", label: "Overview", icon: Layers },
    { key: "timeline", label: "Timeline", icon: History },
    { key: "tasks", label: "Tasks", icon: CheckCircle2, badge: tasks.length },
    { key: "comms", label: "Comms", icon: Send, badge: 6 },
    { key: "responders", label: "Responders", icon: Users, badge: 14 },
    { key: "documents", label: "Documents", icon: FileText, badge: 4 },
    { key: "decisions", label: "Decisions Log", icon: Lock, badge: decisions.length },
    { key: "audit", label: "Audit Trail", icon: ShieldAlert }
  ];

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 inset-inline-end-6 z-50 rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-semibold text-white shadow-2xl animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* AI Copilot Drawer */}
      <AiCopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        incidentContext={{
          id: "INC-2026-001",
          title: "SCADA Telemetry Anomaly - Sohar Desalination",
          severity: severity
        }}
      />

      {/* Severity Change Modal */}
      {showSevModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-border-subtle bg-surface-elevated p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Change Incident Severity
              </h3>
              <button
                type="button"
                onClick={() => setShowSevModal(false)}
                className="text-text-muted hover:text-text-main"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-text-main block">Select New Severity Level</label>
              <div className="grid grid-cols-2 gap-2">
                {(["critical", "high", "medium", "low"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSeverity(lvl)}
                    className={`rounded-lg border p-2 text-start capitalize font-semibold transition flex items-center justify-between ${
                      severity === lvl
                        ? "border-brand-500 bg-brand-500/10 text-brand-400"
                        : "border-border-subtle bg-surface-base text-text-muted hover:text-text-main"
                    }`}
                  >
                    <span>{lvl}</span>
                    {severity === lvl && <Check className="h-3.5 w-3.5 text-brand-500" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-text-main block">
                Audit Justification <span className="text-critical-400">*</span>
              </label>
              <textarea
                rows={3}
                value={sevReason}
                onChange={(e) => setSevReason(e.target.value)}
                placeholder="State the technical and operational grounds for reclassifying severity..."
                className="w-full rounded-lg border border-border-subtle bg-surface-base p-2 text-text-main focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-border-subtle pt-3">
              <button
                type="button"
                onClick={() => setShowSevModal(false)}
                className="px-3 py-1.5 rounded-lg border border-border-subtle bg-surface-base text-text-muted hover:text-text-main font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!sevReason.trim()}
                onClick={handleSeverityChange}
                className="px-4 py-1.5 rounded-lg bg-brand-500 font-bold text-white hover:bg-brand-600 disabled:opacity-40 transition"
              >
                Confirm Severity Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STICKY INCIDENT HEADER */}
      <div className="sticky top-16 z-20 -mx-4 sm:-mx-6 -mt-6 p-4 sm:px-6 bg-surface-elevated/95 backdrop-blur-md border-b border-border-subtle shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Title & Identifiers */}
          <div className="space-y-1 min-w-[280px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                <Ltr>INC-2026-001</Ltr>
              </span>
              <SeverityBadge severity={severity} />
              <StatusBadge status="active" />
              <PriorityChip lane="now" score={98} />
              <CategoryTag category="cyber" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-text-main">
              SCADA Telemetry Anomaly (Sohar Desalination Plant)
            </h1>
          </div>

          {/* SLA, Commander & Escalation */}
          <div className="flex flex-wrap items-center gap-4">
            {/* SLA Ring */}
            <div className="flex items-center gap-2 rounded-xl bg-surface-base p-2 border border-border-subtle text-xs">
              <SlaRing elapsedMinutes={11} totalMinutes={15} isBreached={false} size={42} strokeWidth={4} />
              <div className="leading-tight">
                <span className="text-[10px] text-critical-400 font-bold block uppercase tracking-wider">
                  Initial SLA: 4m left
                </span>
                <span className="text-text-muted text-[10px]">Response Target: 15 mins</span>
              </div>
            </div>

            {/* Escalation Ladder */}
            <div className="hidden lg:flex flex-col gap-0.5 text-[10px] bg-surface-base p-2 rounded-xl border border-border-subtle">
              <span className="text-text-muted font-medium">Escalation Ladder</span>
              <div className="flex items-center gap-1 font-semibold">
                <span className="text-text-muted">L1 Plant</span>
                <span className="text-text-muted">→</span>
                <span className="text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded border border-brand-500/20">
                  L2 Regional (Active)
                </span>
                <span className="text-text-muted">→</span>
                <span className="text-text-muted">L3 Executive</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSevModal(true)}
                className="rounded-lg border border-border-subtle bg-surface-base px-2.5 py-1.5 text-xs font-medium text-text-main hover:bg-surface-elevated transition"
              >
                Change Severity
              </button>

              <button
                type="button"
                onClick={() => setIsCopilotOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:opacity-95 transition"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI Copilot</span>
              </button>
            </div>
          </div>
        </div>

        {/* 8-TABS NAV BAR */}
        <div className="flex items-center gap-1 overflow-x-auto border-t border-border-subtle pt-2 scrollbar-none text-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium whitespace-nowrap transition ${
                  isActive
                    ? "bg-brand-500 text-white shadow-xs font-semibold"
                    : "text-text-muted hover:text-text-main hover:bg-surface-base"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? "bg-white/20 text-white" : "bg-surface-base text-text-muted"
                    }`}
                  >
                    <Ltr>{tab.badge}</Ltr>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT PANELS */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-fade-in">
          {/* Situation Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-xl border border-border-subtle bg-surface-elevated p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-critical-500" />
                  Primary Situation Board (Bilingual Operational Record)
                </h3>
                <span className="text-[10px] text-text-muted">Updated 2m ago</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="rounded-lg bg-surface-base p-3 border border-border-subtle space-y-1">
                  <span className="text-[10px] font-bold uppercase text-brand-400">English Summary</span>
                  <p className="text-text-main leading-relaxed">
                    At 09:42 GST, automated intrusion detection flagged anomalous high-volume TCP telemetry bursts on
                    SCADA VLAN 14 (Desalination Rack 3). Secondary telemetry verified pressure fluctuations. On-call
                    containment team dispatched; distribution throttled to prevent contamination risk.
                  </p>
                </div>
                <div className="rounded-lg bg-surface-base p-3 border border-border-subtle space-y-1" dir="rtl">
                  <span className="text-[10px] font-bold uppercase text-brand-400">ملخص الموقف بالعربية</span>
                  <p className="text-text-main leading-relaxed font-arabic">
                    في تمام الساعة 09:42 بتوقيت مسقط، رصدت أنظمة المراقبة الآلية تدفقات بيانات غير طبيعية على شبكة سكادا
                    (VLAN 14) بمحطة تحلية صحار. تم تفعيل خطة الاحتواء وعزل الأنظمة المتأثرة وتحويل الضخ إلى الخزانات
                    الاحتياطية مع استمرار فحص سلامة المياه.
                  </p>
                </div>
              </div>

              {/* Impact Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="rounded-lg bg-surface-base p-3 border border-border-subtle text-xs">
                  <span className="text-text-muted block text-[10px] uppercase">Affected Population</span>
                  <p className="text-lg font-bold text-text-main mt-0.5"><Ltr>145,000</Ltr></p>
                  <span className="text-[10px] text-amber-400 font-medium">Sohar & Al-Batinah</span>
                </div>
                <div className="rounded-lg bg-surface-base p-3 border border-border-subtle text-xs">
                  <span className="text-text-muted block text-[10px] uppercase">Plant Output</span>
                  <p className="text-lg font-bold text-critical-400 mt-0.5"><Ltr>-28%</Ltr></p>
                  <span className="text-[10px] text-text-muted">Rack 3 Throttled</span>
                </div>
                <div className="rounded-lg bg-surface-base p-3 border border-border-subtle text-xs">
                  <span className="text-text-muted block text-[10px] uppercase">Reserve Capacity</span>
                  <p className="text-lg font-bold text-emerald-400 mt-0.5"><Ltr>18.4 hrs</Ltr></p>
                  <span className="text-[10px] text-emerald-400 font-medium">Safe Margin (&gt;12h)</span>
                </div>
                <div className="rounded-lg bg-surface-base p-3 border border-border-subtle text-xs">
                  <span className="text-text-muted block text-[10px] uppercase">Dispatched Responders</span>
                  <p className="text-lg font-bold text-text-main mt-0.5"><Ltr>14 / 16</Ltr></p>
                  <span className="text-[10px] text-brand-400 font-medium">87.5% Ack Rate</span>
                </div>
              </div>
            </div>

            {/* AI Suggestion & Commander Info */}
            <div className="space-y-4">
              <AiSuggestionCard
                id="sug-1"
                title="Authorize Potable Reserve Redistribution"
                recommendation="Secondary reservoirs at Al-Khaburah have 100% capacity. Shift regional pipeline flow to maintain municipal pressure while SCADA Rack 3 is isolated."
                impactScore={92}
                confidencePercent={96}
                category="Containment & Continuity"
                onAccept={(id) => showToast(`AI Recommendation [${id}] accepted and converted to priority task.`)}
                onDismiss={(id) => showToast(`Dismissed recommendation [${id}].`)}
              />

              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4 space-y-3 text-xs">
                <span className="font-semibold text-text-main block">Active Command Structure</span>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-sm">
                    SH
                  </div>
                  <div>
                    <h4 className="font-bold text-text-main">Eng. Salem Al-Harthy</h4>
                    <p className="text-[11px] text-brand-400 font-medium">Incident Commander (Primary)</p>
                    <p className="text-[10px] text-text-muted">On Duty Since 08:00 AM • Phone: +968 9123 4567</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TIMELINE TAB */}
      {activeTab === "timeline" && (
        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-5 space-y-4 text-xs animate-fade-in">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
              <History className="h-4 w-4 text-brand-500" />
              Chronological Incident Event Log
            </h3>
            <span className="text-[11px] text-text-muted">All events timestamped in UTC+4 (GST)</span>
          </div>

          <div className="relative border-s-2 border-border-subtle ms-4 space-y-6 py-2">
            {[
              {
                time: "10:18 AM",
                title: "Level 2 Escalation Declared",
                desc: "Commander initiated Regional Directorate escalation due to 28% output reduction.",
                actor: "Salem Al-Harthy (Commander)",
                badge: "Escalation",
                badgeColor: "bg-critical-500/20 text-critical-300"
              },
              {
                time: "10:11 AM",
                title: "Bilingual Emergency SMS Broadcast Drafted",
                desc: "AI Copilot generated bilingual alert. Awaiting executive sign-off in Approvals Inbox.",
                actor: "Crisis AI Pilot [Auto]",
                badge: "Approval Required",
                badgeColor: "bg-amber-500/20 text-amber-300"
              },
              {
                time: "10:04 AM",
                title: "SCADA Telemetry Gateway Physically Disconnected",
                desc: "Isolation protocol executed on Rack 3. Telemetry switched to manual digital gauges.",
                actor: "Tariq Al-Lawati (SCADA Specialist)",
                badge: "Action Taken",
                badgeColor: "bg-brand-500/20 text-brand-300"
              },
              {
                time: "09:42 AM",
                title: "Automated Incident Creation (Severity 1)",
                desc: "Webhook rule SCADA_INTRUSION_TRIGGER activated upon telemetry flood detection.",
                actor: "Monitoring Engine",
                badge: "Trigger",
                badgeColor: "bg-indigo-500/20 text-indigo-300"
              }
            ].map((event, i) => (
              <div key={i} className="relative ps-6">
                <span className="absolute -inset-inline-start-2 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-surface-elevated bg-brand-500 shadow-xs" />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-text-muted"><Ltr>{event.time}</Ltr></span>
                  <span className={`text-[10px] px-2 py-0.2 rounded font-semibold ${event.badgeColor}`}>
                    {event.badge}
                  </span>
                  <span className="text-text-muted">• {event.actor}</span>
                </div>
                <h4 className="text-xs font-bold text-text-main mt-1">{event.title}</h4>
                <p className="text-text-muted mt-0.5">{event.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. TASKS TAB */}
      {activeTab === "tasks" && (
        <div className="space-y-4 animate-fade-in">
          {/* Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border-subtle bg-surface-elevated p-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text-main">Incident Action Items</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 font-mono">
                <Ltr>{tasks.length}</Ltr> Total
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-lg border border-border-subtle bg-surface-base p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setTasksView("kanban")}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded font-medium transition ${
                    tasksView === "kanban" ? "bg-surface-elevated text-text-main shadow-xs" : "text-text-muted"
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  Kanban
                </button>
                <button
                  type="button"
                  onClick={() => setTasksView("table")}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded font-medium transition ${
                    tasksView === "table" ? "bg-surface-elevated text-text-main shadow-xs" : "text-text-muted"
                  }`}
                >
                  <List className="h-3.5 w-3.5" />
                  Table
                </button>
                <button
                  type="button"
                  onClick={() => setTasksView("gantt")}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded font-medium transition ${
                    tasksView === "gantt" ? "bg-surface-elevated text-text-main shadow-xs" : "text-text-muted"
                  }`}
                >
                  <CalendarDays className="h-3.5 w-3.5" />
                  Gantt
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newTask = {
                    id: `task-${tasks.length + 1}`,
                    title: "Conduct secondary water purity sample test",
                    status: "todo" as const,
                    priority: "p1" as const,
                    assignee: "Water Quality Lab",
                    due: "12:30 PM"
                  };
                  setTasks([...tasks, newTask]);
                  showToast("New action task added.");
                }}
                className="inline-flex items-center gap-1 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 transition"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Task</span>
              </button>
            </div>
          </div>

          {/* Kanban / Table / Gantt View Render */}
          {tasksView === "kanban" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(["todo", "inprogress", "done"] as const).map((col) => {
                const colTasks = tasks.filter((t) => t.status === col);
                const colTitle = col === "todo" ? "To Do" : col === "inprogress" ? "In Progress" : "Completed";
                return (
                  <div key={col} className="rounded-xl border border-border-subtle bg-surface-base p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                      <span className="text-xs font-bold text-text-main">{colTitle}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated border border-border-subtle text-text-muted">
                        <Ltr>{colTasks.length}</Ltr>
                      </span>
                    </div>

                    <div className="space-y-2">
                      {colTasks.map((t) => (
                        <div
                          key={t.id}
                          className="rounded-lg border border-border-subtle bg-surface-elevated p-3 shadow-xs space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <PriorityChip priority={t.priority} />
                            <span className="text-[10px] text-text-muted font-mono"><Ltr>{t.due}</Ltr></span>
                          </div>
                          <p className="font-semibold text-text-main">{t.title}</p>
                          <div className="flex items-center justify-between border-t border-border-subtle pt-2 text-[10px] text-text-muted">
                            <span>Assignee: {t.assignee}</span>
                            {col !== "done" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setTasks(
                                    tasks.map((item) =>
                                      item.id === t.id
                                        ? { ...item, status: col === "todo" ? "inprogress" : "done" }
                                        : item
                                    )
                                  );
                                  showToast(`Task updated to ${col === "todo" ? "In Progress" : "Completed"}`);
                                }}
                                className="text-brand-500 font-semibold hover:underline"
                              >
                                {col === "todo" ? "Start →" : "Complete ✓"}
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
          )}

          {tasksView === "table" && (
            <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
              <table className="w-full text-xs text-start">
                <thead className="border-b border-border-subtle text-text-muted">
                  <tr>
                    <th className="py-2 text-start">Priority</th>
                    <th className="py-2 text-start">Task Description</th>
                    <th className="py-2 text-start">Assignee</th>
                    <th className="py-2 text-start">Due Time</th>
                    <th className="py-2 text-start">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {tasks.map((t) => (
                    <tr key={t.id} className="hover:bg-surface-base">
                      <td className="py-2.5"><PriorityChip priority={t.priority} /></td>
                      <td className="py-2.5 font-medium text-text-main">{t.title}</td>
                      <td className="py-2.5 text-text-muted">{t.assignee}</td>
                      <td className="py-2.5 font-mono text-text-muted"><Ltr>{t.due}</Ltr></td>
                      <td className="py-2.5">
                        <span className="capitalize px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-base border border-border-subtle">
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tasksView === "gantt" && (
            <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
              <GanttTimeline
                tasks={tasks.map((t, idx) => ({
                  id: t.id,
                  name: t.title,
                  start: `Day 1, 0${9 + idx}:00`,
                  end: `Day 1, 1${0 + idx}:30`,
                  progress: t.status === "done" ? 100 : t.status === "inprogress" ? 50 : 0
                }))}
              />
            </div>
          )}
        </div>
      )}

      {/* 4. COMMS TAB */}
      {activeTab === "comms" && (
        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-5 space-y-4 text-xs animate-fade-in">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div>
              <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
                <Send className="h-4 w-4 text-brand-500" />
                Multi-Channel Communications Stream
              </h3>
              <p className="text-[11px] text-text-muted">SMS, Teams, Email delivery status & provider failover</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
              Provider A: Active • Provider B: Standby
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                id: "COMM-101",
                time: "10:12 AM",
                channel: "sms",
                recipient: "On-Call SCADA Engineers (Tier 1)",
                count: 14,
                delivered: 13,
                failed: 1,
                status: "completed",
                text: "CRITICAL: SCADA containment active at Sohar Plant. On-call engineers report to Command Room immediately."
              },
              {
                id: "COMM-102",
                time: "10:14 AM",
                channel: "teams",
                recipient: "Executive Crisis Committee",
                count: 6,
                delivered: 6,
                failed: 0,
                status: "delivered",
                text: "Situation Report #1: Telemetry anomaly detected and isolated. Reserve margin healthy at 18.4 hours."
              },
              {
                id: "COMM-103",
                time: "10:20 AM",
                channel: "email",
                recipient: "Oman Water Authority Directorate",
                count: 3,
                delivered: 3,
                failed: 0,
                status: "delivered",
                text: "Formal regulatory notification of Desalination Plant Rack 3 temporary throughput modulation."
              }
            ].map((comm) => (
              <div
                key={comm.id}
                className="rounded-lg border border-border-subtle bg-surface-base p-3 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="uppercase text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                      {comm.channel}
                    </span>
                    <span className="font-semibold text-text-main">{comm.recipient}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-text-muted">
                    <span className="flex items-center gap-1">
                      <DeliveryStateDot state="delivered" />
                      <Ltr>{comm.delivered}/{comm.count}</Ltr> Delivered
                    </span>
                    <span className="font-mono"><Ltr>{comm.time}</Ltr></span>
                  </div>
                </div>
                <p className="text-text-muted leading-relaxed font-mono text-[11px] bg-surface-elevated p-2 rounded border border-border-subtle">
                  &quot;{comm.text}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. RESPONDERS TAB */}
      {activeTab === "responders" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in text-xs">
          {/* List */}
          <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-border-subtle pb-2">
              <h3 className="font-bold text-text-main flex items-center gap-2">
                <Users className="h-4 w-4 text-brand-500" />
                Active Incident Responders (14 Online)
              </h3>
              <span className="text-[10px] text-emerald-400 font-semibold">14 Acknowledged</span>
            </div>

            <div className="space-y-2">
              {[
                { name: "Eng. Salem Al-Harthy", role: "Incident Commander", status: "On Site", phone: "+968 9123 4567" },
                { name: "Tariq Al-Lawati", role: "Lead SCADA Engineer", status: "On Site", phone: "+968 9234 5678" },
                { name: "Fatima Al-Balushi", role: "Comms & Public Information", status: "Remote", phone: "+968 9345 6789" },
                { name: "Dr. Hamed Al-Riyami", role: "Water Quality Director", status: "En Route", phone: "+968 9456 7890" },
                { name: "Majid Al-Habsi", role: "Physical Security Lead", status: "On Site", phone: "+968 9567 8901" }
              ].map((resp, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-border-subtle bg-surface-base">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs">
                      {resp.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-text-main">{resp.name}</p>
                      <p className="text-[10px] text-text-muted">{resp.role}</p>
                    </div>
                  </div>
                  <div className="text-end space-y-0.5">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {resp.status}
                    </span>
                    <p className="text-[10px] text-text-muted font-mono"><Ltr>{resp.phone}</Ltr></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Map */}
          <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4 flex flex-col justify-between">
            <div className="border-b border-border-subtle pb-2 mb-2">
              <h3 className="font-bold text-text-main">Sohar Plant Tactical Responder Map</h3>
              <p className="text-[10px] text-text-muted">Live geolocation check-ins and perimeter gates</p>
            </div>
            <div className="flex-1 min-h-[300px]">
              <MapPanel
                points={[
                  { lat: 24.3461, lng: 56.7075, label: "Sohar Desalination Plant (Incident Site)" },
                  { lat: 24.3510, lng: 56.7120, label: "Responder Team Alpha (Gate 2)" },
                  { lat: 24.3390, lng: 56.7010, label: "Water Quality Mobile Lab" }
                ]}
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. DOCUMENTS TAB */}
      {activeTab === "documents" && (
        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-5 space-y-4 text-xs animate-fade-in">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div>
              <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand-500" />
                Associated Playbooks, Diagrams & Evidence
              </h3>
              <p className="text-[11px] text-text-muted">Version-controlled repository files for this incident</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { name: "CP-DESAL-04_SCADA_Containment_SOP_v3.pdf", size: "1.4 MB", type: "PDF Playbook" },
              { name: "Sohar_Plant_Network_Topology_Zone_B.dwg", size: "8.2 MB", type: "CAD Architecture" },
              { name: "Rack3_Telemetry_Packet_Capture_0942GST.pcap", size: "12.8 MB", type: "Network PCAP" },
              { name: "Water_Authority_Regulatory_Notice_Draft.docx", size: "450 KB", type: "Word Document" }
            ].map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border-subtle bg-surface-base">
                <div className="flex items-center gap-2.5 truncate">
                  <FileText className="h-5 w-5 text-brand-400 shrink-0" />
                  <div className="truncate">
                    <p className="font-semibold text-text-main truncate">{doc.name}</p>
                    <p className="text-[10px] text-text-muted">{doc.type} • <Ltr>{doc.size}</Ltr></p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => showToast(`Downloaded: ${doc.name}`)}
                  className="px-2.5 py-1 text-xs rounded border border-border-subtle bg-surface-elevated text-brand-400 font-medium hover:bg-surface-base"
                >
                  Download
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <span className="font-semibold text-text-main block mb-2">Upload Incident Evidence or Photos</span>
            <FileDropzone onFileSelect={(file) => showToast(`Uploaded ${file.name} to incident document store.`)} />
          </div>
        </div>
      )}

      {/* 7. DECISIONS LOG TAB */}
      {activeTab === "decisions" && (
        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-5 space-y-4 text-xs animate-fade-in">
          <div className="border-b border-border-subtle pb-3">
            <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
              <Lock className="h-4 w-4 text-brand-500" />
              Immutable Commander Decision Ledger
            </h3>
            <p className="text-[11px] text-text-muted">
              Every decision is timestamped and cryptographically chained to prevent post-incident tampering.
            </p>
          </div>

          {/* Add Decision Form */}
          <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 p-4 space-y-3">
            <span className="font-bold text-text-main block">Log Formal Commander Decision</span>
            <input
              type="text"
              value={newDecision}
              onChange={(e) => setNewDecision(e.target.value)}
              placeholder="State decision (e.g. Authorized emergency bypass of auxiliary pump line...)"
              className="w-full rounded-lg border border-border-subtle bg-surface-base p-2 text-xs text-text-main focus:ring-1 focus:ring-brand-500"
            />
            <input
              type="text"
              value={newRationale}
              onChange={(e) => setNewRationale(e.target.value)}
              placeholder="State operational rationale and risk justification..."
              className="w-full rounded-lg border border-border-subtle bg-surface-base p-2 text-xs text-text-main focus:ring-1 focus:ring-brand-500"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddDecision}
                disabled={!newDecision.trim()}
                className="px-4 py-1.5 rounded-lg bg-brand-500 font-semibold text-white hover:bg-brand-600 disabled:opacity-40 transition"
              >
                Sign & Commit Decision
              </button>
            </div>
          </div>

          {/* Log List */}
          <div className="space-y-3 pt-2">
            {decisions.map((dec) => (
              <div key={dec.id} className="rounded-lg border border-border-subtle bg-surface-base p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-surface-elevated px-1.5 py-0.5 rounded border border-border-subtle text-brand-400 font-bold">
                      <Ltr>{dec.id}</Ltr>
                    </span>
                    <span className="font-semibold text-text-main">{dec.commander}</span>
                  </div>
                  <span className="text-[10px] text-text-muted font-mono"><Ltr>{dec.timestamp}</Ltr></span>
                </div>
                <p className="font-medium text-text-main text-xs">{dec.decision}</p>
                <p className="text-[11px] text-text-muted italic">Rationale: {dec.rationale}</p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 pt-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Verified & signed in audit ledger</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. AUDIT TRAIL TAB */}
      {activeTab === "audit" && (
        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-5 space-y-4 text-xs animate-fade-in">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div>
              <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-emerald-400" />
                Cryptographic Audit Chain (SHA-256)
              </h3>
              <p className="text-[11px] text-text-muted">
                Every event links hash to previous row: H(n) = SHA256(H(n-1) + timestamp + payload)
              </p>
            </div>
            <button
              type="button"
              onClick={() => showToast("Audit Chain verified: 100% integrity intact (0 broken blocks).")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 font-bold text-white shadow-xs hover:bg-emerald-700 transition"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Verify Chain Integrity
            </button>
          </div>

          <div className="space-y-2">
            {[
              {
                seq: 1248,
                time: "10:18:24",
                action: "INCIDENT_ESCALATION",
                hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                prev: "5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9",
                valid: true
              },
              {
                seq: 1247,
                time: "10:11:05",
                action: "SMS_BROADCAST_TRIGGERED",
                hash: "5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9",
                prev: "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b",
                valid: true
              },
              {
                seq: 1246,
                time: "10:04:19",
                action: "DECISION_COMMITTED_DEC001",
                hash: "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b",
                prev: "d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35",
                valid: true
              }
            ].map((block) => (
              <div key={block.seq} className="p-3 rounded-lg border border-border-subtle bg-surface-base space-y-1 font-mono text-[11px]">
                <div className="flex items-center justify-between text-text-main font-bold">
                  <span>Block #<Ltr>{block.seq}</Ltr> • {block.action}</span>
                  <span className="text-text-muted font-normal"><Ltr>{block.time}</Ltr></span>
                </div>
                <div className="text-[10px] text-text-muted truncate">
                  Hash: <span className="text-emerald-400 font-mono"><Ltr>{block.hash}</Ltr></span>
                </div>
                <div className="text-[10px] text-text-muted truncate">
                  Prev: <span className="text-slate-400 font-mono"><Ltr>{block.prev}</Ltr></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
