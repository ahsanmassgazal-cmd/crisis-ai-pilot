import { Incident, Person, Group, Plan, AutomationRule, AuditRow } from "@/lib/repo/types";

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
  tenant_id: string;
  title_en: string;
  title_ar: string;
  likelihood: number; // 1-5
  impact: number;     // 1-5
  owner: string;
  controls: string;
  linked_plan_id: string;
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

export const SEED_SITES: Site[] = [
  {
    id: "site-sohar",
    tenant_id: "gulf_water",
    name_en: "Sohar Desalination & Energy Facility",
    name_ar: "محطة صحار لتحلية المياه وتوليد الطاقة",
    city: "Sohar",
    country: "Oman",
    lat: 24.364,
    lng: 56.7468,
    criticality: "tier1",
    active_incidents_count: 2,
  },
  {
    id: "site-muscat-hq",
    tenant_id: "gulf_water",
    name_en: "Muscat Central Operations & Plant 1",
    name_ar: "مركز العمليات الرئيسي ومحطة مسقط 1",
    city: "Muscat",
    country: "Oman",
    lat: 23.588,
    lng: 58.3829,
    criticality: "tier1",
    active_incidents_count: 0,
  },
  {
    id: "site-salalah",
    tenant_id: "gulf_water",
    name_en: "Salalah Coastal Pumping Hub",
    name_ar: "مركز ضخ صلالة الساحلي",
    city: "Salalah",
    country: "Oman",
    lat: 17.0151,
    lng: 54.0924,
    criticality: "tier2",
    active_incidents_count: 1,
  },
  {
    id: "site-nizwa",
    tenant_id: "gulf_water",
    name_en: "Nizwa Interior Reservoir & Storage",
    name_ar: "خزان ومستودع نزوى الإقليمي",
    city: "Nizwa",
    country: "Oman",
    lat: 22.9333,
    lng: 57.5333,
    criticality: "tier2",
    active_incidents_count: 0,
  },
  {
    id: "site-sur",
    tenant_id: "gulf_water",
    name_en: "Sur Water Purification Station",
    name_ar: "محطة تنقية المياه بصور",
    city: "Sur",
    country: "Oman",
    lat: 22.5667,
    lng: 59.5289,
    criticality: "tier3",
    active_incidents_count: 0,
  },
  {
    id: "site-duqm",
    tenant_id: "gulf_water",
    name_en: "Duqm Port Utility Grid Hub",
    name_ar: "مجمع خدمات ميناء الدقم الصناعي",
    city: "Duqm",
    country: "Oman",
    lat: 19.6644,
    lng: 57.7036,
    criticality: "tier1",
    active_incidents_count: 0,
  },
];

export const SEED_INCIDENTS: Incident[] = [
  {
    id: "inc-2026-001",
    tenant_id: "gulf_water",
    number: "INC-2026-001",
    title_en: "SCADA Network Anomaly & Sensor Desynchronization",
    title_ar: "خلل في شبكة التحكم الإشرافي SCADA وعدم تزامن الحساسات",
    category: "cyber",
    severity: "critical",
    status: "active",
    plan_id: "plan-cyber",
    commander_id: "usr-001",
    sla_minutes: 60,
    started_at: "2026-11-24T06:15:00Z",
    priority_score: 95,
  },
  {
    id: "inc-2026-002",
    tenant_id: "gulf_water",
    number: "INC-2026-002",
    title_en: "Chemical Reagent Supplier Logistics Halt (Sohar Port)",
    title_ar: "توقف توريد الكواشف الكيميائية الحيوية (ميناء صحار)",
    category: "supply",
    severity: "medium",
    status: "active",
    plan_id: "plan-supply",
    commander_id: "usr-002",
    sla_minutes: 240,
    started_at: "2026-11-24T04:30:00Z",
    priority_score: 55,
  },
  {
    id: "inc-2026-003",
    tenant_id: "gulf_water",
    number: "INC-2026-003",
    title_en: "Tropical Cyclone Alert & Coastal Surge Warning",
    title_ar: "إنذار مداري وتحذير من فيضان ساحلي في ظفار",
    category: "weather",
    severity: "low",
    status: "monitoring",
    plan_id: "plan-weather",
    commander_id: "usr-003",
    sla_minutes: 720,
    started_at: "2026-11-23T18:00:00Z",
    priority_score: 35,
  },
  {
    id: "inc-2026-004",
    tenant_id: "gulf_water",
    number: "INC-2026-004",
    title_en: "Duqm High-Voltage Feeder Trip (Restored)",
    title_ar: "انقطاع خط الجهد العالي في محطة الدقم (تم الاسترداد)",
    category: "power",
    severity: "high",
    status: "resolved",
    plan_id: "plan-power",
    commander_id: "usr-001",
    sla_minutes: 120,
    started_at: "2026-11-20T10:00:00Z",
    closed_at: "2026-11-20T11:45:00Z",
    priority_score: 20,
  },
  {
    id: "inc-2026-005",
    tenant_id: "gulf_water",
    number: "INC-2026-005",
    title_en: "Desalination Unit 3 Reverse Osmosis Membrane Rupture",
    title_ar: "تلف غشاء التناضح العكسي في وحدة التحلية 3",
    category: "environmental",
    severity: "medium",
    status: "closed",
    plan_id: "plan-water",
    commander_id: "usr-004",
    sla_minutes: 360,
    started_at: "2026-11-15T08:00:00Z",
    closed_at: "2026-11-15T12:30:00Z",
    priority_score: 15,
  },
];

