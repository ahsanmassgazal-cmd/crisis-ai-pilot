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
  Site,
  Task,
  CriticalFunction,
  RiskItem,
  ApprovalItem,
  DrillItem,
  DocumentItem,
  TenantConfig,
  AttentionQueueItem,
} from "../types";
import { db, populateSeedData, CrisisDexieDB } from "./db";
import {
  SEED_TENANTS,
  EXPANDED_SITES,
  EXPANDED_PEOPLE,
  EXPANDED_PLANS,
  EXPANDED_INCIDENTS,
  EXPANDED_TASKS,
  EXPANDED_CRITICAL_FUNCTIONS,
  EXPANDED_RISKS,
  EXPANDED_DRILLS,
  EXPANDED_DOCUMENTS,
  EXPANDED_DELIVERIES,
  EXPANDED_AUDIT_ROWS,
} from "@/seed/expanded";
import { SEED_RULES, SEED_APPROVALS } from "@/seed/data";
import { computePriorityScore } from "@/lib/engine/priority";
import { verifyAuditChain, computeAuditRowHash, tamperAuditRow } from "@/lib/engine/audit";

// In-memory fallback dataset for SSR / Node testing
class MemoryStore {
  incidents: Incident[] = [...EXPANDED_INCIDENTS];
  people: Person[] = [...EXPANDED_PEOPLE];
  groups: Group[] = [
    { id: "grp-1", tenant_id: "gulf_water", name_en: "Crisis Management Team (CMT)", name_ar: "فريق إدارة الأزمات الرئيسي", type: "core", member_ids: ["usr-001", "usr-002", "usr-003"] },
    { id: "grp-2", tenant_id: "gulf_water", name_en: "Executive Board", name_ar: "مجلس الإدارة التنفيذي", type: "exec", member_ids: ["usr-001"] },
    { id: "grp-3", tenant_id: "gulf_water", name_en: "OT / Cyber Response Team", name_ar: "فريق الاستجابة السيبرانية والتحكم", type: "tech", member_ids: ["usr-003"] },
    { id: "grp-4", tenant_id: "gulf_water", name_en: "Sohar Site Emergency Responders", name_ar: "فريق الطوارئ بموقع صحار", type: "site", member_ids: ["usr-002", "usr-005"] },
  ];
  plans: Plan[] = [...EXPANDED_PLANS];
  messages: Message[] = [
    {
      id: "msg-1",
      incident_id: "inc-2026-001",
      audience_json: { roles: ["commander", "responder"] },
      subject_en: "Evacuation Alert: Sohar Plant Section 4 Maintenance Yard",
      subject_ar: "أمر إخلاء احترازي: ساحة صيانة القطاع 4 بمحطة صحار",
      body_en: "All non-essential engineering teams report to Assembly Point B. Toxic chemical vapor test in progress.",
      body_ar: "على جميع فرق الصيانة غير الأساسية التوجه فوراً لنقطة التجمع ب. جاري فحص الغازات الاحترازي.",
      status: "approved",
      ai_generated: true,
      translation_reviewed: true,
      version: 1,
      approved_by: "usr-001",
      approved_at: "2026-11-24T06:16:00Z",
    },
  ];
  deliveries: Delivery[] = [...EXPANDED_DELIVERIES];
  automations: AutomationRule[] = [...SEED_RULES];
  audit: AuditRow[] = [...EXPANDED_AUDIT_ROWS];
  sites: Site[] = [...EXPANDED_SITES];
  tasks: Task[] = [...EXPANDED_TASKS];
  critical_functions: CriticalFunction[] = [...EXPANDED_CRITICAL_FUNCTIONS];
  risks: RiskItem[] = [...EXPANDED_RISKS];
  drills: DrillItem[] = [...EXPANDED_DRILLS];
  documents: DocumentItem[] = [...EXPANDED_DOCUMENTS];
  approvals: ApprovalItem[] = [...SEED_APPROVALS];
  tenants: TenantConfig[] = [...SEED_TENANTS];

