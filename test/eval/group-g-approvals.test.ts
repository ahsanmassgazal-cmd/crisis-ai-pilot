import { describe, it, expect } from "vitest";
import { checkMessageApproval, editMessageWithApprovalReset } from "@/lib/engine/approvals";
import { DexieCrisisRepo } from "@/lib/repo/mock/dexie";
import { Message } from "@/lib/repo/types";

describe("Group G: Approval Gate & Edit Reset (Spec 1.4)", () => {
  it("blocks delivery if message is not approved", () => {
    const draftMsg: Message = {
      id: "msg-pending-test",
      incident_id: "inc-1",
      audience_json: {},
      subject_en: "Sub",
      subject_ar: "موضوع",
      body_en: "Body",
      body_ar: "محتوى",
      status: "pending",
      ai_generated: false,
      translation_reviewed: false,
      version: 1,
    };

    const check = checkMessageApproval(draftMsg);
    expect(check.canSend).toBe(false);
    expect(check.reason).toContain("requires explicit Commander/Executive approval");
  });

  it("allows delivery when status is approved", () => {
    const approvedMsg: Message = {
      id: "msg-approved-test",
      incident_id: "inc-1",
      audience_json: {},
      subject_en: "Sub",
      subject_ar: "موضوع",
      body_en: "Body",
      body_ar: "محتوى",
      status: "approved",
      ai_generated: false,
      translation_reviewed: true,
      version: 1,
    };

    const check = checkMessageApproval(approvedMsg);
    expect(check.canSend).toBe(true);
  });

  it("resets approved status to pending and bumps version when edited", async () => {
    const repo = new DexieCrisisRepo();
    const created = await repo.messages.create({
      incident_id: "inc-1",
      audience_json: {},
      subject_en: "Original",
      subject_ar: "أصلي",
      body_en: "Original Body",
      body_ar: "محتوى أصلي",
      status: "approved",
      ai_generated: false,
      translation_reviewed: true,
      version: 1,
    });

    const updated = await editMessageWithApprovalReset(repo, created.id, {
      body_en: "Modified Body Content",
    });

    expect(updated.status).toBe("pending");
    expect(updated.version).toBe(2);
    expect(updated.body_en).toBe("Modified Body Content");
  });
});