export const SEED_TASKS: Task[] = [
  {
    id: "tsk-001",
    incident_id: "inc-2026-001",
    title_en: "Manually isolate Section 4 telemetry valves",
    title_ar: "عزل صمامات القياس عن بُعد يدوياً في القطاع 4",
    owner_id: "usr-101",
    owner_name: "Eng. Salim Al-Harthy",
    priority: "p1",
    status: "doing",
    due_minutes: 15,
    priority_score: 92,
  },
  {
    id: "tsk-002",
    incident_id: "inc-2026-001",
    title_en: "Engage analog backup chlorine dosing controllers",
    title_ar: "تشغيل وحدات التحكم التناظرية الاحتياطية للكلور",
    owner_id: "usr-102",
    owner_name: "Fatima Al-Riyami",
    priority: "p1",
    status: "doing",
    due_minutes: 25,
    priority_score: 88,
  },
  {
    id: "tsk-003",
    incident_id: "inc-2026-001",
    title_en: "Draft and submit mandatory 1-hour regulatory notice",
    title_ar: "صياغة وتقديم الإخطار التنظيمي الإلزامي خلال ساعة",
    owner_id: "usr-103",
    owner_name: "Nasser Al-Balushi",
    priority: "p1",
    status: "blocked",
    due_minutes: 30,
    priority_score: 85,
  },
  {
    id: "tsk-004",
    incident_id: "inc-2026-001",
    title_en: "Cross-check reservoir telemetry with physical dipstick gauges",
    title_ar: "مطابقة قراءات الخزانات عن بُعد مع القياسات اليدوية الميدانية",
    owner_id: "usr-104",
    owner_name: "Hamad Al-Amri",
    priority: "p2",
    status: "todo",
    due_minutes: 90,
    priority_score: 64,
  },
  {
    id: "tsk-005",
    incident_id: "inc-2026-002",
    title_en: "Activate secondary chemical supplier from Abu Dhabi",
    title_ar: "تفعيل المورد الكيميائي الثانوي البديل من أبوظبي",
    owner_id: "usr-105",
    owner_name: "Dr. Laila Al-Farsi",
    priority: "p2",
    status: "doing",
    due_minutes: 180,
    priority_score: 52,
  },
];

export const SEED_CRITICAL_FUNCTIONS: CriticalFunction[] = [
  {
    id: "cf-01",
    tenant_id: "gulf_water",
    name_en: "Potable Water Desalination Generation",
    name_ar: "إنتاج مياه الشرب المحلاة",
    rto_minutes: 120,
    rpo_minutes: 30,
    mtpd_minutes: 480,
    status: "degraded",
    sla_used_percent: 65,
    dependencies: ["Sohar Plant Unit 1-4", "Primary Substation Grid"],
  },
  {
    id: "cf-02",
    tenant_id: "gulf_water",
    name_en: "High-Pressure Transmission Pumping",
    name_ar: "ضخ شبكات النقل الرئيسية عالية الضغط",
    rto_minutes: 60,
    rpo_minutes: 15,
    mtpd_minutes: 240,
    status: "normal",
    sla_used_percent: 10,
    dependencies: ["Muscat Booster Pump Hub", "SCADA Telemetry"],
  },
  {
    id: "cf-03",
    tenant_id: "gulf_water",
    name_en: "Industrial Water Quality Verification & Compliance",
    name_ar: "فحص ومطابقة جودة المياه وفق المواصفات القياسية",
    rto_minutes: 240,
    rpo_minutes: 60,
    mtpd_minutes: 720,
    status: "recovering",
    sla_used_percent: 45,
    dependencies: ["Central Lab Testing Network"],
  },
  {
    id: "cf-04",
    tenant_id: "gulf_water",
    name_en: "Emergency Municipal Grid Distribution",
    name_ar: "التوزيع الطارئ لشبكات المياه البلدية",
    rto_minutes: 45,
    rpo_minutes: 10,
    mtpd_minutes: 180,
    status: "normal",
    sla_used_percent: 5,
    dependencies: ["Nizwa Regional Storage Reservoir"],
  },
];