  reset() {
    this.incidents = [...EXPANDED_INCIDENTS];
    this.people = [...EXPANDED_PEOPLE];
    this.plans = [...EXPANDED_PLANS];
    this.deliveries = [...EXPANDED_DELIVERIES];
    this.automations = [...SEED_RULES];
    this.audit = [...EXPANDED_AUDIT_ROWS];
    this.sites = [...EXPANDED_SITES];
    this.tasks = [...EXPANDED_TASKS];
    this.critical_functions = [...EXPANDED_CRITICAL_FUNCTIONS];
    this.risks = [...EXPANDED_RISKS];
    this.drills = [...EXPANDED_DRILLS];
    this.documents = [...EXPANDED_DOCUMENTS];
    this.approvals = [...SEED_APPROVALS];
    this.tenants = [...SEED_TENANTS];
  }
}

const mem = new MemoryStore();
let dbInitialized = false;

async function ensureDbInit() {
  if (typeof window !== "undefined" && db && !dbInitialized) {
    dbInitialized = true;
    try {
      await populateSeedData(db);
    } catch (e) {
      console.warn("IndexedDB initialization warning:", e);
    }
  }
}

export class DexieCrisisRepo implements CrisisRepository {
  private isBrowser(): boolean {
    return typeof window !== "undefined" && !!db;
  }

