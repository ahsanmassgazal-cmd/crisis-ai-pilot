import { CrisisRepository, Incident, Person, Group, Plan, Message, Delivery, AutomationRule, AuditRow } from "./types";

const mockIncidents: Incident[] = [
  {
    id: "inc-2026-001",
    tenant_id: "gulf_water",
    number: "INC-2026-001",
    title_en: "SCADA Network Anomaly & Sensor Desynchronization",
    title_ar: "خلل في شبكة التحكم الإشرافي SCADA وعدم تزامن الحساسات",
    category: "cyber",
    severity: "critical",
    status: "active",
    plan_id: "plan-cyber-01",
    commander_id: "usr-001",
    sla_minutes: 60,
    started_at: "2026-11-23T20:15:00Z",
    priority_score: 95,
  },
  {
    id: "inc-2026-002",
    tenant_id: "gulf_water",
    number: "INC-2026-002",
    title_en: "Chemical Reagent Supplier Disruption (Sohar Port)",
    title_ar: "تعطل توريد الكواشف الكيميائية (ميناء صحار)",
    category: "supply",
    severity: "medium",
    status: "active",
    plan_id: "plan-supply-01",
    commander_id: "usr-003",
    sla_minutes: 240,
    started_at: "2026-11-23T18:30:00Z",
    priority_score: 55,
  },
  {
    id: "inc-2026-003",
    tenant_id: "gulf_water",
    number: "INC-2026-003",
    title_en: "Tropical Low Pressure & Coastal Surge Advisory",
    title_ar: "منخفض مداري وتحذير من ارتفاع الأمواج الساحلية",
    category: "weather",
    severity: "low",
    status: "monitoring",
    plan_id: "plan-weather-01",
    commander_id: "usr-004",
    sla_minutes: 720,
    started_at: "2026-11-23T14:00:00Z",
    priority_score: 35,
  },
];

class MockCrisisRepo implements CrisisRepository {
  incidents = {
    getAll: async () => [...mockIncidents],
    getById: async (id: string) => mockIncidents.find((i) => i.id === id) || null,
    create: async (item: Omit<Incident, "id">) => {
      const newInc = { ...item, id: `inc-${Date.now()}` } as Incident;
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
      const inc: Incident = {
        id: `inc-${Date.now()}`,
        tenant_id: input.tenant_id || "gulf_water",
        number: `INC-2026-00${mockIncidents.length + 1}`,
        title_en: input.title_en || "New Incident",
        title_ar: input.title_ar || "حادثة جديدة",
        category: input.category || "cyber",
        severity: input.severity || "high",
        status: "active",
        commander_id: input.commander_id || "usr-001",
        sla_minutes: input.sla_minutes || 60,
        started_at: new Date().toISOString(),
        priority_score: input.priority_score || 80,
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
    getAll: async () => [],
    getById: async () => null,
    create: async (p: any) => p,
    update: async (_id: string, p: any) => p,
    delete: async () => true,
  };

  groups = {
    getAll: async () => [],
    getById: async () => null,
    create: async (g: any) => g,
    update: async (_id: string, g: any) => g,
    delete: async () => true,
  };

  plans = {
    getAll: async () => [],
    getById: async () => null,
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
    approve: async () => {},
  };

  deliveries = {
    getAll: async () => [],
    getByMessageId: async () => [],
  };

  automations = {
    getAll: async () => [],
    getById: async () => null,
    create: async (a: any) => a,
    update: async (_id: string, a: any) => a,
    delete: async () => true,
    setMode: async () => {},
    killSwitch: async () => {},
  };

  audit = {
    getAll: async () => [],
    verifyChain: async () => ({ valid: true, count: 1248 }),
  };
}

const singletonRepo = new MockCrisisRepo();

export function useRepo(): CrisisRepository {
  return singletonRepo;
}