export const SEED_APPROVALS: ApprovalItem[] = [
  {
    id: "appr-001",
    incident_id: "inc-2026-001",
    incident_title: "SCADA Telemetry Network Anomaly",
    type: "evacuation_order",
    subject_en: "Evacuation Alert: Sohar Plant Section 4 Maintenance Yard",
    subject_ar: "أمر إخلاء احترازي: ساحة صيانة القطاع 4 بمحطة صحار",
    body_en: "All non-essential engineering teams report to Assembly Point B. Toxic chemical vapor test in progress.",
    body_ar: "على جميع فرق الصيانة غير الأساسية التوجه فوراً لنقطة التجمع ب. جاري فحص الغازات الاحترازي.",
    ai_generated: true,
    priority_score: 95,
    waiting_minutes: 6,
    status: "pending",
  },
  {
    id: "appr-002",
    incident_id: "inc-2026-001",
    incident_title: "SCADA Telemetry Network Anomaly",
    type: "status_page_publish",
    subject_en: "Public Notice: Municipal Supply Continuous & Unaffected",
    subject_ar: "بيان عام: إمدادات المياه البلدية مستمرة دون انقطاع",
    body_en: "Strategic water reserves across North Batinah remain at 96% capacity. No disruption to residential supply.",
    body_ar: "مخزون المياه الاستراتيجي في شمال الباطنة عند نسبة 96%. لا يوجد أي انقطاع في إمدادات المنازل.",
    ai_generated: true,
    priority_score: 82,
    waiting_minutes: 14,
    status: "pending",
  },
  {
    id: "appr-003",
    incident_id: "inc-2026-002",
    incident_title: "Chemical Supplier Disruption",
    type: "stakeholder_brief",
    subject_en: "Executive Board Briefing: Emergency Supply Line Authorization",
    subject_ar: "إحاطة مجلس الإدارة: اعتماد ميزانية خط التوريد البديل السريع",
    body_en: "Requesting immediate approval to dispatch emergency reagent convoys via Hatta crossing.",
    body_ar: "طلب الموافقة الفورية على تسيير قوافل الكواشف الطارئة عبر منفذ حتا الحدودي.",
    ai_generated: false,
    priority_score: 74,
    waiting_minutes: 28,
    status: "pending",
  },
];

