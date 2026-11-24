import { describe, it, expect } from "vitest";
import { DexieCrisisRepo } from "@/lib/repo/mock/dexie";
import { useAppStore } from "@/lib/store/useAppStore";

describe("F2.6: Founder Multi-Tenant Onboarding Wizard & White-Label Branding", () => {
  it("creates a new tenant with custom brand color, logo, and powered-by toggle", async () => {
    const repo = new DexieCrisisRepo();
    const initialTenants = await repo.tenants.list();
    expect(initialTenants.length).toBe(4);

    const newTenant = await repo.tenants.create({
      id: "oman_energy",
      name_en: "Oman National Energy Grid",
      name_ar: "شبكة عمان الوطنية للطاقة",
      country: "Oman",
      package: "Enterprise",
      brand_color: "#059669", // Emerald
      logo_url: "/logos/energy.svg",
      powered_by: false, // White-label off
      active_incidents_count: 1,
      responders_count: 120,
      readiness_percent: 94,
    });

    expect(newTenant.id).toBe("oman_energy");
    expect(newTenant.brand_color).toBe("#059669");
    expect(newTenant.powered_by).toBe(false);

    const updatedList = await repo.tenants.list();
    expect(updatedList.length).toBe(5);
    expect(updatedList.some((t) => t.id === "oman_energy")).toBe(true);
  });

  it("updates app store tenant and branding tokens dynamically", () => {
    const { setTenant, setWhiteLabelPoweredBy } = useAppStore.getState();

    setTenant("gulf_water");
    expect(useAppStore.getState().currentTenant).toBe("gulf_water");

    setWhiteLabelPoweredBy(false);
    expect(useAppStore.getState().whiteLabelPoweredBy).toBe(false);

    setWhiteLabelPoweredBy(true);
    expect(useAppStore.getState().whiteLabelPoweredBy).toBe(true);
  });
});
