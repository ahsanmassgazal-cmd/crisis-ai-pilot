/**
 * Algorithmic Priority Score (0-100) — Section 8
 * Computed strictly by deterministic code, not AI.
 *
 * Factors:
 * - Severity: Critical=40, High=30, Medium=20, Low=10, Info=0
 * - SLA Urgency: (% of SLA used * 0.3, max 30); breached = 30
 * - Impact: Critical function affected = 10, People affected (0-10 scaled)
 * - Relevance to Me: Assigned to me = +10, My approval needed = +10 (capped at 100)
 *
 * Lanes:
 * - Now (>= 70, red-start border)
 * - Next (40-69, amber-start border)
 * - Later (< 40, slate-start border)
 */

export interface PriorityInput {
  severity: "critical" | "high" | "medium" | "low" | "info";
  slaMinutes: number;
  elapsedMinutes: number;
  criticalFunctionAffected?: boolean;
  peopleAffectedCount?: number;
  assignedToMe?: boolean;
  myApprovalNeeded?: boolean;
}

export interface PriorityResult {
  score: number;
  lane: "now" | "next" | "later";
  reasons: string[];
}

export function computePriorityScore(input: PriorityInput): PriorityResult {
  let score = 0;
  const reasons: string[] = [];

  // 1. Severity points
  const sevPoints: Record<string, number> = {
    critical: 40,
    high: 30,
    medium: 20,
    low: 10,
    info: 0,
  };
  score += sevPoints[input.severity] ?? 0;
  if (input.severity === "critical") reasons.push("Critical Severity (SEV1)");

  // 2. SLA urgency points
  if (input.slaMinutes > 0) {
    const slaPercent = (input.elapsedMinutes / input.slaMinutes) * 100;
    if (slaPercent >= 100) {
      score += 30;
      const overMin = Math.round(input.elapsedMinutes - input.slaMinutes);
      reasons.push(`SLA Breached by +${overMin}m`);
    } else {
      const slaPts = Math.min(30, Math.round((slaPercent / 100) * 30));
      score += slaPts;
      if (slaPercent >= 80) {
        reasons.push(`${Math.round(100 - slaPercent)}% SLA remaining`);
      }
    }
  }

  // 3. Impact points
  if (input.criticalFunctionAffected) {
    score += 10;
    reasons.push("Critical function affected");
  }
  const count = input.peopleAffectedCount ?? 0;
  if (count > 0) {
    const peoplePts = Math.min(10, Math.round((count / 250) * 10));
    score += peoplePts;
    if (count >= 50) reasons.push(`${count} people affected`);
  }

  // 4. Relevance points
  if (input.assignedToMe) {
    score += 10;
    reasons.push("Assigned to you");
  }
  if (input.myApprovalNeeded) {
    score += 10;
    reasons.push("Approval waiting on you");
  }

  const finalScore = Math.min(100, Math.max(0, score));

  let lane: "now" | "next" | "later" = "later";
  if (finalScore >= 70) {
    lane = "now";
  } else if (finalScore >= 40) {
    lane = "next";
  }

  return {
    score: finalScore,
    lane,
    reasons: reasons.slice(0, 2),
  };
}