export const SEED_RULES: AutomationRule[] = [
  {
    id: "rule-01",
    name_en: "Escalate to Level 2 Incident Team if Unacknowledged in 5m",
    name_ar: "تصعيد إلى فريق المستوى 2 في حال عدم تأكيد الاستلام خلال 5 دقائق",
    scope: "tenant",
    trigger_json: { type: "unacked_timeout", minutes: 5 },
    conditions_json: { severity: ["critical", "high"] },
    actions_json: { escalate_level: 2, notify_channels: ["sms", "push"] },
    approval_mode: "none",
    enabled: true,
    success_rate: 98.4,
    last_run_at: "2026-11-24T06:20:00Z",
  },
  {
    id: "rule-02",
    name_en: "SEV1 Executive Notification Escalation (10m SLA)",
    name_ar: "إشعار الإدارة التنفيذية الفوري بحوادث المستوى الحرج SEV1",
    scope: "tenant",
    trigger_json: { type: "incident_active", severity: "critical" },
    conditions_json: { elapsed: 10 },
    actions_json: { notify_group: "executives", channels: ["sms", "email", "teams"] },
    approval_mode: "none",
    enabled: true,
    success_rate: 100,
    last_run_at: "2026-11-24T06:25:00Z",
  },
  {
    id: "rule-03",
    name_en: "Automated Task SLA Reminder (15m Before Due)",
    name_ar: "تذكير تلقائي قبل موعد انتهاء المهمة بـ 15 دقيقة",
    scope: "tenant",
    trigger_json: { type: "task_due_approaching", offset_min: 15 },
    conditions_json: { status: ["todo", "doing"] },
    actions_json: { notify_owner: true, channel: "push" },
    approval_mode: "none",
    enabled: true,
    success_rate: 97.1,
    last_run_at: "2026-11-24T06:30:00Z",
  },
  {
    id: "rule-04",
    name_en: "SCADA Telemetry Anomaly Ingestion Trigger",
    name_ar: "محفز رصد قراءات أجهزة التحكم الإشرافي SCADA الشاذة",
    scope: "plan",
    plan_id: "plan-cyber",
    trigger_json: { source: "monitoring_feed", threshold: 49.0 },
    conditions_json: { duration_min: 2 },
    actions_json: { suggest_incident: true, category: "cyber", severity: "critical" },
    approval_mode: "human",
    enabled: true,
    success_rate: 94.8,
    last_run_at: "2026-11-24T06:14:00Z",
  },
  {
    id: "rule-05",
    name_en: "Failover Primary SMS A to SMS Route B on Network Delivery Error",
    name_ar: "تحويل مسار رسائل SMS الرئيسي إلى المسار البديل عند تعثر التسليم",
    scope: "tenant",
    trigger_json: { type: "delivery_error", provider: "sms_a" },
    conditions_json: { retries: 2 },
    actions_json: { failover_provider: "sms_b", log_audit: true },
    approval_mode: "none",
    enabled: true,
    success_rate: 99.6,
    last_run_at: "2026-11-24T06:18:00Z",
  },
  {
    id: "rule-06",
    name_en: "Draft Public Status Page Update on Incident Status Change",
    name_ar: "صياغة مسودة تحديث صفحة الحالة العامة عند تغير حالة الحادثة",
    scope: "tenant",
    trigger_json: { type: "status_changed", to: "monitoring" },
    conditions_json: {},
    actions_json: { ai_draft_public_status: true, require_approval: true },
    approval_mode: "human",
    enabled: true,
    success_rate: 100,
    last_run_at: "2026-11-23T18:05:00Z",
  },
  {
    id: "rule-07",
    name_en: "Quarterly Critical Infrastructure Drill Scheduler",
    name_ar: "جدولة التمارين الربع سنوية للبنية التحتية الحيوية",
    scope: "tenant",
    trigger_json: { type: "cron", schedule: "every_90_days" },
    conditions_json: {},
    actions_json: { create_drill_record: true },
    approval_mode: "none",
    enabled: true,
    success_rate: 100,
    last_run_at: "2026-11-01T00:00:00Z",
  },
  {
    id: "rule-08",
    name_en: "Weekly Executive Readiness Briefing Delivery",
    name_ar: "إرسال التقرير الأسبوعي للجاهزية إلى القيادات التنفيذية",
    scope: "tenant",
    trigger_json: { type: "cron", schedule: "every_monday" },
    conditions_json: {},
    actions_json: { generate_readiness_pdf: true, email_to_executives: true },
    approval_mode: "none",
    enabled: true,
    success_rate: 96.0,
    last_run_at: "2026-11-23T08:00:00Z",
  },
  {
    id: "rule-09",
    name_en: "Flag Documents & Operational Playbooks Expiring in 30 Days",
    name_ar: "تنبيه بالمستندات والأدلة التشغيلية التي تنتهي خلال 30 يوماً",
    scope: "tenant",
    trigger_json: { type: "doc_expiry", days_before: 30 },
    conditions_json: {},
    actions_json: { notify_owner: true, add_to_attention_queue: true },
    approval_mode: "none",
    enabled: true,
    success_rate: 100,
    last_run_at: "2026-11-24T00:00:00Z",
  },
  {
    id: "rule-10",
    name_en: "Flag Unverified Contact Channels in People Directory",
    name_ar: "رصد وتنبيه جهات الاتصال غير الموثقة في دليل الموظفين",
    scope: "tenant",
    trigger_json: { type: "person_audit" },
    conditions_json: { verified_channels_count: 0 },
    actions_json: { request_verification_sms: true },
    approval_mode: "none",
    enabled: false,
    success_rate: 92.5,
    last_run_at: "2026-11-22T04:00:00Z",
  },
  {
    id: "rule-11",
    name_en: "Auto-Populate Crisis Plan Tasks on Incident Activation",
    name_ar: "الإدراج التلقائي لمهام خطة الطوارئ فور تفعيل الحادثة",
    scope: "tenant",
    trigger_json: { type: "incident_activated" },
    conditions_json: {},
    actions_json: { load_plan_steps: true, assign_roles: true },
    approval_mode: "none",
    enabled: false,
    success_rate: 100,
    last_run_at: "2026-11-24T06:15:05Z",
  },
  {
    id: "rule-12",
    name_en: "Schedule Post-Incident Lessons Learned Review within 48h",
    name_ar: "جدولة جلسة استخلاص الدروس المستفادة خلال 48 ساعة من إغلاق الحادثة",
    scope: "tenant",
    trigger_json: { type: "incident_closed" },
    conditions_json: {},
    actions_json: { schedule_after_action_meeting: true },
    approval_mode: "none",
    enabled: true,
    success_rate: 100,
    last_run_at: "2026-11-20T12:00:00Z",
  },
];

