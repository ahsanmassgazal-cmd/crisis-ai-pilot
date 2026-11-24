import React from "react";
import { Ltr } from "@/components/common/Ltr";

interface ProgressRingProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  colorClass?: string;
  tone?: "brand" | "emerald" | "amber" | "rose" | "slate";
  label?: string;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 56,
  strokeWidth = 4,
  colorClass,
  tone = "brand",
  label,
  className = "",
}) => {
  const toneClasses: Record<string, string> = {
    brand: "text-brand-600",
    emerald: "text-emerald-600",
    amber: "text-amber-500",
    rose: "text-rose-600",
    slate: "text-slate-500",
  };
  const activeColorClass = colorClass || toneClasses[tone] || "text-brand-600";
  const clamped = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="text-app-border stroke-current"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={`${activeColorClass} stroke-current transition-all duration-500`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center font-bold text-xs">
        <Ltr>{clamped}%</Ltr>
        {label && <span className="text-[9px] text-app-muted font-normal">{label}</span>}
      </div>
    </div>
  );
};
