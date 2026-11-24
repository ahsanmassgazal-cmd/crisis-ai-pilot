import { describe, it, expect } from "vitest";
import { RoleId } from "@/lib/store/useAppStore";

interface CapabilityCheck {
  canActivateIncident: boolean;
  canApproveExternalMessage: boolean;
  canModifySecurityRules: boolean;
  canViewAuditLedger: boolean;
  isReadOnly: boolean;
}

function getRoleCapabilities(role: RoleId): CapabilityCheck {
  switch (role) {
    case "superAdmin":
      return {
        canActivateIncident: true,
        canApproveExternalMessage: true,
        canModifySecurityRules: true,
        canViewAuditLedger: true,
        isReadOnly: false,
      };
    case "commander":
      return {
        canActivateIncident: true,
        canApproveExternalMessage: true,
        canModifySecurityRules: false,
        canViewAuditLedger: true,
        isReadOnly: false,
      };
    case "executive":
      return {
        canActivateIncident: false,
        canApproveExternalMessage: true, // Executive can approve strategic statements
        canModifySecurityRules: false,
        canViewAuditLedger: true,
        isReadOnly: true, // Read-only tactical operations
      };
    case "auditor":
      return {
        canActivateIncident: false,
        canApproveExternalMessage: false,
        canModifySecurityRules: false,
        canViewAuditLedger: true,
        isReadOnly: true, // Strictly read-only compliance inspector
      };
    case "responder":
      return {
        canActivateIncident: false,
        canApproveExternalMessage: false,
        canModifySecurityRules: false,
        canViewAuditLedger: false,
        isReadOnly: false,
      };
    default:
      return {
        canActivateIncident: false,
        canApproveExternalMessage: false,
        canModifySecurityRules: false,
        canViewAuditLedger: false,
        isReadOnly: false,
      };
  }
}

describe("Group N: Role-Based Capability Matrix (Spec 5)", () => {
  it("enforces Commander capabilities", () => {
    const caps = getRoleCapabilities("commander");
    expect(caps.canActivateIncident).toBe(true);
    expect(caps.isReadOnly).toBe(false);
  });

  it("enforces Executive read-only restriction on tactical operations", () => {
    const caps = getRoleCapabilities("executive");
    expect(caps.canActivateIncident).toBe(false);
    expect(caps.isReadOnly).toBe(true);
    expect(caps.canApproveExternalMessage).toBe(true);
  });

  it("enforces Auditor strict read-only compliance inspection", () => {
    const caps = getRoleCapabilities("auditor");
    expect(caps.isReadOnly).toBe(true);
    expect(caps.canViewAuditLedger).toBe(true);
    expect(caps.canActivateIncident).toBe(false);
    expect(caps.canApproveExternalMessage).toBe(false);
  });
});
