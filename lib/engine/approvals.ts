import { Message, CrisisRepository } from "@/lib/repo/types";

export interface ApprovalCheckResult {
  canSend: boolean;
  reason?: string;
}

/**
 * Spec 1.4: Approval Gate
 * The delivery dispatcher refuses to send unapproved external messages.
 * Editing an approved message automatically resets status to pending and bumps version.
 */
export function checkMessageApproval(message: Message): ApprovalCheckResult {
  if (message.status !== "approved") {
    return {
      canSend: false,
      reason: `Message ${message.id} is in "${message.status}" status and requires explicit Commander/Executive approval.`,
    };
  }

  return { canSend: true };
}

/**
 * Modifies an existing message, resetting its approval status to pending and bumping version
 */
export async function editMessageWithApprovalReset(
  repo: CrisisRepository,
  messageId: string,
  updates: Partial<Message>
): Promise<Message> {
  const current = await repo.messages.getById(messageId);
  if (!current) {
    throw new Error(`Message ${messageId} not found`);
  }

  const updated = await repo.messages.update(messageId, {
    ...updates,
    status: "pending", // Reset approval
    approved_by: undefined,
    approved_at: undefined,
    version: (current.version || 1) + 1,
  });

  // Log in audit trail
  await repo.audit.append({
    tenant_id: "gulf_water",
    actor_id: "usr-001",
    actor_role: "commander",
    action: "MESSAGE_EDITED_APPROVAL_RESET",
    entity: "message",
    entity_id: messageId,
    after_json: { version: updated.version, status: "pending" },
    reason: "Message content updated, resetting required approval gate.",
    ip_hint: "10.200.4.1",
    created_at: new Date().toISOString(),
  });

  return updated;
}
