import React from "react";
import { LucideIcon, FolderSearch } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FolderSearch,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}) => {
  return (
    <div
      className={`p-8 rounded-card border border-dashed border-app-border bg-app-surface text-center flex flex-col items-center justify-center space-y-3 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-app-surface-subtle border border-app-border flex items-center justify-center text-app-muted shadow-xs">
        <Icon className="w-6 h-6 text-brand-600" />
      </div>

      <div className="space-y-1 max-w-sm">
        <h4 className="font-bold text-sm text-app-text">{title}</h4>
        <p className="text-xs text-app-muted leading-relaxed">{description}</p>
      </div>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-3 py-1.5 rounded-input bg-brand-600 hover:bg-brand-hover text-white text-xs font-semibold shadow-xs transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
