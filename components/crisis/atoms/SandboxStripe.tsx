import React from "react";
import { FlaskConical } from "lucide-react";

interface SandboxStripeProps {
  label?: string;
  className?: string;
}

export const SandboxStripe: React.FC<SandboxStripeProps> = ({
  label = "Simulated Mode",
  className = "",
}) => {
  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700 sandbox-stripes ${className}`}
    >
      <FlaskConical className="w-3.5 h-3.5 text-slate-500 shrink-0" />
      <span>{label}</span>
    </div>
  );
};
