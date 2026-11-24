import { useTranslations } from "next-intl";
import React from "react";
import { Filter, X, Plus } from "lucide-react";

export interface ActiveFilter {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface FilterBarProps {
  filters: ActiveFilter[];
  onRemoveFilter?: (id: string) => void;
  onAddFilter?: () => void;
  onClearAll?: () => void;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onRemoveFilter,
  onAddFilter,
  onClearAll,
  className = "",
}) => {
  const t = useTranslations("components");
  return (
    <div className={`flex flex-wrap items-center gap-2 text-xs ${className}`}>
      <div className="flex items-center gap-1.5 text-app-muted font-bold text-[11px] pe-1">
        <Filter className="w-3.5 h-3.5" />
        <span>{t("filtersLabel")}</span>
      </div>

      {filters.map((f) => (
        <span
          key={f.id}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-chip bg-brand-50 text-brand-600 dark:bg-brand-50/20 border border-brand-600/30 text-xs font-semibold shadow-xs"
        >
          <span>{f.field}</span>
          <span className="opacity-60 text-[10px]">{f.operator}</span>
          <span className="font-bold underline">{f.value}</span>
          {onRemoveFilter && (
            <button
              onClick={() => onRemoveFilter(f.id)}
              className="ms-1 hover:opacity-75 focus:outline-none"
              aria-label={`Remove filter ${f.field}`}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      ))}

      {onAddFilter && (
        <button
          onClick={onAddFilter}
          className="flex items-center gap-1 px-2.5 py-1 rounded-chip border border-dashed border-app-border text-app-muted hover:text-brand-600 hover:border-brand-600 transition-colors"
        >
          <Plus className="w-3 h-3" />
          <span>{t("addFilter")}</span>
        </button>
      )}

      {filters.length > 0 && onClearAll && (
        <button
          onClick={onClearAll}
          className="text-[11px] text-app-muted hover:text-severity-critical underline ms-auto"
        >
          Reset All
        </button>
      )}
    </div>
  );
};
