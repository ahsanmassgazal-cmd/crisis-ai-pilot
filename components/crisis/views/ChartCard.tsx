import React from "react";
import { Ltr } from "@/components/common/Ltr";

export interface ChartDataPoint {
  label: string;
  value: number;
  colorClass?: string;
}

interface ChartCardProps {
  title: string;
  subtitle?: string;
  data: ChartDataPoint[];
  type?: "bar" | "funnel";
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  data,
  type = "bar",
  className = "",
}) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={`p-4 rounded-card bg-app-surface border border-app-border space-y-4 shadow-sm ${className}`}>
      <div>
        <h3 className="font-bold text-xs text-app-text">{title}</h3>
        {subtitle && <p className="text-[11px] text-app-muted mt-0.5">{subtitle}</p>}
      </div>

      <div className="space-y-2.5">
        {data.map((item, idx) => {
          const pct = Math.round((item.value / maxValue) * 100);
          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-app-text">{item.label}</span>
                <span className="font-bold text-app-muted font-mono">
                  <Ltr>{item.value}</Ltr>
                </span>
              </div>

              <div className="h-3 w-full bg-app-surface-subtle rounded-chip overflow-hidden border border-app-border/40">
                <div
                  className={`h-full rounded-chip transition-all duration-500 ${
                    item.colorClass || "bg-brand-600"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
