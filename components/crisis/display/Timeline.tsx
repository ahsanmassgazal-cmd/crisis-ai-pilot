import React from "react";
import { LucideIcon, Clock } from "lucide-react";
import { Ltr } from "@/components/common/Ltr";

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  badge?: string;
  badgeColorClass?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ events, className = "" }) => {
  return (
    <div className={`relative space-y-4 ps-6 border-s border-app-border ${className}`}>
      {events.map((evt) => {
        const Icon = evt.icon || Clock;
        return (
          <div key={evt.id} className="relative group">
            {/* Timeline Dot with Icon */}
            <div className="absolute -start-[35px] top-0.5 w-7 h-7 rounded-full bg-app-surface border border-app-border flex items-center justify-center text-brand-600 shadow-xs">
              <Icon className="w-3.5 h-3.5" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono text-app-muted">
                  <Ltr>{evt.time}</Ltr>
                </span>
                {evt.badge && (
                  <span
                    className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                      evt.badgeColorClass || "bg-app-surface-subtle text-app-text"
                    }`}
                  >
                    {evt.badge}
                  </span>
                )}
              </div>
              <h4 className="font-bold text-xs text-app-text">{evt.title}</h4>
              {evt.description && (
                <p className="text-[11px] text-app-muted leading-relaxed">
                  {evt.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
