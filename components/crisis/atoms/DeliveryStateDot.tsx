import React from "react";
import {
  Clock,
  Send,
  Check,
  CheckCheck,
  RotateCw,
  Shuffle,
  X,
  FlaskConical,
} from "lucide-react";

export type DeliveryState =
  | "queued"
  | "sending"
  | "delivered"
  | "acknowledged"
  | "retrying"
  | "failed_over"
  | "failed"
  | "simulated";

interface DeliveryStateDotProps {
  state: DeliveryState;
  showText?: boolean;
  className?: string;
}

export const DeliveryStateDot: React.FC<DeliveryStateDotProps> = ({
  state,
  showText = true,
  className = "",
}) => {
  const meta: Record<
    DeliveryState,
    { label: string; icon: React.ElementType; colorClass: string; bgClass: string }
  > = {
    queued: { label: "Queued", icon: Clock, colorClass: "text-slate-500", bgClass: "bg-slate-100 dark:bg-slate-800" },
    sending: { label: "Sending", icon: Send, colorClass: "text-indigo-600 animate-pulse", bgClass: "bg-indigo-50 dark:bg-indigo-950/30" },
    delivered: { label: "Delivered", icon: Check, colorClass: "text-teal-600", bgClass: "bg-teal-50 dark:bg-teal-950/30" },
    acknowledged: { label: "Acknowledged Safe", icon: CheckCheck, colorClass: "text-emerald-600", bgClass: "bg-emerald-50 dark:bg-emerald-950/30" },
    retrying: { label: "Retrying", icon: RotateCw, colorClass: "text-amber-500 animate-spin", bgClass: "bg-amber-50 dark:bg-amber-950/30" },
    failed_over: { label: "Failed Over (SMS B)", icon: Shuffle, colorClass: "text-purple-600", bgClass: "bg-purple-50 dark:bg-purple-950/30" },
    failed: { label: "Delivery Failed", icon: X, colorClass: "text-severity-critical", bgClass: "bg-severity-critical-tint" },
    simulated: { label: "Simulated", icon: FlaskConical, colorClass: "text-slate-500", bgClass: "bg-slate-100 dark:bg-slate-800 sandbox-stripes" },
  };

  const current = meta[state] || meta.queued;
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border border-app-border ${current.bgClass} ${current.colorClass} ${className}`}
    >
      <Icon className="w-3 h-3 shrink-0" />
      {showText && <span>{current.label}</span>}
    </span>
  );
};
