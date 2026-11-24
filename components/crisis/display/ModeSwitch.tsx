"use client";

import React from "react";
import { Zap, HelpCircle, Hand } from "lucide-react";

export type AutomationMode = "auto" | "assisted" | "manual";

export interface ModeSwitchProps {
  currentMode: AutomationMode;
  onModeChange: (mode: AutomationMode) => void;
  compact?: boolean;
}

export function ModeSwitch({
  currentMode,
  onModeChange,
  compact = false
}: ModeSwitchProps) {
  const modes: Array<{
    key: AutomationMode;
    label: string;
    icon: typeof Zap;
    desc: string;
    badgeColor: string;
  }> = [
    {
      key: "auto",
      label: "Auto",
      icon: Zap,
      desc: "Actions execute instantly without manual approval",
      badgeColor: "bg-emerald-500 text-white"
    },
    {
      key: "assisted",
      label: "Assisted",
      icon: HelpCircle,
      desc: "Drafts prepared automatically; commander confirms dispatch",
      badgeColor: "bg-amber-500 text-white"
    },
    {
      key: "manual",
      label: "Manual",
      icon: Hand,
      desc: "Full manual operator command; all rules require manual trigger",
      badgeColor: "bg-slate-600 text-white"
    }
  ];

  if (compact) {
    return (
      <div className="inline-flex rounded-lg border border-border-subtle bg-surface-base p-0.5 text-xs">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = currentMode === m.key;
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => onModeChange(m.key)}
              title={m.desc}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                isActive
                  ? `${m.badgeColor} shadow-xs`
                  : "text-text-muted hover:text-text-main hover:bg-surface-elevated"
              }`}
            >
              <Icon className="h-3 w-3" />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {modes.map((m) => {
        const Icon = m.icon;
        const isActive = currentMode === m.key;
        return (
          <button
            key={m.key}
            type="button"
            onClick={() => onModeChange(m.key)}
            className={`rounded-xl border p-3.5 text-start transition flex flex-col justify-between gap-2 ${
              isActive
                ? "border-brand-500 bg-brand-500/10 shadow-sm"
                : "border-border-subtle bg-surface-elevated hover:border-brand-500/40"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="flex items-center gap-1.5 text-xs font-bold text-text-main">
                <Icon className={`h-4 w-4 ${isActive ? "text-brand-500" : "text-text-muted"}`} />
                {m.label} Mode
              </span>
              {isActive && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500 text-white font-medium">
                  Active
                </span>
              )}
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed">{m.desc}</p>
          </button>
        );
      })}
    </div>
  );
}
