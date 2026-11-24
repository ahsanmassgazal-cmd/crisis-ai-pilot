import { AuditRow } from "@/lib/repo/types";

export const GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000";

/**
 * Cross-environment SHA-256 using Web Crypto API (supported natively in browsers and Node 19+)
 */
export async function sha256(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Formats canonical content string for an audit row before hashing
 */
export function formatAuditPayload(row: {
  seq: number;
  prev_hash: string;
  created_at: string;
  actor_id: string;
  action: string;
  entity: string;
  entity_id: string;
  after_json?: any;
}): string {
  const canonicalData = row.after_json ? JSON.stringify(row.after_json) : "{}";
  return `${row.prev_hash}:${row.seq}:${row.created_at}:${row.actor_id}:${row.action}:${row.entity}:${row.entity_id}:${canonicalData}`;
}

/**
 * Computes hash for an audit row based on its previous hash and canonical payload
 */
export async function computeAuditRowHash(row: {
  seq: number;
  prev_hash: string;
  created_at: string;
  actor_id: string;
  action: string;
  entity: string;
  entity_id: string;
  after_json?: any;
}): Promise<string> {
  const payload = formatAuditPayload(row);
  return await sha256(payload);
}

/**
 * Validates the full audit chain.
 * Returns valid: true if every block's prev_hash matches the prior block's hash
 * and every block's hash recomputed matches the recorded hash.
 * Returns valid: false and brokenAt index if tampered.
 */
export async function verifyAuditChain(
  rows: AuditRow[]
): Promise<{ valid: boolean; brokenAt?: number; count: number; errorReason?: string }> {
  if (!rows || rows.length === 0) {
    return { valid: true, count: 0 };
  }

  // Ensure rows are sorted by seq
  const sorted = [...rows].sort((a, b) => a.seq - b.seq);

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];

    if (i === 0) {
      if (current.prev_hash !== GENESIS_HASH && !current.prev_hash.startsWith("00000000")) {
        return {
          valid: false,
          brokenAt: i,
          count: sorted.length,
          errorReason: `Genesis block prev_hash invalid at seq ${current.seq}`,
        };
      }
    } else {
      const prev = sorted[i - 1];
      if (current.prev_hash !== prev.hash) {
        return {
          valid: false,
          brokenAt: i,
          count: sorted.length,
          errorReason: `Chain link broken between seq ${prev.seq} and ${current.seq}. prev_hash does not match previous row hash.`,
        };
      }
    }

    const expectedHash = await computeAuditRowHash(current);
    if (expectedHash !== current.hash) {
      return {
        valid: false,
        brokenAt: i,
        count: sorted.length,
        errorReason: `Bit-flip / data tampering detected at seq ${current.seq}. Expected hash ${expectedHash}, found ${current.hash}.`,
      };
    }
  }

  return { valid: true, count: sorted.length };
}

/**
 * Simulates a cryptographic bit-flip or data tampering in an audit row
 */
export function tamperAuditRow(rows: AuditRow[], targetSeqOrIndex: number): AuditRow[] {
  return rows.map((row, idx) => {
    if (row.seq === targetSeqOrIndex || idx === targetSeqOrIndex) {
      return {
        ...row,
        action: row.action + "_TAMPERED",
        reason: "Unauthorized manual database manipulation",
        // Notice we do NOT recompute row.hash, causing a mismatch during verifyAuditChain
      };
    }
    return row;
  });
}
