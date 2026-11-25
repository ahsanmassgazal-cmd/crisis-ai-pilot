import {
  Incident,
  Person,
  Group,
  Plan,
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
  Delivery,
} from "@/lib/repo/types";
import { GENESIS_HASH, formatAuditPayload } from "@/lib/engine/audit";

// Fast deterministic hash for seed generation in browser/node
function fastHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  return (hex + hex + hex + hex + hex + hex + hex + hex).slice(0, 64);
}

// 4 Tenants
export const SEED_TENANTS: TenantConfig[] = [
  {
    id: "gulf_water",
    name_en: "Gulf Water & Power Co.",
    name_ar: "شركة الخليج للمياه والطاقة",
    country: "Oman",
    package: "Enterprise",
    brand_color: "#6366f1",
    logo_url: "/logos/gulf_water.svg",
    active_incidents_count: 1,
    responders_count: 248,
    readiness_percent: 94,
  },
  {
    id: "national_bank",
    name_en: "National Bank of Oman",
    name_ar: "البنك الوطني العماني",
    country: "Oman",
    package: "Enterprise",
    brand_color: "#0284c7",
    logo_url: "/logos/national_bank.svg",
    active_incidents_count: 0,
    responders_count: 512,
    readiness_percent: 98,
  },
  {
    id: "city_hospital",
    name_en: "Muscat Royal Specialist Hospital",
    name_ar: "مستشفى مسقط التخصصي الملكي",
    country: "Oman",
    package: "Professional",
    brand_color: "#059669",
    logo_url: "/logos/hospital.svg",
    active_incidents_count: 0,
    responders_count: 120,
    readiness_percent: 88,
  },
  {
    id: "ministry_services",
    name_en: "Ministry of Civil Infrastructure",
    name_ar: "وزارة البنية التحتية المدنية",
    country: "Oman",
    package: "Enterprise",
    brand_color: "#7c3aed",
    logo_url: "/logos/ministry.svg",
    active_incidents_count: 0,
    responders_count: 840,
    readiness_percent: 91,
  },
];

