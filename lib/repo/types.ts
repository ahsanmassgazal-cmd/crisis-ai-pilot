/**
 * Repository interface (Section 16 & Gap-Close Spec)
 *
 * All screens must query against this interface.
 * Stage A/B uses MockRepository backed by memory & Dexie IndexedDB.
 * Stage C swaps to SupabaseRepository without altering UI screens.
 */

export interface Crud<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(item: Omit<T, "id"> | T): Promise<T>;
  update(id: string, updates: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
}

export interface Incident {
  id: string;
  tenant_id: string;
  number: string;
  title_en: string;
  title_ar: string;
  category: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  status: "draft" | "active" | "inprogress" | "monitoring" | "blocked" | "resolved" | "closed";
  plan_id?: string;
  site_id?: string;
  commander_id: string;
  sla_minutes: number;
  started_at: string;
  closed_at?: string;
  priority_score: number;
}

export interface Person {
  id: string;
  tenant_id: string;
  name_en: string;
  name_ar: string;
  employee_code: string;
  department: string;
  group_id?: string;
  site_id: string;
  title: string;
  role?: string;
  email: string;
  phone_e164: string;
  phone?: string;
  teams_handle?: string;
  channel_pref: string[];
  language_pref: "en" | "ar";
  lang?: "en" | "ar";
  on_call: boolean;
  reachability_score: number;
  verified_channels: string[];
}

export interface Group {
  id: string;
  tenant_id: string;
  name_en: string;
  name_ar: string;
  type: string;
  member_ids: string[];
}

export interface Plan {
  id: string;
  tenant_id: string;
  category: string;
  title_en: string;
  title_ar: string;
  severity_default: string;
  owner_role: string;
  steps_count: number;
  version: string;
  steps?: {
    id: string;
    step_number: number;
    title_en: string;
    title_ar: string;
    role: string;
    duration_minutes: number;
  }[];
}

export interface Message {
  id: string;
  incident_id: string;
  audience_json: any;
  template_id?: string;
  body_en: string;
  body_ar: string;
  subject_en: string;
  subject_ar: string;
  status: "draft" | "pending" | "approved" | "rejected" | "sent";
  ai_generated: boolean;
  translation_reviewed: boolean;
  approved_by?: string;
  approved_at?: string;
  version: number;
}

export interface Delivery {
  id: string;
  incident_id?: string;
  tenant_id?: string;
  status?: string;
  created_at?: string;
  message_id: string;
  person_id: string;
  channel: "sms" | "email" | "teams" | "whatsapp" | "voice" | "push";
  provider: string;
  idempotency_key: string;
  state:
    | "queued"
    | "sending"
    | "delivered"
    | "acknowledged"
    | "retrying"
    | "failed_over"
    | "failed"
    | "simulated";
  attempts: number;
  last_error?: string;
  sent_at: string;
  delivered_at?: string;
  acked_at?: string;
  simulated: boolean;
}

export interface AutomationRule {
  id: string;
  name_en: string;
  name_ar: string;
  scope: "tenant" | "plan";
  plan_id?: string;
  trigger_json: any;
  conditions_json: any;
  actions_json: any;
  approval_mode: "none" | "pre_approved" | "human";
  mode_override?: "auto" | "assisted" | "manual";
  enabled: boolean;
  success_rate: number;
  last_run_at?: string;
}

export interface AuditRow {
  id: string;
  tenant_id: string;
  seq: number;
  actor_id: string;
  actor_role: string;
  action: string;
  entity: string;
  entity_id: string;
  before_json?: any;
  after_json?: any;
  reason?: string;
  ip_hint: string;
  created_at: string;
  prev_hash: string;
  hash: string;
}

export interface Site {
  id: string;
  tenant_id: string;
  name_en: string;
  name_ar: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  criticality: "tier1" | "tier2" | "tier3";
  active_incidents_count: number;
}

export interface Task {
  id: string;
  incident_id: string;
  title_en: string;
  title_ar: string;
  owner_id: string;
  owner_name: string;
  priority: "p1" | "p2" | "p3" | "p4";
  status: "todo" | "doing" | "blocked" | "done";
  due_minutes: number;
  priority_score: number;
}

