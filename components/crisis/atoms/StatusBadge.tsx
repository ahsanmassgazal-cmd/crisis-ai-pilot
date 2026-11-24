import React from "react";
import { STATUS_CONFIG, IncidentStatus } from "@/lib/tokens";

interface StatusBadgeProps {
  status: IncidentStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = "" }) => {
  const meta = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  const Icon = meta.icon;

  const labels: Record<IncidentStatus, string> = {
    draft: "Draft",
    active: "Active",
    inprogress: "In Progress",
    monitoring: "Monitoring",
    blocked: "Blocked",
    resolved: "Resolved",
    closed: "Closed",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-chip text-[11px] font-semibold border border-app-border bg-app-surface text-app-text shadow-sm ${className}`}
    >
      <Icon className={`w-3.5 h-3.5 shrink-0 ${meta.colorClass}`} />
      <span>{labels[status] ?? status}</span>
    </span>
  );
};