// Sites
export const EXPANDED_SITES: Site[] = [
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
    active_incidents_count: 1,
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
    active_incidents_count: 0,
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

// Generate 248 People (Spec 23)
const firstNamesEN = ["Tariq", "Maryam", "Saif", "Amina", "Khalfan", "Salim", "Fatima", "Nasser", "Hamad", "Laila", "Ahmed", "Reem", "Khalid", "Mona", "Said", "Huda", "Ziyad", "Asma", "Majid", "Noora", "Badr", "Shaikha", "Fahad", "Kawthar", "Hilal", "Manal", "Yahya", "Rania", "Sultan", "Amal", "Youssef", "Marwa"];
const firstNamesAR = ["طارق", "مريم", "سيف", "أمينة", "خلفان", "سالم", "فاطمة", "ناصر", "حمد", "ليلى", "أحمد", "ريم", "خالد", "منى", "سعيد", "هدى", "زياد", "أسماء", "ماجد", "نورة", "بدر", "شيخة", "فهد", "كوثر", "هلال", "منال", "يحيى", "رانيا", "سلطان", "أمل", "يوسف", "مروة"];

const lastNamesEN = ["Al-Busaidi", "Al-Zadjali", "Al-Kharusi", "Al-Hassani", "Al-Mamari", "Al-Harthy", "Al-Riyami", "Al-Balushi", "Al-Amri", "Al-Farsi", "Al-Rawahi", "Al-Shabibi", "Al-Habsi", "Al-Ghafri", "Al-Maskari", "Al-Siyabi", "Al-Barwani", "Al-Hinai", "Al-Muqbali", "Al-Wahaibi"];
const lastNamesAR = ["البوسعيدي", "الزدجالي", "الخروصي", "الحسني", "المعمري", "الحارثي", "الريامي", "البلوشي", "العامري", "الفارسي", "الرواحي", "الشبيبي", "الحبسي", "الغافري", "المسكري", "السيابي", "البرواني", "الهنائي", "المقبالي", "الوهيبي"];

const depts = [
  "Executive Operations",
  "HSE & Chemical Safety",
  "SCADA & Operational Tech",
  "Corporate Communications",
  "Facilities & Physical Security",
  "Water Quality & Lab Services",
  "Transmission & Distribution",
  "Electrical & Power Systems",
  "Procurement & Supply Chain",
  "Legal & Regulatory Affairs",
];

const siteIds = ["site-sohar", "site-muscat-hq", "site-salalah", "site-nizwa", "site-sur", "site-duqm"];

export const EXPANDED_PEOPLE: Person[] = Array.from({ length: 248 }, (_, i) => {
  const codeNum = 1001 + i;
  const fnIdx = i % firstNamesEN.length;
  const lnIdx = (i + Math.floor(i / firstNamesEN.length)) % lastNamesEN.length;
  const dept = depts[i % depts.length];
  const site = siteIds[i % siteIds.length];

  return {
    id: `usr-${String(i + 1).padStart(3, "0")}`,
    tenant_id: "gulf_water",
    employee_code: `EMP-${codeNum}`,
    name_en: `${i === 0 ? "Eng. " : i === 1 ? "Dr. " : ""}${firstNamesEN[fnIdx]} ${lastNamesEN[lnIdx]}`,
    name_ar: `${i === 0 ? "م. " : i === 1 ? "د. " : ""}${firstNamesAR[fnIdx]} ${lastNamesAR[lnIdx]}`,
    department: dept,
    site_id: site,
    title: i === 0 ? "Chief Incident Commander" : i === 1 ? "HSE Director & Lead Responder" : `${dept} Specialist`,
    role: i < 5 ? "commander" : i < 30 ? "team" : "responder",
    email: `${firstNamesEN[fnIdx].toLowerCase()}.${lastNamesEN[lnIdx].toLowerCase().replace(/[^a-z]/g, "")}@example.om`,
    phone_e164: `+968 0000 ${codeNum}`,
    phone: `+968 0000 ${codeNum}`,
    teams_handle: `${firstNamesEN[fnIdx].toLowerCase()}.${lastNamesEN[lnIdx].toLowerCase().replace(/[^a-z]/g, "")}`,
    channel_pref: i % 2 === 0 ? ["sms", "push", "email"] : ["teams", "sms", "email"],
    language_pref: i % 3 === 0 ? "ar" : "en",
    lang: i % 3 === 0 ? "ar" : "en",
    on_call: i < 50,
    reachability_score: 85 + (i % 15),
    verified_channels: ["sms", "email", i % 2 === 0 ? "push" : "teams"],
  };
});

// 8 Playbooks (Spec 23)
export const EXPANDED_PLANS: Plan[] = [
  {
    id: "CP-CYBER-01",
    tenant_id: "gulf_water",
    category: "cyber",
    title_en: "Industrial OT / SCADA Cyber Attack Response",
    title_ar: "دليل الاستجابة للهجمات السيبرانية على شبكات التحكم SCADA",
    severity_default: "critical",
    owner_role: "commander",
    steps_count: 10,
    version: "2.4",
  },
  {
    id: "CP-FIRE-01",
    tenant_id: "gulf_water",
    category: "fire",
    title_en: "Chemical Storage & Refinery Fire Evacuation",
    title_ar: "خطة إخلاء حريق مستودعات الكيماويات ومحطات التكرير",
    severity_default: "critical",
    owner_role: "commander",
    steps_count: 8,
    version: "1.8",
  },
  {
    id: "CP-POWER-01",
    tenant_id: "gulf_water",
    category: "power",
    title_en: "Total Power Blackout & Generator Failover",
    title_ar: "إجراءات الانقطاع الشامل للكهرباء وتشغيل المولدات الاحتياطية",
    severity_default: "high",
    owner_role: "continuity",
    steps_count: 8,
    version: "3.1",
  },
  {
    id: "CP-FLOOD-01",
    tenant_id: "gulf_water",
    category: "weather",
    title_en: "Tropical Cyclone & Coastal Storm Surge Preparedness",
    title_ar: "خطة الطوارئ للأنواء المناخية الاستثنائية والفيضانات الساحلية",
    severity_default: "high",
    owner_role: "commander",
    steps_count: 12,
    version: "2.0",
  },
  {
    id: "CP-SUPPLY-01",
    tenant_id: "gulf_water",
    category: "supply",
    title_en: "Critical Chemical Reagent Supply Chain Continuity",
    title_ar: "خطة استدامة توريد الكواشف الكيميائية الحيوية البديلة",
    severity_default: "medium",
    owner_role: "continuity",
    steps_count: 7,
    version: "1.2",
  },
  {
    id: "CP-WATER-01",
    tenant_id: "gulf_water",
    category: "environmental",
    title_en: "High-Pressure Main Transmission Pipeline Rupture",
    title_ar: "إجراءات الطوارئ لانفجار خطوط نقل المياه الرئيسية عالية الضغط",
    severity_default: "critical",
    owner_role: "commander",
    steps_count: 9,
    version: "2.1",
  },
  {
    id: "CP-COMM-01",
    tenant_id: "gulf_water",
    category: "comms",
    title_en: "Telecommunications & TETRA Radio Grid Disruption",
    title_ar: "خطة مجابهة انقطاع شبكات الاتصالات اللاسلكية وتيترا",
    severity_default: "medium",
    owner_role: "comms",
    steps_count: 6,
    version: "1.5",
  },
  {
    id: "CP-HEALTH-01",
    tenant_id: "gulf_water",
    category: "environmental",
    title_en: "Regional Biological / Potable Water Contamination Protocol",
    title_ar: "بروتوكول احتواء التلوث البيولوجي لمياه الشرب البلدية",
    severity_default: "critical",
    owner_role: "commander",
    steps_count: 11,
    version: "2.3",
  },
];

// 9 Incidents (1 SEV1 active, 1 SEV3 active, 1 monitoring, 6 closed/resolved)
export const EXPANDED_INCIDENTS: Incident[] = [
  {
    id: "inc-2026-001",
    tenant_id: "gulf_water",
    number: "INC-2026-001",
    title_en: "SCADA Network Anomaly & Sensor Desynchronization",
    title_ar: "خلل في شبكة التحكم الإشرافي SCADA وعدم تزامن الحساسات",
    category: "cyber",
    severity: "critical",
    status: "active",
    plan_id: "CP-CYBER-01",
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
    plan_id: "CP-SUPPLY-01",
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
    plan_id: "CP-FLOOD-01",
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
    plan_id: "CP-POWER-01",
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
    plan_id: "CP-WATER-01",
    commander_id: "usr-004",
    sla_minutes: 360,
    started_at: "2026-11-15T08:00:00Z",
    closed_at: "2026-11-15T12:30:00Z",
    priority_score: 15,
  },
  {
    id: "inc-2026-006",
    tenant_id: "gulf_water",
    number: "INC-2026-006",
    title_en: "Nizwa Reservoir Chlorine Gas Trace Leakage",
    title_ar: "تسرب غاز الكلور المحدود في خزان نزوى الإقليمي",
    category: "fire",
    severity: "high",
    status: "closed",
    plan_id: "CP-FIRE-01",
    commander_id: "usr-002",
    sla_minutes: 90,
    started_at: "2026-11-10T14:00:00Z",
    closed_at: "2026-11-10T15:20:00Z",
    priority_score: 10,
  },
  {
    id: "inc-2026-007",
    tenant_id: "gulf_water",
    number: "INC-2026-007",
    title_en: "Salalah Transmission Booster Pump Bearing Overheat",
    title_ar: "ارتفاع حرارة محامل مضخات النقل الساحلية بصلالة",
    category: "power",
    severity: "medium",
    status: "closed",
    plan_id: "CP-WATER-01",
    commander_id: "usr-005",
    sla_minutes: 180,
    started_at: "2026-11-05T09:30:00Z",
    closed_at: "2026-11-05T11:50:00Z",
    priority_score: 8,
  },
  {
    id: "inc-2026-008",
    tenant_id: "gulf_water",
    number: "INC-2026-008",
    title_en: "Sur Billing & Call Center Distributed DoS Event",
    title_ar: "هجوم حجب الخدمة الموزع على مركز الاتصال والفواتير بصور",
    category: "cyber",
    severity: "low",
    status: "closed",
    plan_id: "CP-COMM-01",
    commander_id: "usr-003",
    sla_minutes: 360,
    started_at: "2026-10-28T13:00:00Z",
    closed_at: "2026-10-28T16:15:00Z",
    priority_score: 5,
  },
  {
    id: "inc-2026-009",
    tenant_id: "gulf_water",
    number: "INC-2026-009",
    title_en: "Muscat Regional Distribution Pressure Fluctuation",
    title_ar: "تذبذب هيدروليكي في ضغط شبكة التوزيع بمسقط",
    category: "environmental",
    severity: "high",
    status: "closed",
    plan_id: "CP-WATER-01",
    commander_id: "usr-001",
    sla_minutes: 120,
    started_at: "2026-10-15T07:00:00Z",
    closed_at: "2026-10-15T08:45:00Z",
    priority_score: 5,
  },
];

// 60 Tasks (Spec 23)
export const EXPANDED_TASKS: Task[] = Array.from({ length: 60 }, (_, i) => {
  const inc = EXPANDED_INCIDENTS[i % EXPANDED_INCIDENTS.length];
  const person = EXPANDED_PEOPLE[i % EXPANDED_PEOPLE.length];
  const priority = i % 4 === 0 ? "p1" : i % 4 === 1 ? "p2" : i % 4 === 2 ? "p3" : "p4";
  const status = i < 8 ? (i % 2 === 0 ? "doing" : "todo") : i < 15 ? "blocked" : "done";

  return {
    id: `tsk-${String(i + 1).padStart(3, "0")}`,
    incident_id: inc.id,
    title_en: `Task #${i + 1}: Operational mitigation step for ${inc.title_en.slice(0, 30)}`,
    title_ar: `المهمة #${i + 1}: إجراء تخفيف تشغيلي لـ ${inc.title_ar.slice(0, 30)}`,
    owner_id: person.id,
    owner_name: person.name_en,
    priority,
    status,
    due_minutes: 15 + (i * 5) % 180,
    priority_score: Math.max(10, 95 - i),
  };
});

// 10 Critical Functions (Spec 23)
export const EXPANDED_CRITICAL_FUNCTIONS: CriticalFunction[] = [
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
  {
    id: "cf-05",
    tenant_id: "gulf_water",
    name_en: "SCADA Telemetry & Remote Valve Control",
    name_ar: "التحكم عن بُعد وصمامات شبكة SCADA",
    rto_minutes: 30,
    rpo_minutes: 5,
    mtpd_minutes: 120,
    status: "impacted",
    sla_used_percent: 85,
    dependencies: ["Sohar Cyber Firewall Cluster", "OT Microwave Links"],
  },
  {
    id: "cf-06",
    tenant_id: "gulf_water",
    name_en: "Hazardous Chemical Reagent Intake & Storage",
    name_ar: "استقبال وتخزين الكواشف الكيميائية الخطرة",
    rto_minutes: 180,
    rpo_minutes: 60,
    mtpd_minutes: 480,
    status: "normal",
    sla_used_percent: 25,
    dependencies: ["Sohar Port Hazardous Cargo Berth", "Customs Clearance API"],
  },
  {
    id: "cf-07",
    tenant_id: "gulf_water",
    name_en: "Backup Diesel Power Generation & Switchgear",
    name_ar: "توليد الطاقة الاحتياطية بالمولدات وقواطع التبديل",
    rto_minutes: 15,
    rpo_minutes: 0,
    mtpd_minutes: 90,
    status: "normal",
    sla_used_percent: 0,
    dependencies: ["Muscat On-Site Fuel Reserves (100kL)"],
  },
  {
    id: "cf-08",
    tenant_id: "gulf_water",
    name_en: "Emergency Responder TETRA Comms Dispatch",
    name_ar: "إرسال وتوجيه فرق الطوارئ عبر شبكة تيترا اللاسلكية",
    rto_minutes: 10,
    rpo_minutes: 0,
    mtpd_minutes: 60,
    status: "normal",
    sla_used_percent: 15,
    dependencies: ["Oman Government TETRA Radio Mast Network"],
  },
  {
    id: "cf-09",
    tenant_id: "gulf_water",
    name_en: "Regulatory Reporting & Public Health Disclosure",
    name_ar: "الإفصاح التنظيمي وإخطار هيئة الخدمات العامة والصحة",
    rto_minutes: 60,
    rpo_minutes: 30,
    mtpd_minutes: 180,
    status: "normal",
    sla_used_percent: 40,
    dependencies: ["Secure Encrypted Legal Portal", "Authority Liaison Hotline"],
  },
  {
    id: "cf-10",
    tenant_id: "gulf_water",
    name_en: "Critical Spare Parts Supply & Inventory Logistics",
    name_ar: "لوجستيات قطع الغيار الحيوية وصمامات الضغط العالي",
    rto_minutes: 360,
    rpo_minutes: 120,
    mtpd_minutes: 1440,
    status: "normal",
    sla_used_percent: 20,
    dependencies: ["GCC Regional Distribution Warehouse (Dubai)"],
  },
];

// 24 Risks (Spec 23)
export const EXPANDED_RISKS: RiskItem[] = Array.from({ length: 24 }, (_, i) => {
  const code = `RSK-${String(i + 1).padStart(2, "0")}`;
  const plan = EXPANDED_PLANS[i % EXPANDED_PLANS.length];
  const likelihood = (i % 5) + 1;
  const impact = ((i + 2) % 5) + 1;

  return {
    id: code,
    code,
    tenant_id: "gulf_water",
    title_en: `Risk ${code}: Operational hazard scenario for ${plan.title_en.slice(0, 35)}`,
    title_ar: `الخطر ${code}: سيناريو المخاطر التشغيلية لـ ${plan.title_ar.slice(0, 35)}`,
    likelihood,
    impact,
    score: likelihood * impact,
    owner: EXPANDED_PEOPLE[i % EXPANDED_PEOPLE.length].name_en,
    controls: "Redundant sensors, automated bypass valves, multi-tiered SOPs",
    mitigation: "Continuous real-time telemetry monitoring and weekly safety audits",
    linked_plan_id: plan.id,
    planId: plan.id,
  };
});

// 7 Drills (Spec 23)
export const EXPANDED_DRILLS: DrillItem[] = [
  {
    id: "drl-01",
    tenant_id: "gulf_water",
    title_en: "Q4 Unannounced SCADA Intrusion Simulation",
    title_ar: "تمرين محاكاة الاختراق السيبراني غير المعلن للربع الرابع",
    date: "2026-11-02",
    type: "unannounced",
    participants_count: 42,
    score_percent: 94,
    status: "completed",
  },
  {
    id: "drl-02",
    tenant_id: "gulf_water",
    title_en: "Sohar Chlorine Vapor Release Multi-Agency Evacuation",
    title_ar: "تمرين إخلاء تسرب الكلور بمحطة صحار بمشاركة الدفاع المدني",
    date: "2026-10-14",
    type: "full_scale",
    participants_count: 86,
    score_percent: 89,
    status: "completed",
  },
  {
    id: "drl-03",
    tenant_id: "gulf_water",
    title_en: "Executive Board Cyber Ransomware Tabletop Exercise",
    title_ar: "تمرين طاولة للإدارة التنفيذية: فدية برمجية سيبرانية",
    date: "2026-09-22",
    type: "tabletop",
    participants_count: 14,
    score_percent: 96,
    status: "completed",
  },
  {
    id: "drl-04",
    tenant_id: "gulf_water",
    title_en: "Muscat Regional Grid Blackout Failover Verification",
    title_ar: "اختبار انقطاع الكهرباء التام وتشغيل المولدات بشبكة مسقط",
    date: "2026-08-30",
    type: "full_scale",
    participants_count: 38,
    score_percent: 92,
    status: "completed",
  },
  {
    id: "drl-05",
    tenant_id: "gulf_water",
    title_en: "Tropical Cyclone Heavy Flooding Emergency Readiness",
    title_ar: "تمرين الجاهزية الميدانية للأنواء المناخية والفيضانات",
    date: "2026-07-18",
    type: "full_scale",
    participants_count: 55,
    score_percent: 91,
    status: "completed",
  },
  {
    id: "drl-06",
    tenant_id: "gulf_water",
    title_en: "Cross-Border Chemical Supply Disruption Tabletop",
    title_ar: "تمرين طاولة: تعطل سلاسل التوريد الكيميائي عبر الحدود",
    date: "2026-12-15",
    type: "tabletop",
    participants_count: 22,
    score_percent: 0,
    status: "scheduled",
  },
  {
    id: "drl-07",
    tenant_id: "gulf_water",
    title_en: "Annual Nationwide TETRA Comms Blackout Drill",
    title_ar: "التمرين السنوي لانقطاع الاتصالات اللاسلكية على مستوى السلطنة",
    date: "2027-01-20",
    type: "unannounced",
    participants_count: 110,
    score_percent: 0,
    status: "scheduled",
  },
];

// 40 Documents (Spec 23)
export const EXPANDED_DOCUMENTS: DocumentItem[] = Array.from({ length: 40 }, (_, i) => {
  const cat: "policy" | "sop" | "diagram" | "agreement" =
    i % 4 === 0 ? "policy" : i % 4 === 1 ? "sop" : i % 4 === 2 ? "diagram" : "agreement";

  return {
    id: `doc-${String(i + 1).padStart(3, "0")}`,
    tenant_id: "gulf_water",
    title_en: `Operational Document ${i + 1}: ${cat.toUpperCase()} Standard Procedure`,
    title_ar: `وثيقة تشغيلية ${i + 1}: إجراء قياسي ${cat === "policy" ? "سياسة" : cat === "sop" ? "دليل تشغيلي" : cat === "diagram" ? "مخطط" : "اتفاقية"}`,
    category: cat,
    version: `${1 + Math.floor(i / 10)}.${i % 10}`,
    updated_at: "2026-11-20T08:00:00Z",
    file_size_kb: 450 + (i * 75),
    mime_type: cat === "diagram" ? "image/svg+xml" : "application/pdf",
  };
});

// ~1,800 Deliveries (Spec 23)
export const EXPANDED_DELIVERIES: Delivery[] = Array.from({ length: 1800 }, (_, i) => {
  const person = EXPANDED_PEOPLE[i % EXPANDED_PEOPLE.length];
  const channel: Delivery["channel"] =
    i % 5 === 0 ? "sms" : i % 5 === 1 ? "email" : i % 5 === 2 ? "teams" : i % 5 === 3 ? "push" : "sms";
  const state: Delivery["state"] =
    i < 20 ? "sending" : i < 40 ? "retrying" : i < 60 ? "failed_over" : i % 10 === 0 ? "failed" : "acknowledged";

  return {
    id: `deliv-${String(i + 1).padStart(5, "0")}`,
    message_id: `msg-${1 + (i % 25)}`,
    person_id: person.id,
    channel,
    provider: channel === "sms" ? (state === "failed_over" ? "sms_b" : "sms_a") : channel,
    idempotency_key: fastHash(`inc-1:${person.id}:${channel}:1`),
    state,
    attempts: state === "failed" ? 3 : state === "retrying" ? 2 : 1,
    sent_at: "2026-11-24T06:16:00Z",
    delivered_at: state === "acknowledged" ? "2026-11-24T06:17:10Z" : undefined,
    acked_at: state === "acknowledged" ? "2026-11-24T06:18:25Z" : undefined,
    simulated: true,
  };
});

// ~1,200 Cryptographically Linked Audit Rows (Spec 23 & Spec 15)
export const EXPANDED_AUDIT_ROWS: AuditRow[] = (() => {
  const rows: AuditRow[] = [];
  let prev = GENESIS_HASH;

  for (let seq = 1; seq <= 1248; seq++) {
    const timestamp = new Date(1732428000000 + seq * 12000).toISOString();
    const action =
      seq === 1
        ? "SYSTEM_GENESIS_INITIALIZED"
        : seq % 10 === 0
        ? "AUTOMATION_RULE_EXECUTED"
        : seq % 5 === 0
        ? "EMERGENCY_DELIVERY_ACKNOWLEDGED"
        : seq % 3 === 0
        ? "INCIDENT_STATUS_TELEMETRY_LOGGED"
        : "TASK_STATE_UPDATED";

    const payload = {
      seq,
      prev_hash: prev,
      created_at: timestamp,
      actor_id: `usr-${String((seq % 20) + 1).padStart(3, "0")}`,
      action,
      entity: "incident",
      entity_id: "inc-2026-001",
      after_json: { seq, action, status: "logged" },
    };

    const rowHash = fastHash(formatAuditPayload(payload));

    const row: AuditRow = {
      id: `audit-${seq}`,
      tenant_id: "gulf_water",
      seq,
      actor_id: payload.actor_id,
      actor_role: seq % 2 === 0 ? "commander" : "responder",
      action,
      entity: "incident",
      entity_id: "inc-2026-001",
      before_json: null,
      after_json: payload.after_json,
      reason: "Automated cryptographic operational audit event",
      ip_hint: `10.200.4.${(seq % 250) + 1}`,
      created_at: timestamp,
      prev_hash: prev,
      hash: rowHash,
    };

    rows.push(row);
    prev = rowHash;
  }

  return rows;
})();

export interface ComplianceItem {
  id: string;
  standard: string;
  clause: string;
  description_en: string;
  description_ar: string;
  verified: boolean;
}

export const SEED_COMPLIANCE_ROWS: ComplianceItem[] = [
  { id: "comp-1", standard: "ISO 22301", clause: "8.2.2", description_en: "Business impact analysis", description_ar: "تحليل الأثر على الأعمال", verified: false },
  { id: "comp-2", standard: "ISO 22301", clause: "8.4.2", description_en: "Documented continuity procedures", description_ar: "إجراءات استمرارية موثقة", verified: false },
  { id: "comp-3", standard: "NCEMA 7000", clause: "5.3", description_en: "Emergency broadcast protocols", description_ar: "بروتوكولات البث في الطوارئ", verified: false },
  { id: "comp-4", standard: "GCC-UTIL", clause: "9.1", description_en: "Regulatory reporting SLA", description_ar: "اتفاقية التقارير التنظيمية", verified: false },
  { id: "comp-5", standard: "ISO 27001", clause: "A.12.1", description_en: "Operational audit logging", description_ar: "تسجيل التدقيق التشغيلي", verified: false },
  { id: "comp-6", standard: "ISO 27001", clause: "A.17.1", description_en: "Information security continuity", description_ar: "استمرارية أمن المعلومات", verified: false },
  { id: "comp-7", standard: "NCEMA 7000", clause: "6.1", description_en: "Incident management structure", description_ar: "هيكل إدارة الحوادث", verified: false },
  { id: "comp-8", standard: "NCEMA 7000", clause: "7.4", description_en: "Drills and training program", description_ar: "برنامج التمارين والتدريب", verified: false },
  { id: "comp-9", standard: "ISO 22301", clause: "8.3", description_en: "Business continuity strategies", description_ar: "استراتيجيات استمرارية الأعمال", verified: false },
  { id: "comp-10", standard: "GCC-WATER", clause: "3.2", description_en: "Emergency potable water reserve", description_ar: "الاحتياطي الاستراتيجي لمياه الشرب", verified: false },
];

export interface ImportBatch {
  id: string;
  name: string;
  records_count: number;
  status: "completed" | "rolled_back";
  created_at: string;
}

export const SEED_IMPORT_BATCHES: ImportBatch[] = [
  { id: "batch-01", name: "Q1 People Roster HR Sync", records_count: 248, status: "completed", created_at: "2026-11-01T08:00:00Z" },
  { id: "batch-02", name: "Sohar Plant SCADA Assets Import", records_count: 52, status: "completed", created_at: "2026-11-10T14:30:00Z" },
  { id: "batch-03", name: "Legacy Emergency Contact Rollback", records_count: 85, status: "rolled_back", created_at: "2026-11-15T11:15:00Z" },
];
