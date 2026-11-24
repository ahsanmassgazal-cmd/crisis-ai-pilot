import Dexie, { type EntityTable } from "dexie";
import {
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
} from "@/lib/repo/types";
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

export class CrisisDexieDB extends Dexie {
  incidents!: EntityTable<Incident, "id">;
  people!: EntityTable<Person, "id">;
  groups!: EntityTable<Group, "id">;
  plans!: EntityTable<Plan, "id">;
  messages!: EntityTable<Message, "id">;
  deliveries!: EntityTable<Delivery, "id">;
  automations!: EntityTable<AutomationRule, "id">;
  audit!: EntityTable<AuditRow, "id">;
  sites!: EntityTable<Site, "id">;
  tasks!: EntityTable<Task, "id">;
  critical_functions!: EntityTable<CriticalFunction, "id">;
  risks!: EntityTable<RiskItem, "id">;
  drills!: EntityTable<DrillItem, "id">;
  documents!: EntityTable<DocumentItem, "id">;
  approvals!: EntityTable<ApprovalItem, "id">;
  tenants!: EntityTable<TenantConfig, "id">;

  constructor() {
    super("CrisisAIPilotDB");
    this.version(1).stores({
      incidents: "id, tenant_id, number, severity, status, priority_score, started_at",
      people: "id, tenant_id, employee_code, department, site_id, on_call, language_pref",
      groups: "id, tenant_id, type",
      plans: "id, tenant_id, category, version",
      messages: "id, incident_id, status, version",
      deliveries: "id, message_id, person_id, channel, provider, idempotency_key, state",
      automations: "id, scope, plan_id, enabled",
      audit: "id, tenant_id, seq, hash, prev_hash, created_at",
      sites: "id, tenant_id, city, criticality",
      tasks: "id, incident_id, owner_id, priority, status",
      critical_functions: "id, tenant_id, status",
      risks: "id, tenant_id, code",
      drills: "id, tenant_id, status",
      documents: "id, tenant_id, category, title_en, updated_at",
      approvals: "id, incident_id, status, type",
      tenants: "id, package",
    });
  }
}

export const db = typeof window !== "undefined" ? new CrisisDexieDB() : (null as unknown as CrisisDexieDB);

export async function populateSeedData(database: CrisisDexieDB, forceReset = false): Promise<void> {
  if (!database) return;

  const count = await database.incidents.count();
  if (count > 0 && !forceReset) {
    return; // Already populated
  }

  await database.transaction(
    "rw",
    [
      database.incidents,
      database.people,
      database.groups,
      database.plans,
      database.messages,
      database.deliveries,
      database.automations,
      database.audit,
      database.sites,
      database.tasks,
      database.critical_functions,
      database.risks,
      database.drills,
      database.documents,
      database.approvals,
      database.tenants,
    ],
    async () => {
      // Clear tables
      await Promise.all([
        database.incidents.clear(),
        database.people.clear(),
        database.groups.clear(),
        database.plans.clear(),
        database.messages.clear(),
        database.deliveries.clear(),
        database.automations.clear(),
        database.audit.clear(),
        database.sites.clear(),
        database.tasks.clear(),
        database.critical_functions.clear(),
        database.risks.clear(),
        database.drills.clear(),
        database.documents.clear(),
        database.approvals.clear(),
        database.tenants.clear(),
      ]);

      // Bulk add expanded seed datasets
      await Promise.all([
        database.tenants.bulkAdd(SEED_TENANTS),
        database.sites.bulkAdd(EXPANDED_SITES),
        database.people.bulkAdd(EXPANDED_PEOPLE),
        database.plans.bulkAdd(EXPANDED_PLANS),
        database.incidents.bulkAdd(EXPANDED_INCIDENTS),
        database.tasks.bulkAdd(EXPANDED_TASKS),
        database.critical_functions.bulkAdd(EXPANDED_CRITICAL_FUNCTIONS),
        database.risks.bulkAdd(EXPANDED_RISKS),
        database.drills.bulkAdd(EXPANDED_DRILLS),
        database.documents.bulkAdd(EXPANDED_DOCUMENTS),
        database.deliveries.bulkAdd(EXPANDED_DELIVERIES),
        database.audit.bulkAdd(EXPANDED_AUDIT_ROWS),
        database.automations.bulkAdd(SEED_RULES),
        database.approvals.bulkAdd(SEED_APPROVALS),
        database.groups.bulkAdd([
          { id: "grp-1", tenant_id: "gulf_water", name_en: "Crisis Management Team (CMT)", name_ar: "فريق إدارة الأزمات الرئيسي", type: "core", member_ids: ["usr-001", "usr-002", "usr-003"] },
          { id: "grp-2", tenant_id: "gulf_water", name_en: "Executive Board", name_ar: "مجلس الإدارة التنفيذي", type: "exec", member_ids: ["usr-001"] },
          { id: "grp-3", tenant_id: "gulf_water", name_en: "OT / Cyber Response Team", name_ar: "فريق الاستجابة السيبرانية والتحكم", type: "tech", member_ids: ["usr-003"] },
          { id: "grp-4", tenant_id: "gulf_water", name_en: "Sohar Site Emergency Responders", name_ar: "فريق الطوارئ بموقع صحار", type: "site", member_ids: ["usr-002", "usr-005"] },
        ]),
        database.messages.bulkAdd([
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
        ]),
      ]);
    }
  );
}
