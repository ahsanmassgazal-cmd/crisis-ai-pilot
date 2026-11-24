import React from "react";
import { Ltr } from "@/components/common/Ltr";

export interface GanttItem {
  id: string;
  title: string;
  owner: string;
  startMinutes: number;
  durationMinutes: number;
  progressPercent: number;
  status: "pending" | "active" | "completed" | "delayed";
}

export interface GanttTimelineProps {
  items?: GanttItem[];
  tasks?: Array<{
    id: string;
    name?: string;
    title?: string;
    owner?: string;
    start?: string;
    end?: string;
    startMinutes?: number;
    durationMinutes?: number;
    progress?: number;
    progressPercent?: number;
    status?: "pending" | "active" | "completed" | "delayed" | "todo" | "inprogress" | "done";
  }>;
  totalTimeMinutes?: number;
  className?: string;
}

export const GanttTimeline: React.FC<GanttTimelineProps> = ({
  items: directItems,
  tasks: directTasks,
  totalTimeMinutes = 240,
  className = "",
}) => {
  const items: GanttItem[] = directItems || (directTasks || []).map((t, idx) => ({
    id: t.id,
    title: t.name || t.title || `Task ${idx + 1}`,
    owner: t.owner || "Crisis Team",
    startMinutes: t.startMinutes ?? idx * 30,
    durationMinutes: t.durationMinutes ?? 45,
    progressPercent: t.progressPercent ?? t.progress ?? 0,
    status: (t.status === "done" ? "completed" : t.status === "inprogress" ? "active" : "pending") as any,
  }));
  return (
    <div className={`p-4 rounded-card bg-app-surface border border-app-border space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-xs text-app-text">Recovery Phase Timeline (RTO Countdown)</h3>
          <p className="text-[11px] text-app-muted">Scheduled sequence and offset durations across recovery teams</p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-app-surface-subtle text-app-muted">
          Total Window: <Ltr>{totalTimeMinutes}m</Ltr>
        </span>
      </div>

      <div className="space-y-3 overflow-x-auto">
        {/* Time markers */}
        <div className="flex text-[10px] font-mono text-app-muted border-b border-app-border pb-1 ps-48">
          <span className="w-1/4">T+0m</span>
          <span className="w-1/4">T+60m (1h)</span>
          <span className="w-1/4">T+120m (2h)</span>
          <span className="w-1/4 text-end">T+240m (4h)</span>
        </div>

        {/* Rows */}
        {items.map((item) => {
          const startPct = (item.startMinutes / totalTimeMinutes) * 100;
          const widthPct = Math.max(5, (item.durationMinutes / totalTimeMinutes) * 100);

          return (
            <div key={item.id} className="flex items-center text-xs">
              <div className="w-48 pe-3 truncate">
                <div className="font-semibold text-app-text truncate">{item.title}</div>
                <div className="text-[10px] text-app-muted truncate">{item.owner}</div>
              </div>

              <div className="flex-1 relative h-7 bg-app-surface-subtle rounded-input overflow-hidden border border-app-border">
                <div
                  className="absolute top-1 bottom-1 rounded bg-brand-600 text-white text-[10px] font-bold flex items-center justify-between px-2 shadow-xs transition-all"
                  style={{
                    left: `${startPct}%`,
                    width: `${widthPct}%`,
                  }}
                >
                  <span className="truncate">{item.durationMinutes}m</span>
                  <span className="text-[9px] opacity-80"><Ltr>{item.progressPercent}%</Ltr></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
