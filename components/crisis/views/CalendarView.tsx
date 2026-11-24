import { useTranslations } from "next-intl";
import React from "react";
import { Ltr } from "@/components/common/Ltr";

export interface CalendarEvent {
  id: string;
  day: number; // 1-30
  title: string;
  type: "drill" | "audit" | "expiry" | "shift";
}

interface CalendarViewProps {
  monthName?: string;
  events?: CalendarEvent[];
  className?: string;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  monthName = "November 2026",
  events = [],
  className = "",
}) => {
  const t = useTranslations("components");
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  const getBadgeClass = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "drill":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300";
      case "audit":
        return "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300";
      case "expiry":
        return "bg-severity-critical-tint text-severity-critical border-severity-critical/30";
      default:
        return "bg-brand-50 text-brand-600 border-brand-600/30";
    }
  };

  return (
    <div className={`p-4 rounded-card bg-app-surface border border-app-border space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-app-text">{monthName}</h3>
        <span className="text-xs text-app-muted">{t("calendarTitle")}</span>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="p-1.5 font-bold text-app-muted text-[10px] uppercase">
            {d}
          </div>
        ))}

        {days.map((day) => {
          const dayEvents = events.filter((e) => e.day === day);
          return (
            <div
              key={day}
              className={`min-h-[72px] p-1 rounded border border-app-border text-start flex flex-col justify-between ${
                day === 24 ? "bg-brand-50/40 border-brand-600" : "bg-app-surface"
              }`}
            >
              <span className={`text-[11px] font-bold ${day === 24 ? "text-brand-600" : "text-app-muted"}`}>
                <Ltr>{day}</Ltr>
              </span>

              <div className="space-y-1 mt-1">
                {dayEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className={`px-1 py-0.5 rounded text-[9px] font-semibold truncate border ${getBadgeClass(
                      evt.type
                    )}`}
                    title={evt.title}
                  >
                    {evt.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
