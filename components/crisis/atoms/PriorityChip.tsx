import React from "react";
import { PRIORITY_CONFIG, PriorityLevel } from "@/lib/tokens";
import { Ltr } from "@/components/common/Ltr";

export interface PriorityChipProps {
  priority?: PriorityLevel;
  lane?: "now" | "next" | "later";
  score?: number;
  className?: string;
}

export const PriorityChip: React.FC<PriorityChipProps> = ({
  priority,
  lane,
  score,
  className = "",
}) => {
  // If lane is specified, determine equivalent priority level
  let effectivePriority: PriorityLevel = priority || "p3";
  let label = "";

  if (lane) {
    if (lane === "now") {
      effectivePriority = "p1";
      label = "NOW";
    } else if (lane === "next") {
      effectivePriority = "p2";
      label = "NEXT";
    } else {
      effectivePriority = "p3";
      label = "LATER";
    }
  } else if (priority) {
    const labels: Record<PriorityLevel, string> = {
      p1: "P1 Act Now",
      p2: "P2 This Shift",
      p3: "P3 Plan It",
      p4: "P4 Backlog",
    };
    label = labels[priority] ?? priority.toUpperCase();
  }

  const meta = PRIORITY_CONFIG[effectivePriority] || PRIORITY_CONFIG.p4;
  const Icon = meta.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-chip text-[10px] font-bold tracking-tight shadow-sm ${meta.chipClass} ${className}`}
    >
      <Icon className="w-3 h-3 shrink-0" />
      <span>{label}</span>
      {score !== undefined && (
        <span className="opacity-90 font-mono text-[9px] border-s border-current/30 ps-1">
          <Ltr>{score}</Ltr>
        </span>
      )}
    </span>
  );
};