export const SEED_PEOPLE: Person[] = [
  {
    id: "usr-001",
    tenant_id: "gulf_water",
    name_en: "Eng. Tariq Al-Busaidi",
    name_ar: "م. طارق البوسعيدي",
    employee_code: "EMP-1049",
    department: "Executive Operations",
    site_id: "site-muscat-hq",
    title: "Chief Incident Commander",
    email: "t.busaidi@example.om",
    phone_e164: "+968 0000 1001",
    teams_handle: "tariq.busaidi",
    channel_pref: ["teams", "sms", "email"],
    language_pref: "en",
    on_call: true,
    reachability_score: 99,
    verified_channels: ["sms", "email", "teams"],
  },
  {
    id: "usr-002",
    tenant_id: "gulf_water",
    name_en: "Dr. Maryam Al-Zadjali",
    name_ar: "د. مريم الزدجالي",
    employee_code: "EMP-1082",
    department: "HSE & Chemical Safety",
    site_id: "site-sohar",
    title: "HSE Director & Lead Responder",
    email: "m.zadjali@example.om",
    phone_e164: "+968 0000 1002",
    teams_handle: "maryam.zadjali",
    channel_pref: ["sms", "push", "email"],
    language_pref: "ar",
    on_call: true,
    reachability_score: 96,
    verified_channels: ["sms", "email", "push"],
  },
  {
    id: "usr-003",
    tenant_id: "gulf_water",
    name_en: "Saif Al-Kharusi",
    name_ar: "سيف الخروصي",
    employee_code: "EMP-1104",
    department: "SCADA & Operational Tech",
    site_id: "site-sohar",
    title: "Head of Industrial OT Security",
    email: "s.kharusi@example.om",
    phone_e164: "+968 0000 1003",
    teams_handle: "saif.kharusi",
    channel_pref: ["sms", "teams", "push"],
    language_pref: "en",
    on_call: true,
    reachability_score: 98,
    verified_channels: ["sms", "email", "teams"],
  },
  {
    id: "usr-004",
    tenant_id: "gulf_water",
    name_en: "Amina Al-Hassani",
    name_ar: "أمينة الحسني",
    employee_code: "EMP-1150",
    department: "Corporate Communications",
    site_id: "site-muscat-hq",
    title: "Head of Communications & Media",
    email: "a.hassani@example.om",
    phone_e164: "+968 0000 1004",
    teams_handle: "amina.hassani",
    channel_pref: ["email", "teams", "sms"],
    language_pref: "ar",
    on_call: true,
    reachability_score: 94,
    verified_channels: ["sms", "email"],
  },
  {
    id: "usr-005",
    tenant_id: "gulf_water",
    name_en: "Khalfan Al-Mamari",
    name_ar: "خلفان المعمري",
    employee_code: "EMP-1210",
    department: "Facilities & Physical Security",
    site_id: "site-sohar",
    title: "Security Operations Supervisor",
    email: "k.mamari@example.om",
    phone_e164: "+968 0000 1005",
    teams_handle: "khalfan.mamari",
    channel_pref: ["sms", "push"],
    language_pref: "ar",
    on_call: true,
    reachability_score: 95,
    verified_channels: ["sms", "push"],
  },
];

export interface SeedRisk {
  id: string;
  code: string;
  title_en: string;
  title_ar: string;
  likelihood: number; // 1-5
  impact: number; // 1-5
  score: number;
  mitigation: string;
  controls: string;
  owner: string;
  linked_plan_id: string;
  planId: string;
}

