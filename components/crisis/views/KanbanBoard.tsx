"use client";

import React from "react";
import { PriorityChip } from "@/components/crisis/atoms/PriorityChip";
import { SlaRing } from "@/components/crisis/display/SlaRing";
import { User, AlertCircle, Clock } from "lucide-react";
import { Ltr } from "@/components/common/Ltr";

export interface KanbanItem {
  id: string;
  title: string;
  owner: string;
  priority: "p1" | "p2" | "p3" | "p4";
  status: "todo" | "doing" | "blocked" | "done";
  dueMinutes?: number;
  priorityScore: number;
}

interface KanbanBoardProps {
  items: KanbanItem[];
  onMoveItem?: (id: string, newStatus: KanbanItem["status"]) => void;
  className?: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  items,
  onMoveItem,
  className = "",
}) => {
  const columns: { status: KanbanItem["status"]; title: string; colorClass: string }[] = [
    { status: "todo", title: "To Do", colorClass: "border-slate-400" },
    { status: "doing", title: "In Progress", colorClass: "border-indigo-500" },
    { status: "blocked", title: "Blocked / Escalated", colorClass: "border-severity-critical" },
    { status: "done", title: "Completed", colorClass: "border-emerald-500" },
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {columns.map((col) => {
        const colItems = items.filter((i) => i.status === col.status);
        return (
          <div
            key={col.status}
            className="rounded-card bg-app-surface-subtle/40 border border-app-border p-3 flex flex-col min-h-[420px]"
          >
            {/* Column Header */}
            <div className={`pb-2.5 mb-3 border-b-2 ${col.colorClass} flex items-center justify-between`}>
              <h3 className="font-bold text-xs text-app-text">{col.title}</h3>
              <span className="px-2 py-0.5 rounded-chip text-[11px] font-bold bg-app-surface border border-app-border">
                <Ltr>{colItems.length}</Ltr>
              </span>
            </div>

            {/* Cards Stack */}
            <div className="flex-1 space-y-2.5 overflow-y-auto">
              {colItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-input bg-app-surface border border-app-border shadow-xs hover:border-brand-600/40 transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <PriorityChip priority={item.priority} />
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-app-surface-subtle text-app-muted">
                      Score: <Ltr>{item.priorityScore}</Ltr>
                    </span>
                  </div>

                  <h4 className="font-semibold text-xs text-app-text leading-snug">
                    {item.title}
                  </h4>

                  <div className="pt-2 border-t border-app-border flex items-center justify-between text-[11px] text-app-muted">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-brand-600" />
                      <span className="truncate max-w-[120px]">{item.owner}</span>
                    </div>

                    {item.dueMinutes !== undefined && (
                      <div className="flex items-center gap-1 font-mono text-[10px]">
                        <Clock className="w-3 h-3" />
                        <span><Ltr>{item.dueMinutes}m</Ltr></span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {colItems.length === 0 && (
                <div className="h-24 flex items-center justify-center text-xs text-app-muted/60 border border-dashed border-app-border rounded-input">
                  Empty lane
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
