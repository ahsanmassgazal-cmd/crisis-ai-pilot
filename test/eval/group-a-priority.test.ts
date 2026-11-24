import { describe, it, expect } from "vitest";
import { computePriorityScore } from "@/lib/engine/priority";

describe("Group A: Priority Score Computation (Spec 8)", () => {
  it("calculates critical severity with breached SLA to lane 'now'", () => {
    const result = computePriorityScore({
      severity: "critical",
      slaMinutes: 60,
      elapsedMinutes: 90,
      criticalFunctionAffected: true,
      peopleAffectedCount: 250,
      assignedToMe: true,
    });
    expect(result.score).toBe(100);
    expect(result.lane).toBe("now");
  });

  it("calculates low severity with zero elapsed to floor >= 0 and lane 'later'", () => {
    const result = computePriorityScore({
      severity: "low",
      slaMinutes: 720,
      elapsedMinutes: 0,
      criticalFunctionAffected: false,
    });
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThan(40);
    expect(result.lane).toBe("later");
  });

  it("applies bonus weight when critical functions are impacted", () => {
    const withoutCf = computePriorityScore({
      severity: "high",
      slaMinutes: 120,
      elapsedMinutes: 30,
      criticalFunctionAffected: false,
    });
    const withCf = computePriorityScore({
      severity: "high",
      slaMinutes: 120,
      elapsedMinutes: 30,
      criticalFunctionAffected: true,
    });
    expect(withCf.score).toBeGreaterThan(withoutCf.score);
  });

  it("never exceeds 100 or drops below 0", () => {
    const extremeHigh = computePriorityScore({
      severity: "critical",
      slaMinutes: 1,
      elapsedMinutes: 1000,
      criticalFunctionAffected: true,
      peopleAffectedCount: 1000,
      assignedToMe: true,
      myApprovalNeeded: true,
    });
    expect(extremeHigh.score).toBe(100);

    const extremeLow = computePriorityScore({
      severity: "info",
      slaMinutes: 10000,
      elapsedMinutes: 0,
      criticalFunctionAffected: false,
    });
    expect(extremeLow.score).toBeGreaterThanOrEqual(0);
  });
});
