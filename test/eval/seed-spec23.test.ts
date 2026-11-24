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
  EXPANDED_DELIVERIES,
  SEED_COMPLIANCE_ROWS,
  SEED_IMPORT_BATCHES,
} from "@/seed/expanded";
import { SEED_RULES, SEED_APPROVALS } from "@/seed/data";

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

  it("contains exactly 1,800 delivery attempts covering failover and retries", () => {
    expect(EXPANDED_DELIVERIES.length).toBe(1800);
    const states = new Set(EXPANDED_DELIVERIES.map((d) => d.state));
    expect(states.has("acknowledged")).toBe(true);
    expect(states.has("failed_over")).toBe(true);
  });

  it("contains exactly 3 pending approvals with priority scores and subjects", () => {
    expect(SEED_APPROVALS.length).toBe(3);
    for (const appr of SEED_APPROVALS) {
      expect(appr.status).toBe("pending");
      expect(appr.priority_score).toBeGreaterThan(70);
      expect(appr.subject_en).toBeTruthy();
      expect(appr.subject_ar).toBeTruthy();
    }
  });

  it("contains exactly 12 automation rules with execution run history", () => {
    expect(SEED_RULES.length).toBe(12);
    for (const rule of SEED_RULES) {
      expect(rule.name_en).toBeTruthy();
      expect(rule.name_ar).toBeTruthy();
      expect(rule.last_run_at).toBeTruthy();
      expect(rule.success_rate).toBeGreaterThan(90);
    }
  });

  it("contains 3 import batches including 1 rolled back batch", () => {
    expect(SEED_IMPORT_BATCHES.length).toBe(3);
    const rolledBack = SEED_IMPORT_BATCHES.filter((b) => b.status === "rolled_back");
    expect(rolledBack.length).toBe(1);
    const completed = SEED_IMPORT_BATCHES.filter((b) => b.status === "completed");
    expect(completed.length).toBe(2);
  });

  it("contains 10 compliance controls all initialized with verified=false", () => {
    expect(SEED_COMPLIANCE_ROWS.length).toBe(10);
    for (const row of SEED_COMPLIANCE_ROWS) {
      expect(row.verified).toBe(false);
      expect(row.standard).toBeTruthy();
      expect(row.clause).toBeTruthy();
    }
  });
});
