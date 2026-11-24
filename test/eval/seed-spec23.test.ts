import { describe, it, expect } from "vitest";
import {
  SEED_TENANTS,
  EXPANDED_PEOPLE,
  EXPANDED_PLANS,
  EXPANDED_INCIDENTS,
  EXPANDED_TASKS,
  EXPANDED_CRITICAL_FUNCTIONS,
  EXPANDED_RISKS,
  EXPANDED_DRILLS,
  EXPANDED_DOCUMENTS,
  EXPANDED_AUDIT_ROWS,
} from "@/seed/expanded";

describe("Spec 23 Exact Seed Data Counts & Formats", () => {
  it("contains exactly 4 tenants with required GCC properties", () => {
    expect(SEED_TENANTS.length).toBe(4);
    const tenantIds = SEED_TENANTS.map((t) => t.id);
    expect(tenantIds).toEqual(["gulf_water", "national_bank", "city_hospital", "ministry_services"]);
    for (const tenant of SEED_TENANTS) {
      expect(tenant.name_en).toBeTruthy();
      expect(tenant.name_ar).toBeTruthy();
      expect(tenant.brand_color).toBeTruthy();
    }
  });

  it("contains exactly 248 people with EN+AR names and valid phone numbers", () => {
    expect(EXPANDED_PEOPLE.length).toBe(248);
    for (const person of EXPANDED_PEOPLE) {
      expect(person.name_en).toBeTruthy();
      expect(person.name_ar).toBeTruthy();
      expect(person.phone_e164).toMatch(/^\+968 0000 \d{4}$/);
      expect(person.email).toContain(".om");
      expect(person.reachability_score).toBeGreaterThanOrEqual(50);
      expect(person.reachability_score).toBeLessThanOrEqual(100);
    }
  });

  it("contains exactly 8 playbooks / continuity plans", () => {
    expect(EXPANDED_PLANS.length).toBe(8);
    for (const plan of EXPANDED_PLANS) {
      expect(plan.title_en).toBeTruthy();
      expect(plan.title_ar).toBeTruthy();
      expect(plan.steps_count).toBeGreaterThan(0);
    }
  });

  it("contains exactly 9 incidents with at least 1 active incident", () => {
    expect(EXPANDED_INCIDENTS.length).toBe(9);
    const active = EXPANDED_INCIDENTS.filter((i) => i.status === "active");
    expect(active.length).toBeGreaterThanOrEqual(1);
  });

  it("contains exactly 60 tasks", () => {
    expect(EXPANDED_TASKS.length).toBe(60);
    for (const task of EXPANDED_TASKS) {
      expect(task.title_en).toBeTruthy();
      expect(task.title_ar).toBeTruthy();
    }
  });

  it("contains exactly 10 critical functions with RTO/RPO metrics", () => {
    expect(EXPANDED_CRITICAL_FUNCTIONS.length).toBe(10);
    for (const cf of EXPANDED_CRITICAL_FUNCTIONS) {
      expect(cf.name_en).toBeTruthy();
      expect(cf.name_ar).toBeTruthy();
      expect(cf.rto_minutes).toBeGreaterThan(0);
      expect(cf.rpo_minutes).toBeGreaterThanOrEqual(0);
      expect(cf.mtpd_minutes).toBeGreaterThan(0);
    }
  });

  it("contains exactly 24 risks with likelihood and impact", () => {
    expect(EXPANDED_RISKS.length).toBe(24);
    for (const r of EXPANDED_RISKS) {
      expect(r.title_en).toBeTruthy();
      expect(r.title_ar).toBeTruthy();
      expect(r.likelihood).toBeGreaterThanOrEqual(1);
      expect(r.impact).toBeGreaterThanOrEqual(1);
    }
  });

  it("contains exactly 7 drills", () => {
    expect(EXPANDED_DRILLS.length).toBe(7);
  });

  it("contains exactly 40 documents across policy, sop, diagram, and agreement", () => {
    expect(EXPANDED_DOCUMENTS.length).toBe(40);
    const categories = new Set(EXPANDED_DOCUMENTS.map((d) => d.category));
    expect(categories.has("policy")).toBe(true);
    expect(categories.has("sop")).toBe(true);
    expect(categories.has("diagram")).toBe(true);
  });

  it("contains exactly 1,248 cryptographic audit rows", () => {
    expect(EXPANDED_AUDIT_ROWS.length).toBe(1248);
    for (let i = 1; i < 20; i++) {
      expect(EXPANDED_AUDIT_ROWS[i].prev_hash).toBe(EXPANDED_AUDIT_ROWS[i - 1].hash);
    }
  });
});
