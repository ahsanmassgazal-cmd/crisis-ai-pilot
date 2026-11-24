"use client";

import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmWord?: string; // e.g. "PAUSE" or "DELETE"
  confirmButtonLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmWord,
  confirmButtonLabel = "Confirm",
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  const [typedInput, setTypedInput] = useState("");

  if (!isOpen) return null;

  const canConfirm = !confirmWord || typedInput.trim() === confirmWord;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div
        className="w-full max-w-md bg-app-surface border border-app-border rounded-card p-6 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center ${
                isDestructive
                  ? "bg-severity-critical-tint text-severity-critical"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-app-text">{title}</h3>
              <p className="text-xs text-app-muted mt-0.5">{description}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-app-muted hover:text-app-text p-1 rounded-input"
            aria-label="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {confirmWord && (
          <div className="space-y-1.5 pt-2">
            <label className="text-[11px] font-semibold text-app-muted">
              Please type <strong className="text-app-text font-mono">{confirmWord}</strong> to continue:
            </label>
            <input
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              className="w-full px-3 py-2 rounded-input border border-app-border bg-app-surface text-xs font-mono outline-none focus:border-brand-600"
              autoFocus
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-app-border">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 rounded-input border border-app-border bg-app-surface text-app-text text-xs font-semibold hover:bg-app-surface-subtle"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (canConfirm) onConfirm();
            }}
            disabled={!canConfirm}
            className={`px-3 py-1.5 rounded-input text-xs font-bold text-white shadow-xs transition-opacity ${
              isDestructive
                ? "bg-severity-critical hover:opacity-90 disabled:opacity-40"
                : "bg-brand-600 hover:bg-brand-hover disabled:opacity-40"
            }`}
          >
            {confirmButtonLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
