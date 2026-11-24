import React from "react";
import { CATEGORY_CONFIG, CategoryType } from "@/lib/tokens";

interface CategoryTagProps {
  category: string;
  className?: string;
}

export const CategoryTag: React.FC<CategoryTagProps> = ({ category, className = "" }) => {
  const catKey = (category.toLowerCase() in CATEGORY_CONFIG ? category.toLowerCase() : "cyber") as CategoryType;
  const meta = CATEGORY_CONFIG[catKey] || CATEGORY_CONFIG.cyber;
  const Icon = meta.icon;

  const names: Record<CategoryType, string> = {
    cyber: "Cyber Incident",
    fire: "Fire / Explosion",
    power: "Power Outage",
    weather: "Severe Weather",
    health: "Health Hazard",
    supply: "Supply Disruption",
    security: "Physical Security",
    reputation: "Reputation / Media",
    it: "IT Outage",
    environmental: "Environmental Spill",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-app-surface-subtle text-app-text border border-app-border ${className}`}
    >
      <Icon className={`w-3.5 h-3.5 shrink-0 ${meta.colorClass}`} />
      <span>{names[catKey] ?? category}</span>
    </span>
  );
};
