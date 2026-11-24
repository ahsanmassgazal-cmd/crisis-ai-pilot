"use client";

import React from "react";
import { Sparkles, Check, X, ShieldAlert, ArrowUpRight } from "lucide-react";
import { Ltr } from "@/components/layout/Ltr";

export interface AiSuggestionCardProps {
  id: string;
  title: string;
  recommendation: string;
  impactScore?: number;
  confidencePercent?: number;
  category?: string;
  onAccept?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export function AiSuggestionCard({
  id,
  title,
  recommendation,
  impactScore = 88,
  confidencePercent = 94,
  category = "Containment Protocol",
  onAccept,
  onDismiss
}: AiSuggestionCardProps) {
  return (
    <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-4 shadow-xs space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-brand-500/20 p-1.5 text-brand-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
                {category}
              </span>
              <span className="rounded-full bg-brand-500/10 px-2 py-0.2 text-[10px] font-semibold text-brand-300 border border-brand-500/20">
                Confidence <Ltr>{confidencePercent}%</Ltr>
              </span>
            </div>
            <h4 className="text-xs font-semibold text-text-main mt-0.5">{title}</h4>
          </div>
        </div>

        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          Impact: <Ltr>+{impactScore}</Ltr>
        </span>
      </div>

      <p className="text-xs text-text-muted leading-relaxed whitespace-pre-line">
        {recommendation}
      </p>

      <div className="flex items-center justify-end gap-2 border-t border-brand-500/20 pt-2.5">
        <button
          type="button"
          onClick={() => onDismiss?.(id)}
          className="inline-flex items-center gap-1 rounded-lg border border-border-subtle bg-surface-base px-2.5 py-1 text-xs text-text-muted hover:text-text-main transition"
        >
          <X className="h-3 w-3" /> Dismiss
        </button>
        <button
          type="button"
          onClick={() => onAccept?.(id)}
          className="inline-flex items-center gap-1 rounded-lg bg-brand-500 px-3 py-1 text-xs font-semibold text-white hover:bg-brand-600 shadow-sm transition"
        >
          <Check className="h-3.5 w-3.5" /> Accept Suggestion
        </button>
      </div>
    </div>
  );
}
