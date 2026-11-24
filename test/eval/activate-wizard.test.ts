import { describe, it, expect } from "vitest";
import { DexieCrisisRepo } from "@/lib/repo/mock/dexie";

describe("Activate Wizard Flow: Incident Creation & Initial Deliveries Queue", () => {
  it("activates an incident and queues initial deliveries for on-call responders", async () => {
    const repo = new DexieCrisisRepo();

    const initialDeliveries = await repo.deliveries.getAll();
    const initialCount = initialDeliveries.length;

    // Execute incident activation
    const incident = await repo.incidents.activate({
      tenant_id: "gulf_water",
      title_en: "Substation 33kV Power Feed Loss",
      title_ar: "انقطاع تغذية الطاقة الكهربائية 33 ك.ف لمحطة المحولات",
      category: "power",
      severity: "critical",
      site_id: "site-sohar",
      commander_id: "usr-001",
      sla_minutes: 60,
    });

    expect(incident.id).toBeDefined();
    expect(incident.number).toMatch(/^INC-2026-\d+/);
    expect(incident.status).toBe("active");
    expect(incident.priority_score).toBeGreaterThan(0);

    // Verify initial deliveries were queued for this activated incident
    const allDeliveries = await repo.deliveries.getAll();
    expect(allDeliveries.length).toBeGreaterThan(initialCount);

    const incidentDeliveries = allDeliveries.filter((d) => d.incident_id === incident.id);
    expect(incidentDeliveries.length).toBeGreaterThan(0);

    for (const d of incidentDeliveries) {
      expect(d.status).toBe("queued");
      expect(d.idempotency_key).toContain(incident.id);
      expect(d.provider).toBe("sms_a");
      expect(d.attempts).toBe(0);
    }
  });
});
