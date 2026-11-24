import { describe, it, expect } from "vitest";
import { DexieCrisisRepo } from "@/lib/repo/mock/dexie";
import { checkMessageApproval } from "@/lib/engine/approvals";

describe("AI Copilot Draft to Commander Approval Flow", () => {
  it("creates an AI draft message, verifies dispatch is blocked, then approves and permits send", async () => {
    const repo = new DexieCrisisRepo();

    // 1. Create AI-generated draft SitRep message
    const draftMessage = await repo.messages.create({
      incident_id: "inc-2026-001",
      audience_json: { groups: ["executive_committee", "hse_leads"] },
      subject_en: "[AI SitRep] Sohar SCADA Anomaly Initial Containment",
      subject_ar: "[تقرير موقف ذكاء اصطناعي] احتواء مبدئي لخلل شبكة صحار",
      body_en: "Telemetry desynchronization detected at 10:14 GST. Safety containment protocol engaged.",
      body_ar: "تم رصد عدم تزامن القياسات عند الساعة 10:14 بتوقيت الخليج. بروتوكول الأمان قيد التشغيل.",
      status: "pending",
      ai_generated: true,
      translation_reviewed: true,
      version: 1,
    });

    expect(draftMessage.id).toBeDefined();
    expect(draftMessage.ai_generated).toBe(true);
    expect(draftMessage.status).toBe("pending");

    // 2. Dispatch check must refuse unapproved message
    const preApprovalCheck = checkMessageApproval(draftMessage);
    expect(preApprovalCheck.canSend).toBe(false);
    expect(preApprovalCheck.reason).toContain("requires explicit Commander/Executive approval");

    // 3. Commander approves the message
    await repo.messages.approve(draftMessage.id, "usr-commander-001");

    const approvedMessage = await repo.messages.getById(draftMessage.id);
    expect(approvedMessage).toBeDefined();
    expect(approvedMessage!.status).toBe("approved");
    expect(approvedMessage!.approved_by).toBe("usr-commander-001");
    expect(approvedMessage!.approved_at).toBeDefined();

    // 4. Dispatch check must now succeed
    const postApprovalCheck = checkMessageApproval(approvedMessage!);
    expect(postApprovalCheck.canSend).toBe(true);
  });
});
