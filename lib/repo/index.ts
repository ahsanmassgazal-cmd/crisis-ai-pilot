import {
  CrisisRepository,
  Incident,
  Person,
  Group,
  Plan,
  Message,
  Delivery,
  AutomationRule,
  AuditRow,
} from "./types";
import {
  SEED_INCIDENTS,
  SEED_PEOPLE,
  SEED_RULES,
  SEED_TASKS,
  SEED_SITES,
  SEED_CRITICAL_FUNCTIONS,
  SEED_APPROVALS,
  Site,
  Task,
  CriticalFunction,
  ApprovalItem,
} from "@/seed/data";
import { computePriorityScore } from "@/lib/engine/priority";

let mockIncidents: Incident[] = [...SEED_INCIDENTS];
let mockPeople: Person[] = [...SEED_PEOPLE];
let mockRules: AutomationRule[] = [...SEED_RULES];
let mockTasks: Task[] = [...SEED_TASKS];
let mockSites: Site[] = [...SEED_SITES];
let mockFunctions: CriticalFunction[] = [...SEED_CRITICAL_FUNCTIONS];
let mockApprovals: ApprovalItem[] = [...SEED_APPROVALS];

class MockCrisisRepo implements CrisisRepository {
  incidents = {
    getAll: async () => [...mockIncidents],
    getById: async (id: string) => mockIncidents.find((i) => i.id === id) || null,
    create: async (item: Omit<Incident, "id">) => {
      const priority = computePriorityScore({
        severity: item.severity,
        slaMinutes: item.sla_minutes || 60,
        elapsedMinutes: 0,
        criticalFunctionAffected: true,
      });

      const newInc: Incident = {
        ...item,
        id: `inc-${Date.now()}`,
        priority_score: priority.score,
      };
      mockIncidents.unshift(newInc);
      return newInc;
    },
    update: async (id: string, updates: Partial<Incident>) => {
      const idx = mockIncidents.findIndex((i) => i.id === id);
      if (idx !== -1) {
        mockIncidents[idx] = { ...mockIncidents[idx], ...updates };
        return mockIncidents[idx];
      }
      throw new Error("Incident not found");
    },
    delete: async (id: string) => {
      const idx = mockIncidents.findIndex((i) => i.id === id);
      if (idx !== -1) {
        mockIncidents.splice(idx, 1);
        return true;
      }
      return false;
    },
    activate: async (input: Partial<Incident>) => {
      const priority = computePriorityScore({
        severity: input.severity || "critical",
        slaMinutes: input.sla_minutes || 60,
        elapsedMinutes: 0,
        criticalFunctionAffected: true,
      });

      const inc: Incident = {
        id: `inc-${Date.now()}`,
        tenant_id: input.tenant_id || "gulf_water",
        number: `INC-2026-00${mockIncidents.length + 1}`,
        title_en: input.title_en || "SCADA Telemetry Disruption",
        title_ar: input.title_ar || "خلل في شبكة التحكم الإشرافي SCADA",
        category: input.category || "cyber",
        severity: input.severity || "critical",
        status: "active",
        commander_id: input.commander_id || "usr-001",
        sla_minutes: input.sla_minutes || 60,
        started_at: new Date().toISOString(),
        priority_score: priority.score,
      };
      mockIncidents.unshift(inc);
      return inc;
    },
    close: async (id: string, reason: string) => {
      const inc = mockIncidents.find((i) => i.id === id);
      if (inc) {
        inc.status = "closed";
        inc.closed_at = new Date().toISOString();
      }
    },
  };

  people = {
    getAll: async () => [...mockPeople],
    getById: async (id: string) => mockPeople.find((p) => p.id === id) || null,
    create: async (p: any) => {
      mockPeople.unshift(p);
      return p;
    },
    update: async (id: string, p: any) => {
      const idx = mockPeople.findIndex((x) => x.id === id);
      if (idx !== -1) {
        mockPeople[idx] = { ...mockPeople[idx], ...p };
        return mockPeople[idx];
      }
      return p;
    },
    delete: async (id: string) => {
      mockPeople = mockPeople.filter((p) => p.id !== id);
      return true;
    },
  };

  groups = {
    getAll: async () => [
      { id: "grp-1", tenant_id: "gulf_water", name_en: "Crisis Management Team (CMT)", name_ar: "فريق إدارة الأزمات الرئيسي", type: "core", member_ids: ["usr-001", "usr-002", "usr-003"] },
      { id: "grp-2", tenant_id: "gulf_water", name_en: "Executive Board", name_ar: "مجلس الإدارة التنفيذي", type: "exec", member_ids: ["usr-001"] },
      { id: "grp-3", tenant_id: "gulf_water", name_en: "OT / Cyber Response Team", name_ar: "فريق الاستجابة السيبرانية والتحكم", type: "tech", member_ids: ["usr-003"] },
      { id: "grp-4", tenant_id: "gulf_water", name_en: "Sohar Site Emergency Responders", name_ar: "فريق الطوارئ بموقع صحار", type: "site", member_ids: ["usr-002", "usr-005"] },
    ],
    getById: async (id: string) => null,
    create: async (g: any) => g,
    update: async (_id: string, g: any) => g,
    delete: async () => true,
  };

