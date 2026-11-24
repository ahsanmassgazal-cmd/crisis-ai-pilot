import { describe, it, expect, beforeEach } from "vitest";
import { automationRunner } from "@/lib/engine/automations";
import { DexieCrisisRepo } from "@/lib/repo/mock/dexie";
import { useAppStore } from "@/lib/store/useAppStore";

describe("Group F: Automation Runner & Thresholds (Spec 1.6)", () => {
  let repo: DexieCrisisRepo;

  beforeEach(() => {
    repo = new DexieCrisisRepo();
    useAppStore.getState().resetFailures();
    if (useAppStore.getState().isAutomationsPaused) {
      useAppStore.getState().togglePauseAutomations();
    }
  });

  it("triggers SCADA Telemetry Anomaly rule when metric breaches threshold", async () => {
    const results = await automationRunner.runRules(repo, { scadaMetric: 32.5 });
    const scadaResult = results.find((r) => r.ruleId === "rule-04");

    expect(scadaResult?.triggered).toBe(true);
    expect(scadaResult?.actionExecuted).toBe("SUGGEST_INCIDENT_IN_ATTENTION_QUEUE");
  });

  it("does not trigger when SCADA telemetry is above threshold", async () => {
    const results = await automationRunner.runRules(repo, { scadaMetric: 52.0 });
    const scadaResult = results.find((r) => r.ruleId === "rule-04");

    expect(scadaResult?.triggered).toBe(false);
  });

  it("respects kill switch and refuses to execute any rule when automations are paused", async () => {
    useAppStore.getState().togglePauseAutomations(); // paused = true
    const results = await automationRunner.runRules(repo, { scadaMetric: 30.0 });
    expect(results).toHaveLength(0);
  });
});
