import React from "react";

export interface SavedView {
  id: string;
  name: string;
  count?: number;
}

interface SavedViewTabsProps {
  views: SavedView[];
  activeViewId: string;
  onSelectView: (id: string) => void;
  className?: string;
}

export const SavedViewTabs: React.FC<SavedViewTabsProps> = ({
  views,
  activeViewId,
  onSelectView,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-app-border ${className}`}>
      {views.map((v) => {
        const isActive = activeViewId === v.id;
        return (
          <button
            key={v.id}
            onClick={() => onSelectView(v.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-input font-semibold transition-all whitespace-nowrap border-b-2 ${
              isActive
                ? "border-brand-600 text-brand-600 bg-brand-50/50 dark:bg-brand-50/10 font-bold"
                : "border-transparent text-app-muted hover:text-app-text hover:bg-app-surface-subtle"
            }`}
          >
            <span>{v.name}</span>
            {v.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-chip font-mono ${
                  isActive
                    ? "bg-brand-600 text-white"
                    : "bg-app-surface-subtle text-app-muted"
                }`}
              >
                {v.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