  incidents = {
    getAll: async (): Promise<Incident[]> => {
      await ensureDbInit();
      if (this.isBrowser()) {
        const rows = await db.incidents.toArray();
        if (rows.length > 0) return rows;
      }
      return [...mem.incidents];
    },
    getById: async (id: string): Promise<Incident | null> => {
      await ensureDbInit();
      if (this.isBrowser()) {
        const row = await db.incidents.get(id);
        if (row) return row;
      }
      return mem.incidents.find((i) => i.id === id) || null;
    },
    create: async (item: Omit<Incident, "id"> | Incident): Promise<Incident> => {
      await ensureDbInit();
      const priority = computePriorityScore({
        severity: item.severity,
        slaMinutes: item.sla_minutes || 60,
        elapsedMinutes: 0,
        criticalFunctionAffected: true,
      });

      const newInc: Incident = {
        ...item,
        id: (item as any).id || `inc-${Date.now()}`,
        priority_score: priority.score,
      };

      if (this.isBrowser()) {
        await db.incidents.put(newInc);
      }
      mem.incidents.unshift(newInc);
      return newInc;
    },
    update: async (id: string, updates: Partial<Incident>): Promise<Incident> => {
      await ensureDbInit();
      if (this.isBrowser()) {
        await db.incidents.update(id, updates);
        const updated = await db.incidents.get(id);
        if (updated) return updated;
      }
      const idx = mem.incidents.findIndex((i) => i.id === id);
      if (idx !== -1) {
        mem.incidents[idx] = { ...mem.incidents[idx], ...updates };
        return mem.incidents[idx];
      }
      throw new Error("Incident not found");
    },
    delete: async (id: string): Promise<boolean> => {
      await ensureDbInit();
      if (this.isBrowser()) {
        await db.incidents.delete(id);
      }
      mem.incidents = mem.incidents.filter((i) => i.id !== id);
      return true;
    },
    activate: async (input: Partial<Incident>): Promise<Incident> => {
      await ensureDbInit();
      const priority = computePriorityScore({
        severity: input.severity || "critical",
        slaMinutes: input.sla_minutes || 60,
        elapsedMinutes: 0,
        criticalFunctionAffected: true,
      });

      const inc: Incident = {
        id: `inc-${Date.now()}`,
        tenant_id: input.tenant_id || "gulf_water",
        number: `INC-2026-00${mem.incidents.length + 1}`,
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

      if (this.isBrowser()) {
        await db.incidents.put(inc);
      }
      mem.incidents.unshift(inc);
      return inc;
    },
    close: async (id: string, reason: string): Promise<void> => {
      await ensureDbInit();
      const updates = { status: "closed" as const, closed_at: new Date().toISOString() };
      if (this.isBrowser()) {
        await db.incidents.update(id, updates);
      }
      const item = mem.incidents.find((i) => i.id === id);
      if (item) {
        item.status = "closed";
        item.closed_at = updates.closed_at;
      }
    },
  };

  people = {
    getAll: async (): Promise<Person[]> => {
      await ensureDbInit();
      if (this.isBrowser()) {
        const rows = await db.people.toArray();
        if (rows.length > 0) return rows;
      }
      return [...mem.people];
    },
    getById: async (id: string): Promise<Person | null> => {
      await ensureDbInit();
      if (this.isBrowser()) {
        const row = await db.people.get(id);
        if (row) return row;
      }
      return mem.people.find((p) => p.id === id) || null;
    },
    create: async (p: any): Promise<Person> => {
      await ensureDbInit();
      const newPerson: Person = { ...p, id: p.id || `usr-${Date.now()}` };
      if (this.isBrowser()) {
        await db.people.put(newPerson);
      }
      mem.people.unshift(newPerson);
      return newPerson;
    },
    update: async (id: string, updates: Partial<Person>): Promise<Person> => {
      await ensureDbInit();
      if (this.isBrowser()) {
        await db.people.update(id, updates);
        const updated = await db.people.get(id);
        if (updated) return updated;
      }
      const idx = mem.people.findIndex((p) => p.id === id);
      if (idx !== -1) {
        mem.people[idx] = { ...mem.people[idx], ...updates };
        return mem.people[idx];
      }
      return updates as Person;
    },
    delete: async (id: string): Promise<boolean> => {
      await ensureDbInit();
      if (this.isBrowser()) {
        await db.people.delete(id);
      }
      mem.people = mem.people.filter((p) => p.id !== id);
      return true;
    },
  };

  groups = {
    getAll: async (): Promise<Group[]> => {
      await ensureDbInit();
      if (this.isBrowser()) {
        const rows = await db.groups.toArray();
        if (rows.length > 0) return rows;
      }
      return [...mem.groups];
    },
    getById: async (id: string): Promise<Group | null> => {
      await ensureDbInit();
      if (this.isBrowser()) {
        const row = await db.groups.get(id);
        if (row) return row;
      }
      return mem.groups.find((g) => g.id === id) || null;
    },
    create: async (g: any): Promise<Group> => {
      await ensureDbInit();
      const newGroup: Group = { ...g, id: g.id || `grp-${Date.now()}` };
      if (this.isBrowser()) {
        await db.groups.put(newGroup);
      }
      mem.groups.push(newGroup);
      return newGroup;
    },
    update: async (id: string, updates: any): Promise<Group> => {
      await ensureDbInit();
      if (this.isBrowser()) {
        await db.groups.update(id, updates);
      }
      const idx = mem.groups.findIndex((g) => g.id === id);
      if (idx !== -1) mem.groups[idx] = { ...mem.groups[idx], ...updates };
      return mem.groups[idx] || updates;
    },
    delete: async (id: string): Promise<boolean> => {
      await ensureDbInit();
      if (this.isBrowser()) await db.groups.delete(id);
      mem.groups = mem.groups.filter((g) => g.id !== id);
      return true;
    },
  };

  plans = {
    getAll: async (): Promise<Plan[]> => {
      await ensureDbInit();
      if (this.isBrowser()) {
        const rows = await db.plans.toArray();
        if (rows.length > 0) return rows;
      }
      return [...mem.plans];
    },
    getById: async (id: string): Promise<Plan | null> => {
      await ensureDbInit();
      if (this.isBrowser()) {
        const row = await db.plans.get(id);
        if (row) return row;
      }
      return mem.plans.find((p) => p.id === id) || null;
    },
    create: async (p: any): Promise<Plan> => {
      await ensureDbInit();
      const newPlan: Plan = { ...p, id: p.id || `plan-${Date.now()}` };
      if (this.isBrowser()) await db.plans.put(newPlan);
      mem.plans.push(newPlan);
      return newPlan;
    },
    update: async (id: string, updates: any): Promise<Plan> => {
      await ensureDbInit();
      if (this.isBrowser()) await db.plans.update(id, updates);
      const idx = mem.plans.findIndex((p) => p.id === id);
      if (idx !== -1) mem.plans[idx] = { ...mem.plans[idx], ...updates };
      return mem.plans[idx] || updates;
    },
    delete: async (id: string): Promise<boolean> => {
      await ensureDbInit();
      if (this.isBrowser()) await db.plans.delete(id);
      mem.plans = mem.plans.filter((p) => p.id !== id);
      return true;
    },
  };

  messages = {
    getAll: async (): Promise<Message[]> => {
      await ensureDbInit();
      if (this.isBrowser()) {
        const rows = await db.messages.toArray();
        if (rows.length > 0) return rows;
      }
      return [...mem.messages];
    },
    getById: async (id: string): Promise<Message | null> => {
      await ensureDbInit();
      if (this.isBrowser()) {
        const row = await db.messages.get(id);
        if (row) return row;
      }
      return mem.messages.find((m) => m.id === id) || null;
    },
    create: async (m: any): Promise<Message> => {
      await ensureDbInit();
      const newMsg: Message = { ...m, id: m.id || `msg-${Date.now()}`, version: 1 };
      if (this.isBrowser()) await db.messages.put(newMsg);
      mem.messages.unshift(newMsg);
      return newMsg;
    },
    update: async (id: string, updates: Partial<Message>): Promise<Message> => {
      await ensureDbInit();
      // Spec: Editing an approved message automatically resets status to pending and bumps version
      const current = await this.messages.getById(id);
      const finalUpdates = {
        ...updates,
        version: (current?.version || 1) + 1,
        status: updates.status || "pending",
      };

      if (this.isBrowser()) {
        await db.messages.update(id, finalUpdates);
        const updated = await db.messages.get(id);
        if (updated) return updated;
      }
      const idx = mem.messages.findIndex((m) => m.id === id);
      if (idx !== -1) {
        mem.messages[idx] = { ...mem.messages[idx], ...finalUpdates };
        return mem.messages[idx];
      }
      return finalUpdates as Message;
    },
    delete: async (id: string): Promise<boolean> => {
      await ensureDbInit();
      if (this.isBrowser()) await db.messages.delete(id);
      mem.messages = mem.messages.filter((m) => m.id !== id);
      return true;
    },
    approve: async (id: string, userId: string): Promise<void> => {
      await ensureDbInit();
      const updates = {
        status: "approved" as const,
        approved_by: userId,
        approved_at: new Date().toISOString(),
      };
      if (this.isBrowser()) {
        await db.messages.update(id, updates);
      }
      const m = mem.messages.find((x) => x.id === id);
      if (m) {
        m.status = "approved";
        m.approved_by = userId;
        m.approved_at = updates.approved_at;
      }
    },
  };

  deliveries = {
    getAll: async (): Promise<Delivery[]> => {
      await ensureDbInit();
      if (this.isBrowser()) {
        const rows = await db.deliveries.toArray();
        if (rows.length > 0) return rows;
      }
      return [...mem.deliveries];
    },
    getByMessageId: async (messageId: string): Promise<Delivery[]> => {
      await ensureDbInit();
      if (this.isBrowser()) {
        return await db.deliveries.where("message_id").equals(messageId).toArray();
      }
      return mem.deliveries.filter((d) => d.message_id === messageId);
    },
    create: async (deliv: Omit<Delivery, "id"> | Delivery): Promise<Delivery> => {
      await ensureDbInit();
      const newD: Delivery = {
        ...deliv,
        id: (deliv as any).id || `deliv-${Date.now()}`,
      };
      if (this.isBrowser()) {
        await db.deliveries.put(newD);
      }
      mem.deliveries.unshift(newD);
      return newD;
    },
    update: async (id: string, updates: Partial<Delivery>): Promise<Delivery> => {
      await ensureDbInit();
      if (this.isBrowser()) {
        await db.deliveries.update(id, updates);
        const updated = await db.deliveries.get(id);
        if (updated) return updated;
      }
      const idx = mem.deliveries.findIndex((d) => d.id === id);
      if (idx !== -1) {
        mem.deliveries[idx] = { ...mem.deliveries[idx], ...updates };
        return mem.deliveries[idx];
      }
      return updates as Delivery;
    },
  };

  automations = {
    getAll: async (): Promise<AutomationRule[]> => {
      await ensureDbInit();
      if (this.isBrowser()) {
        const rows = await db.automations.toArray();
        if (rows.length > 0) return rows;
      }
      return [...mem.automations];
    },
    getById: async (id: string): Promise<AutomationRule | null> => {
      await ensureDbInit();
      if (this.isBrowser()) {
        const row = await db.automations.get(id);
        if (row) return row;
      }
      return mem.automations.find((a) => a.id === id) || null;
    },
    create: async (a: any): Promise<AutomationRule> => {
      await ensureDbInit();
      const newA = { ...a, id: a.id || `rule-${Date.now()}` };
      if (this.isBrowser()) await db.automations.put(newA);
      mem.automations.unshift(newA);
      return newA;
    },
    update: async (id: string, a: any): Promise<AutomationRule> => {
      await ensureDbInit();
      if (this.isBrowser()) await db.automations.update(id, a);
      const idx = mem.automations.findIndex((x) => x.id === id);
      if (idx !== -1) mem.automations[idx] = { ...mem.automations[idx], ...a };
      return mem.automations[idx] || a;
    },
    delete: async (id: string): Promise<boolean> => {
      await ensureDbInit();
      if (this.isBrowser()) await db.automations.delete(id);
      mem.automations = mem.automations.filter((x) => x.id !== id);
      return true;
    },
    setMode: async (scope: string, mode: "auto" | "assisted" | "manual"): Promise<void> => {
      await ensureDbInit();
      const all = await this.automations.getAll();
      for (const rule of all) {
        await this.automations.update(rule.id, { mode_override: mode });
      }
    },
    killSwitch: async (paused: boolean, reason?: string): Promise<void> => {
      await ensureDbInit();
      const all = await this.automations.getAll();
      for (const rule of all) {
        await this.automations.update(rule.id, { enabled: !paused });
      }
    },
  };

  audit = {
    getAll: async (): Promise<AuditRow[]> => {
      await ensureDbInit();
      if (this.isBrowser()) {
        const rows = await db.audit.toArray();
        if (rows.length > 0) return rows.sort((a, b) => a.seq - b.seq);
      }
      return [...mem.audit].sort((a, b) => a.seq - b.seq);
    },
    append: async (
      payload: Omit<AuditRow, "id" | "seq" | "hash" | "prev_hash">
    ): Promise<AuditRow> => {
      await ensureDbInit();
      const rows = await this.audit.getAll();
      const lastRow = rows[rows.length - 1];
      const seq = lastRow ? lastRow.seq + 1 : 1;
      const prev_hash = lastRow ? lastRow.hash : "0000000000000000000000000000000000000000000000000000000000000000";

      const hash = await computeAuditRowHash({
        seq,
        prev_hash,
        created_at: payload.created_at || new Date().toISOString(),
        actor_id: payload.actor_id,
        action: payload.action,
        entity: payload.entity,
        entity_id: payload.entity_id,
        after_json: payload.after_json,
      });

      const newRow: AuditRow = {
        ...payload,
        id: `audit-${seq}`,
        seq,
        created_at: payload.created_at || new Date().toISOString(),
        prev_hash,
        hash,
      };

      if (this.isBrowser()) {
        await db.audit.put(newRow);
      }
      mem.audit.push(newRow);
      return newRow;
    },
    verifyChain: async (): Promise<{ valid: boolean; brokenAt?: number; count: number }> => {
      const rows = await this.audit.getAll();
      return await verifyAuditChain(rows);
    },
    tamperBlock: async (seqOrIndex: number): Promise<boolean> => {
      await ensureDbInit();
      const rows = await this.audit.getAll();
      const tampered = tamperAuditRow(rows, seqOrIndex);
      const target = tampered.find((r) => r.seq === seqOrIndex);
      if (target) {
        if (this.isBrowser()) {
          await db.audit.put(target);
        }
        const idx = mem.audit.findIndex((r) => r.seq === seqOrIndex);
        if (idx !== -1) mem.audit[idx] = target;
        return true;
      }
      return false;
    },
  };

  tasks = {
    getAll: async () => {
      await ensureDbInit();
      if (this.isBrowser()) {
        const rows = await db.tasks.toArray();
        if (rows.length > 0) return rows;
      }
      return [...mem.tasks];
    },
    getById: async (id: string) => {
      await ensureDbInit();
      if (this.isBrowser()) return (await db.tasks.get(id)) || null;
      return mem.tasks.find((t) => t.id === id) || null;
    },
    create: async (t: any) => {
      await ensureDbInit();
      const newT = { ...t, id: t.id || `tsk-${Date.now()}` };
      if (this.isBrowser()) await db.tasks.put(newT);
      mem.tasks.unshift(newT);
      return newT;
    },
    update: async (id: string, updates: any) => {
      await ensureDbInit();
      if (this.isBrowser()) await db.tasks.update(id, updates);
      const idx = mem.tasks.findIndex((t) => t.id === id);
      if (idx !== -1) mem.tasks[idx] = { ...mem.tasks[idx], ...updates };
      return mem.tasks[idx] || updates;
    },
    delete: async (id: string) => {
      await ensureDbInit();
      if (this.isBrowser()) await db.tasks.delete(id);
      mem.tasks = mem.tasks.filter((t) => t.id !== id);
      return true;
    },
  };

  sites = {
    getAll: async () => {
      await ensureDbInit();
      if (this.isBrowser()) {
        const rows = await db.sites.toArray();
        if (rows.length > 0) return rows;
      }
      return [...mem.sites];
    },
    getById: async (id: string) => {
      await ensureDbInit();
      if (this.isBrowser()) return (await db.sites.get(id)) || null;
      return mem.sites.find((s) => s.id === id) || null;
    },
    create: async (s: any) => {
      await ensureDbInit();
      const newS = { ...s, id: s.id || `site-${Date.now()}` };
      if (this.isBrowser()) await db.sites.put(newS);
      mem.sites.push(newS);
      return newS;
    },
    update: async (id: string, updates: any) => {
      await ensureDbInit();
      if (this.isBrowser()) await db.sites.update(id, updates);
      const idx = mem.sites.findIndex((s) => s.id === id);
      if (idx !== -1) mem.sites[idx] = { ...mem.sites[idx], ...updates };
      return mem.sites[idx] || updates;
    },
    delete: async (id: string) => {
      await ensureDbInit();
      if (this.isBrowser()) await db.sites.delete(id);
      mem.sites = mem.sites.filter((s) => s.id !== id);
      return true;
    },
  };

  criticalFunctions = {
    getAll: async () => {
      await ensureDbInit();
      if (this.isBrowser()) {
        const rows = await db.critical_functions.toArray();
        if (rows.length > 0) return rows;
      }
      return [...mem.critical_functions];
    },
    getById: async (id: string) => {
      await ensureDbInit();
      if (this.isBrowser()) return (await db.critical_functions.get(id)) || null;
      return mem.critical_functions.find((c) => c.id === id) || null;
    },
    create: async (c: any) => {
      await ensureDbInit();
      const newC = { ...c, id: c.id || `cf-${Date.now()}` };
      if (this.isBrowser()) await db.critical_functions.put(newC);
      mem.critical_functions.push(newC);
      return newC;
    },
    update: async (id: string, updates: any) => {
      await ensureDbInit();
      if (this.isBrowser()) await db.critical_functions.update(id, updates);
      const idx = mem.critical_functions.findIndex((c) => c.id === id);
      if (idx !== -1) mem.critical_functions[idx] = { ...mem.critical_functions[idx], ...updates };
      return mem.critical_functions[idx] || updates;
    },
    delete: async (id: string) => {
      await ensureDbInit();
      if (this.isBrowser()) await db.critical_functions.delete(id);
      mem.critical_functions = mem.critical_functions.filter((c) => c.id !== id);
      return true;
    },
  };

  risks = {
    getAll: async () => {
      await ensureDbInit();
      if (this.isBrowser()) {
        const rows = await db.risks.toArray();
        if (rows.length > 0) return rows;
      }
      return [...mem.risks];
    },
    getById: async (id: string) => {
      await ensureDbInit();
      if (this.isBrowser()) return (await db.risks.get(id)) || null;
      return mem.risks.find((r) => r.id === id) || null;
    },
    create: async (r: any) => {
      await ensureDbInit();
      const newR = { ...r, id: r.id || `rsk-${Date.now()}` };
      if (this.isBrowser()) await db.risks.put(newR);
      mem.risks.push(newR);
      return newR;
    },
    update: async (id: string, updates: any) => {
      await ensureDbInit();
      if (this.isBrowser()) await db.risks.update(id, updates);
      const idx = mem.risks.findIndex((r) => r.id === id);
      if (idx !== -1) mem.risks[idx] = { ...mem.risks[idx], ...updates };
      return mem.risks[idx] || updates;
    },
    delete: async (id: string) => {
      await ensureDbInit();
      if (this.isBrowser()) await db.risks.delete(id);
      mem.risks = mem.risks.filter((r) => r.id !== id);
      return true;
    },
  };

  drills = {
    getAll: async () => {
      await ensureDbInit();
      if (this.isBrowser()) {
        const rows = await db.drills.toArray();
        if (rows.length > 0) return rows;
      }
      return [...mem.drills];
    },
    getById: async (id: string) => {
      await ensureDbInit();
      if (this.isBrowser()) return (await db.drills.get(id)) || null;
      return mem.drills.find((d) => d.id === id) || null;
    },
    create: async (d: any) => {
      await ensureDbInit();
      const newD = { ...d, id: d.id || `drl-${Date.now()}` };
      if (this.isBrowser()) await db.drills.put(newD);
      mem.drills.push(newD);
      return newD;
    },
    update: async (id: string, updates: any) => {
      await ensureDbInit();
      if (this.isBrowser()) await db.drills.update(id, updates);
      const idx = mem.drills.findIndex((d) => d.id === id);
      if (idx !== -1) mem.drills[idx] = { ...mem.drills[idx], ...updates };
      return mem.drills[idx] || updates;
    },
    delete: async (id: string) => {
      await ensureDbInit();
      if (this.isBrowser()) await db.drills.delete(id);
      mem.drills = mem.drills.filter((d) => d.id !== id);
      return true;
    },
  };

  documents = {
    getAll: async () => {
      await ensureDbInit();
      if (this.isBrowser()) {
        const rows = await db.documents.toArray();
        if (rows.length > 0) return rows;
      }
      return [...mem.documents];
    },
    getById: async (id: string) => {
      await ensureDbInit();
      if (this.isBrowser()) return (await db.documents.get(id)) || null;
      return mem.documents.find((d) => d.id === id) || null;
    },
    create: async (d: any) => {
      await ensureDbInit();
      const newD = { ...d, id: d.id || `doc-${Date.now()}` };
      if (this.isBrowser()) await db.documents.put(newD);
      mem.documents.unshift(newD);
      return newD;
    },
    update: async (id: string, updates: any) => {
      await ensureDbInit();
      if (this.isBrowser()) await db.documents.update(id, updates);
      const idx = mem.documents.findIndex((d) => d.id === id);
      if (idx !== -1) mem.documents[idx] = { ...mem.documents[idx], ...updates };
      return mem.documents[idx] || updates;
    },
    delete: async (id: string) => {
      await ensureDbInit();
      if (this.isBrowser()) await db.documents.delete(id);
      mem.documents = mem.documents.filter((d) => d.id !== id);
      return true;
    },
  };

  approvals = {
    getAll: async () => {
      await ensureDbInit();
      if (this.isBrowser()) {
        const rows = await db.approvals.toArray();
        if (rows.length > 0) return rows;
      }
      return [...mem.approvals];
    },
    getById: async (id: string) => {
      await ensureDbInit();
      if (this.isBrowser()) return (await db.approvals.get(id)) || null;
      return mem.approvals.find((a) => a.id === id) || null;
    },
    create: async (a: any) => {
      await ensureDbInit();
      const newA = { ...a, id: a.id || `appr-${Date.now()}` };
      if (this.isBrowser()) await db.approvals.put(newA);
      mem.approvals.unshift(newA);
      return newA;
    },
    update: async (id: string, updates: any) => {
      await ensureDbInit();
      if (this.isBrowser()) await db.approvals.update(id, updates);
      const idx = mem.approvals.findIndex((a) => a.id === id);
      if (idx !== -1) mem.approvals[idx] = { ...mem.approvals[idx], ...updates };
      return mem.approvals[idx] || updates;
    },
    delete: async (id: string) => {
      await ensureDbInit();
      if (this.isBrowser()) await db.approvals.delete(id);
      mem.approvals = mem.approvals.filter((a) => a.id !== id);
      return true;
    },
  };

  tenants = {
    getAll: async () => {
      await ensureDbInit();
      if (this.isBrowser()) {
        const rows = await db.tenants.toArray();
        if (rows.length > 0) return rows;
      }
      return [...mem.tenants];
    },
    getById: async (id: string) => {
      await ensureDbInit();
      if (this.isBrowser()) return (await db.tenants.get(id)) || null;
      return mem.tenants.find((t) => t.id === id) || null;
    },
    create: async (t: any) => {
      await ensureDbInit();
      const newT = { ...t, id: t.id || `tenant-${Date.now()}` };
      if (this.isBrowser()) await db.tenants.put(newT);
      mem.tenants.push(newT);
      return newT;
    },
    update: async (id: string, updates: any) => {
      await ensureDbInit();
      if (this.isBrowser()) await db.tenants.update(id, updates);
      const idx = mem.tenants.findIndex((t) => t.id === id);
      if (idx !== -1) mem.tenants[idx] = { ...mem.tenants[idx], ...updates };
      return mem.tenants[idx] || updates;
    },
    delete: async (id: string) => {
      await ensureDbInit();
      if (this.isBrowser()) await db.tenants.delete(id);
      mem.tenants = mem.tenants.filter((t) => t.id !== id);
      return true;
    },
  };

  async getAttentionQueue(): Promise<AttentionQueueItem[]> {
    return [
      {
        id: "Q-1",
        title: "SCADA Telemetry Anomaly - Exceeded 15m Initial SLA",
        incidentId: "inc-2026-001",
        incidentTitle: "SCADA Telemetry Anomaly (Sohar Plant)",
        lane: "now",
        priorityScore: 98,
        reason: "SLA_BREACH_15M",
        dueMinutes: 4,
        type: "incident",
        suggestedAction: "Review & Escalate",
      },
      {
        id: "Q-2",
        title: "Bilingual Emergency SMS broadcast awaiting Executive approval",
        incidentId: "inc-2026-001",
        incidentTitle: "SCADA Telemetry Anomaly (Sohar Plant)",
        lane: "now",
        priorityScore: 94,
        reason: "APPROVAL_PENDING_EXECUTIVE",
        dueMinutes: 8,
        type: "approval",
        suggestedAction: "Approve Broadcast",
      },
      {
        id: "Q-3",
        title: "Primary On-Call SCADA Lead offline (Failover triggered to Secondary)",
        incidentId: "inc-2026-001",
        incidentTitle: "SCADA Telemetry Anomaly (Sohar Plant)",
        lane: "now",
        priorityScore: 91,
        reason: "RESPONDER_OFFLINE",
        dueMinutes: 12,
        type: "responder",
        suggestedAction: "Confirm Handover",
      },
      {
        id: "Q-4",
        title: "Draft 2-Hour Situation Report for Crisis Committee",
        incidentId: "inc-2026-001",
        incidentTitle: "SCADA Telemetry Anomaly (Sohar Plant)",
        lane: "next",
        priorityScore: 78,
        reason: "SITREP_DUE_SHIFT",
        dueMinutes: 45,
        type: "task",
        suggestedAction: "Generate with AI",
      },
      {
        id: "Q-5",
        title: "Review Water Authority Regulatory Holding Statement",
        incidentId: "inc-2026-001",
        incidentTitle: "SCADA Telemetry Anomaly (Sohar Plant)",
        lane: "next",
        priorityScore: 72,
        reason: "STAKEHOLDER_UPDATE",
        dueMinutes: 60,
        type: "approval",
        suggestedAction: "Review Statement",
      },
      {
        id: "Q-6",
        title: "Export Audit Ledger Manifest & Verify SHA-256 Hashing",
        incidentId: "inc-2026-001",
        incidentTitle: "SCADA Telemetry Anomaly (Sohar Plant)",
        lane: "later",
        priorityScore: 45,
        reason: "POST_INCIDENT_AUDIT",
        dueMinutes: 240,
        type: "audit",
        suggestedAction: "Run Verification",
      },
    ];
  }

  async resetToSeed(): Promise<void> {
    mem.reset();
    if (this.isBrowser()) {
      await populateSeedData(db, true);
    }
  }
}

export const dexieRepository = new DexieCrisisRepo();
