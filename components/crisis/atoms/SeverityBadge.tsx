import React from "react";
import { SEVERITY_CONFIG, SeverityLevel } from "@/lib/tokens";

export interface SeverityBadgeProps {
  level?: SeverityLevel;
  severity?: SeverityLevel;
  className?: string;
  showIcon?: boolean;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  level,
  severity,
  className = "",
  showIcon = true,
}) => {
  const effectiveLevel = severity || level || "info";
  const meta = SEVERITY_CONFIG[effectiveLevel] || SEVERITY_CONFIG.info;
  const Icon = meta.icon;

  const labels: Record<SeverityLevel, { en: string; ar: string }> = {
    critical: { en: "Critical (SEV1)", ar: "حرج (SEV1)" },
    high: { en: "High (SEV2)", ar: "مرتفع (SEV2)" },
    medium: { en: "Medium (SEV3)", ar: "متوسط (SEV3)" },
    low: { en: "Low (SEV4)", ar: "منخفض (SEV4)" },
    info: { en: "Informational", ar: "معلومات" },
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-chip text-[11px] font-bold border transition-colors ${meta.badgeClass} ${className}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{labels[effectiveLevel]?.en ?? effectiveLevel}</span>
    </span>
  );
};