  plans = {
    getAll: async () => [
      { id: "plan-cyber", tenant_id: "gulf_water", category: "cyber", title_en: "Industrial OT / SCADA Cyber Attack Response", title_ar: "دليل الاستجابة للهجمات السيبرانية على شبكات التحكم", severity_default: "critical", owner_role: "commander", steps_count: 10, version: "2.4" },
      { id: "plan-fire", tenant_id: "gulf_water", category: "fire", title_en: "Chemical Storage & Refinery Fire Evacuation", title_ar: "خطة إخلاء حريق مستودعات الكيماويات ومحطات التكرير", severity_default: "critical", owner_role: "commander", steps_count: 8, version: "1.8" },
      { id: "plan-power", tenant_id: "gulf_water", category: "power", title_en: "Total Power Blackout & Generator Failover", title_ar: "إجراءات الانقطاع الشامل للكهرباء وتشغيل المولدات", severity_default: "high", owner_role: "continuity", steps_count: 6, version: "3.1" },
      { id: "plan-weather", tenant_id: "gulf_water", category: "weather", title_en: "Tropical Cyclone & Flash Flood Preparedness", title_ar: "خطة الطوارئ للأنواء المناخية الاستثنائية والفيضانات", severity_default: "high", owner_role: "commander", steps_count: 12, version: "2.0" },
      { id: "plan-supply", tenant_id: "gulf_water", category: "supply", title_en: "Critical Chemical Reagent Supply Chain Continuity", title_ar: "خطة استدامة توريد الكواشف الكيميائية الحيوية", severity_default: "medium", owner_role: "continuity", steps_count: 7, version: "1.2" },
    ],
    getById: async (id: string) => null,
    create: async (p: any) => p,
    update: async (_id: string, p: any) => p,
    delete: async () => true,
  };

  messages = {
    getAll: async () => [],
    getById: async () => null,
    create: async (m: any) => m,
    update: async (_id: string, m: any) => m,
    delete: async () => true,
    approve: async (id: string, userId: string) => {
      const app = mockApprovals.find((a) => a.id === id);
      if (app) app.status = "approved";
    },
  };

  deliveries = {
    getAll: async () => [],
    getByMessageId: async () => [],
  };

  automations = {
    getAll: async () => [...mockRules],
    getById: async (id: string) => mockRules.find((r) => r.id === id) || null,
    create: async (a: any) => {
      mockRules.unshift(a);
      return a;
    },
    update: async (id: string, a: any) => {
      const idx = mockRules.findIndex((r) => r.id === id);
      if (idx !== -1) {
        mockRules[idx] = { ...mockRules[idx], ...a };
        return mockRules[idx];
      }
      return a;
    },
    delete: async (id: string) => {
      mockRules = mockRules.filter((r) => r.id !== id);
      return true;
    },
    setMode: async (scope: string, mode: "auto" | "assisted" | "manual") => {},
    killSwitch: async (paused: boolean, reason?: string) => {},
  };

  audit = {
    getAll: async () => [],
    verifyChain: async () => ({ valid: true, count: 1248 }),
  };

  // Helper getters for UI views
  getSites = () => [...mockSites];
  getTasks = () => [...mockTasks];
  getCriticalFunctions = () => [...mockFunctions];
  getApprovals = () => [...mockApprovals];
  getAttentionQueue = () => [
    {
      id: "Q-1",
      title: "SCADA Telemetry Anomaly - Exceeded 15m Initial SLA",
      incidentId: "inc-1",
      incidentTitle: "SCADA Telemetry Anomaly (Sohar Plant)",
      lane: "now" as const,
      priorityScore: 98,
      reason: "SLA_BREACH_15M",
      dueMinutes: 4,
      type: "incident",
      suggestedAction: "Review & Escalate"
    },
    {
      id: "Q-2",
      title: "Bilingual Emergency SMS broadcast awaiting Executive approval",
      incidentId: "inc-1",
      incidentTitle: "SCADA Telemetry Anomaly (Sohar Plant)",
      lane: "now" as const,
      priorityScore: 94,
      reason: "APPROVAL_PENDING_EXECUTIVE",
      dueMinutes: 8,
      type: "approval",
      suggestedAction: "Approve Broadcast"
    },
    {
      id: "Q-3",
      title: "Primary On-Call SCADA Lead offline (Failover triggered to Secondary)",
      incidentId: "inc-1",
      incidentTitle: "SCADA Telemetry Anomaly (Sohar Plant)",
      lane: "now" as const,
      priorityScore: 91,
      reason: "RESPONDER_OFFLINE",
      dueMinutes: 12,
      type: "responder",
      suggestedAction: "Confirm Handover"
    },
    {
      id: "Q-4",
      title: "Draft 2-Hour Situation Report for Crisis Committee",
      incidentId: "inc-1",
      incidentTitle: "SCADA Telemetry Anomaly (Sohar Plant)",
      lane: "next" as const,
      priorityScore: 78,
      reason: "SITREP_DUE_SHIFT",
      dueMinutes: 45,
      type: "task",
      suggestedAction: "Generate with AI"
    },
    {
      id: "Q-5",
      title: "Review Water Authority Regulatory Holding Statement",
      incidentId: "inc-1",
      incidentTitle: "SCADA Telemetry Anomaly (Sohar Plant)",
      lane: "next" as const,
      priorityScore: 72,
      reason: "STAKEHOLDER_UPDATE",
      dueMinutes: 60,
      type: "approval",
      suggestedAction: "Review Statement"
    },
    {
      id: "Q-6",
      title: "Export Audit Ledger Manifest & Verify SHA-256 Hashing",
      incidentId: "inc-1",
      incidentTitle: "SCADA Telemetry Anomaly (Sohar Plant)",
      lane: "later" as const,
      priorityScore: 45,
      reason: "POST_INCIDENT_AUDIT",
      dueMinutes: 240,
      type: "audit",
      suggestedAction: "Run Verification"
    }
  ];
}

const singletonRepo = new MockCrisisRepo();

export const mockRepository = singletonRepo;

export function useRepo(): MockCrisisRepo {
  return singletonRepo;
}