export const SEED_RISKS: SeedRisk[] = [
  {
    id: "RSK-01",
    code: "RSK-01",
    title_en: "OT SCADA Telemetry Network Ransomware & Isolation",
    title_ar: "هجوم فدية واختراق شبكات التحكم الإشرافي SCADA",
    likelihood: 4,
    impact: 5,
    score: 20,
    mitigation: "Dual-firewall segmentation, unidirectional data diodes",
    controls: "Dual-firewall segmentation, unidirectional data diodes",
    owner: "Head of Industrial OT Security",
    linked_plan_id: "CP-DESAL-04",
    planId: "CP-DESAL-04",
  },
  {
    id: "RSK-02",
    code: "RSK-02",
    title_en: "Chlorine Gas Containment Valve Failure",
    title_ar: "فشل صمامات احتواء غاز الكلور في محطة التحلية",
    likelihood: 2,
    impact: 5,
    score: 10,
    mitigation: "Automated scrubber vacuum extraction & perimeter sirens",
    controls: "Automated scrubber vacuum extraction & perimeter sirens",
    owner: "HSE Director & Lead Responder",
    linked_plan_id: "CP-HAZMAT-03",
    planId: "CP-HAZMAT-03",
  },
  {
    id: "RSK-03",
    code: "RSK-03",
    title_en: "Total National Grid Power Blackout (33kV Loss)",
    title_ar: "انقطاع شامل للكهرباء عن الشبكة الوطنية (فقدان 33 ك.ف)",
    likelihood: 3,
    impact: 4,
    score: 12,
    mitigation: "Auxiliary diesel turbines with 72h fuel reservoir",
    controls: "Auxiliary diesel turbines with 72h fuel reservoir",
    owner: "Chief Incident Commander",
    linked_plan_id: "CP-POWER-01",
    planId: "CP-POWER-01",
  },
  {
    id: "RSK-04",
    code: "RSK-04",
    title_en: "Coastal Tropical Cyclone Sea Surge & Flooding",
    title_ar: "أمواج المد البحري المدارية والفيضانات الساحلية",
    likelihood: 3,
    impact: 4,
    score: 12,
    mitigation: "Sea defense barrier gates and reinforced pump culverts",
    controls: "Sea defense barrier gates and reinforced pump culverts",
    owner: "Security Operations Supervisor",
    linked_plan_id: "CP-FLOOD-02",
    planId: "CP-FLOOD-02",
  },
  {
    id: "RSK-05",
    code: "RSK-05",
    title_en: "Desalination RO Membrane Bio-fouling Contamination",
    title_ar: "تلوث بيولوجي لأغشية التناضح العكسي RO",
    likelihood: 3,
    impact: 3,
    score: 9,
    mitigation: "Secondary chemical biocides and dual intake filters",
    controls: "Secondary chemical biocides and dual intake filters",
    owner: "Central Operations Lead",
    linked_plan_id: "CP-DESAL-04",
    planId: "CP-DESAL-04",
  },
  {
    id: "RSK-06",
    code: "RSK-06",
    title_en: "High-Pressure Main Pipeline Hydraulic Rupture",
    title_ar: "انفجار هيدروليكي في خط النقل الرئيسي عالي الضغط",
    likelihood: 2,
    impact: 4,
    score: 8,
    mitigation: "Fast-acting telemetry shutoff valves and bypass loops",
    controls: "Fast-acting telemetry shutoff valves and bypass loops",
    owner: "Hydraulics Operations Engineer",
    linked_plan_id: "CP-WATER-01",
    planId: "CP-WATER-01",
  },
  {
    id: "RSK-07",
    code: "RSK-07",
    title_en: "Single-Source Chemical Reagent Supply Disruption",
    title_ar: "تعطل سلاسل توريد الكواشف الكيميائية أحادية المصدر",
    likelihood: 4,
    impact: 2,
    score: 8,
    mitigation: "Secondary GCC regional vendor frame agreement in UAE",
    controls: "Secondary GCC regional vendor frame agreement in UAE",
    owner: "Supply Chain Manager",
    linked_plan_id: "CP-SUPPLY-01",
    planId: "CP-SUPPLY-01",
  },
  {
    id: "RSK-08",
    code: "RSK-08",
    title_en: "Emergency Comms TETRA Radio Mast Failure",
    title_ar: "عطل في أبراج الاتصالات اللاسلكية للطوارئ TETRA",
    likelihood: 2,
    impact: 3,
    score: 6,
    mitigation: "Satellite uplink terminal failover and LTE backup",
    controls: "Satellite uplink terminal failover and LTE backup",
    owner: "Head of Communications & Media",
    linked_plan_id: "CP-COMM-01",
    planId: "CP-COMM-01",
  },
];