export interface CriticalFunction {
  id: string;
  tenant_id: string;
  name_en: string;
  name_ar: string;
  rto_minutes: number;
  rpo_minutes: number;
  mtpd_minutes: number;
  status: "normal" | "impacted" | "degraded" | "recovering";
  sla_used_percent: number;
  dependencies: string[];
}

export interface RiskItem {
  id: string;
  code?: string;
  tenant_id: string;
  title_en: string;
  title_ar: string;
  likelihood: number;
  impact: number;
  score?: number;
  owner: string;
  controls: string;
  mitigation?: string;
  linked_plan_id: string;
  planId?: string;
}

export interface ApprovalItem {
  id: string;
  incident_id: string;
  incident_title: string;
  type: "stakeholder_brief" | "status_page_publish" | "evacuation_order";
  subject_en: string;
  subject_ar: string;
  body_en: string;
  body_ar: string;
  ai_generated: boolean;
  priority_score: number;
  waiting_minutes: number;
  status: "pending" | "approved" | "rejected";
}

export interface DrillItem {
  id: string;
  tenant_id: string;
  title_en: string;
  title_ar: string;
  date: string;
  type: "unannounced" | "tabletop" | "full_scale";
  participants_count: number;
  score_percent: number;
  status: "completed" | "scheduled" | "in_progress";
}

export interface DocumentItem {
  id: string;
  tenant_id: string;
  title_en: string;
  title_ar: string;
  category: "policy" | "sop" | "diagram" | "agreement";
  version: string;
  updated_at: string;
  file_size_kb: number;
  mime_type: string;
  blob_data?: string;
}

export interface TenantConfig {
  id: string;
  name_en: string;
  name_ar: string;
  country: string;
  package: "Enterprise" | "Professional" | "Pilot";
  brand_color: string;
  logo_url: string;
  active_incidents_count: number;
  responders_count: number;
  readiness_percent: number;
}

export interface AttentionQueueItem {
  id: string;
  title: string;
  incidentId: string;
  incidentTitle: string;
  lane: "now" | "next" | "later";
  priorityScore: number;
  reason: string;
  dueMinutes: number;
  type: "incident" | "approval" | "responder" | "task" | "audit";
  suggestedAction: string;
}

export interface CrisisRepository {
  incidents: Crud<Incident> & {
    activate(input: Partial<Incident>): Promise<Incident>;
    close(id: string, reason: string): Promise<void>;
  };
  people: Crud<Person>;
  groups: Crud<Group>;
  plans: Crud<Plan>;
  messages: Crud<Message> & {
    approve(id: string, userId: string): Promise<void>;
  };
  deliveries: {
    getAll(): Promise<Delivery[]>;
    getByMessageId(messageId: string): Promise<Delivery[]>;
    create(delivery: Omit<Delivery, "id"> | Delivery): Promise<Delivery>;
    update(id: string, updates: Partial<Delivery>): Promise<Delivery>;
  };
  automations: Crud<AutomationRule> & {
    setMode(scope: string, mode: "auto" | "assisted" | "manual"): Promise<void>;
    killSwitch(paused: boolean, reason?: string): Promise<void>;
  };
  audit: {
    getAll(): Promise<AuditRow[]>;
    append(row: Omit<AuditRow, "id" | "seq" | "hash" | "prev_hash">): Promise<AuditRow>;
    verifyChain(): Promise<{ valid: boolean; brokenAt?: number; count: number }>;
    tamperBlock(index: number): Promise<boolean>;
  };
  tasks: Crud<Task>;
  sites: Crud<Site>;
  criticalFunctions: Crud<CriticalFunction>;
  risks: Crud<RiskItem>;
  drills: Crud<DrillItem>;
  documents: Crud<DocumentItem>;
  approvals: Crud<ApprovalItem>;
  tenants: Crud<TenantConfig>;
  getAttentionQueue(): AttentionQueueItem[];
  resetToSeed(): Promise<void>;
}
