import React from "react";
import { UserCheck, ShieldAlert, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { Ltr } from "@/components/common/Ltr";

export interface ActivityItem {
  id: string;
  actor: string;
  role: string;
  action: string;
  target?: string;
  time: string;
  type?: "alert" | "approval" | "task" | "system";
}

interface ActivityFeedProps {
  items: ActivityItem[];
  className?: string;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ items, className = "" }) => {
  const getIcon = (type?: string) => {
    switch (type) {
      case "alert":
        return <ShieldAlert className="w-3.5 h-3.5 text-severity-critical" />;
      case "approval":
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case "task":
        return <UserCheck className="w-3.5 h-3.5 text-brand-600" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-app-muted" />;
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <div
          key={item.id}
          className="p-3 rounded-input bg-app-surface-subtle/70 border border-app-border flex items-start justify-between gap-3 text-xs"
        >
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 shrink-0">{getIcon(item.type)}</div>
            <div className="space-y-0.5">
              <div className="font-semibold text-app-text">
                <span>{item.actor}</span>{" "}
                <span className="text-[10px] text-app-muted font-normal">({item.role})</span>
              </div>
              <p className="text-[11px] text-app-muted">
                {item.action}{" "}
                {item.target && <strong className="text-app-text">{item.target}</strong>}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-app-muted whitespace-nowrap">
            <Ltr>{item.time}</Ltr>
          </span>
        </div>
      ))}
    </div>
  );
};
