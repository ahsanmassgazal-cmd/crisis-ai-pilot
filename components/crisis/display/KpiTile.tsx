import React from "react";
import { Link } from "@/i18n/routing";
import { LucideIcon } from "lucide-react";
import { Ltr } from "@/components/common/Ltr";

interface KpiTileProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: LucideIcon;
  iconColorClass?: string;
  href?: string;
  delta?: { text: string; positive: boolean };
  className?: string;
}

export const KpiTile: React.FC<KpiTileProps> = ({
  label,
  value,
  subValue,
  icon: Icon,
  iconColorClass = "text-brand-600",
  href,
  delta,
  className = "",
}) => {
  const content = (
    <div
      className={`p-4 rounded-card bg-app-surface border border-app-border hover:border-brand-600/50 transition-all flex flex-col justify-between shadow-sm ${
        href ? "cursor-pointer group" : ""
      } ${className}`}
    >
      <div className="flex items-center justify-between text-app-muted text-xs font-semibold">
        <span className="truncate">{label}</span>
        {Icon && <Icon className={`w-4 h-4 shrink-0 ${iconColorClass}`} />}
      </div>

      <div className="mt-3">
        <div className="text-2xl font-black text-app-text tracking-tight group-hover:text-brand-600 transition-colors">
          <Ltr>{value}</Ltr>
        </div>
        <div className="flex items-center justify-between mt-1 text-[11px]">
          {subValue && <span className="text-app-muted font-medium truncate">{subValue}</span>}
          {delta && (
            <span
              className={`font-semibold ${
                delta.positive ? "text-emerald-600" : "text-severity-critical"
              }`}
            >
              <Ltr>{delta.text}</Ltr>
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="block">{content}</Link>;
  }

  return content;
};
