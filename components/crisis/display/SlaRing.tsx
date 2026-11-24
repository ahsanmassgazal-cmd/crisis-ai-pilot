import React from "react";
import { Ltr } from "@/components/common/Ltr";

interface SlaRingProps {
  totalMinutes: number;
  elapsedMinutes: number;
  size?: number;
  strokeWidth?: number;
  isBreached?: boolean;
  className?: string;
}

export const SlaRing: React.FC<SlaRingProps> = ({
  totalMinutes,
  elapsedMinutes,
  size = 64,
  strokeWidth = 6,
  isBreached: explicitBreached,
  className = "",
}) => {
  const percentUsed = totalMinutes > 0 ? (elapsedMinutes / totalMinutes) * 100 : 0;
  const isBreached = explicitBreached !== undefined ? explicitBreached : elapsedMinutes > totalMinutes;
  const percentLeft = Math.max(0, 100 - percentUsed);

  // SLA Color Logic
  let strokeClass = "text-emerald-500";
  let pulseClass = "";
  if (isBreached) {
    strokeClass = "text-severity-critical";
  } else if (percentLeft < 20) {
    strokeClass = "text-severity-critical";
    pulseClass = "animate-pulse";
  } else if (percentLeft <= 50) {
    strokeClass = "text-amber-500";
  }

  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = isBreached
    ? 0
    : circumference - (percentLeft / 100) * circumference;

  const remainingMin = Math.round(totalMinutes - elapsedMinutes);
  const breachedMin = Math.round(elapsedMinutes - totalMinutes);

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${pulseClass} ${className}`}
      style={{ width: size, height: size }}
      title={isBreached ? `SLA Breached by +${breachedMin}m` : `${remainingMin}m remaining`}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="text-app-border stroke-current"
          strokeWidth="4"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={`${strokeClass} stroke-current transition-all duration-500`}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-[10px] font-bold">
        {isBreached ? (
          <span className="text-severity-critical text-[9px] font-mono leading-none">
            +<Ltr>{breachedMin}m</Ltr>
          </span>
        ) : (
          <span className="text-app-text font-mono leading-none">
            <Ltr>{remainingMin}m</Ltr>
          </span>
        )}
      </div>
    </div>
  );
};
