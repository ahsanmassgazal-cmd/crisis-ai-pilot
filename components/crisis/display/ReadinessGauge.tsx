import React from "react";
import { ProgressRing } from "./ProgressRing";
import { ShieldCheck, BookCheck, Flame, Users, FileText } from "lucide-react";
import { Ltr } from "@/components/common/Ltr";

interface ReadinessGaugeProps {
  score?: number;
  plansUpToDate?: number;
  drillsCompleted?: number;
  contactsVerified?: number;
  documentsExpiring?: number;
  className?: string;
}

export const ReadinessGauge: React.FC<ReadinessGaugeProps> = ({
  score = 78,
  plansUpToDate = 88,
  drillsCompleted = 75,
  contactsVerified = 94,
  documentsExpiring = 3,
  className = "",
}) => {
  return (
    <div className={`p-5 rounded-card bg-app-surface border border-app-border space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-app-text flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>Organizational Readiness</span>
          </h3>
          <p className="text-xs text-app-muted mt-0.5">
            Preparedness composite score based on drills, plans, contacts &amp; policies.
          </p>
        </div>
        <ProgressRing value={score} size={64} colorClass="text-brand-600" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-app-border text-xs">
        <div className="p-2.5 rounded-input bg-app-surface-subtle space-y-1">
          <div className="flex items-center gap-1.5 text-app-muted text-[11px]">
            <BookCheck className="w-3.5 h-3.5 text-brand-600" />
            <span>Plans Valid</span>
          </div>
          <div className="font-bold text-app-text"><Ltr>{plansUpToDate}%</Ltr></div>
        </div>

        <div className="p-2.5 rounded-input bg-app-surface-subtle space-y-1">
          <div className="flex items-center gap-1.5 text-app-muted text-[11px]">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Drills Done</span>
          </div>
          <div className="font-bold text-app-text"><Ltr>{drillsCompleted}%</Ltr></div>
        </div>

        <div className="p-2.5 rounded-input bg-app-surface-subtle space-y-1">
          <div className="flex items-center gap-1.5 text-app-muted text-[11px]">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Contacts OK</span>
          </div>
          <div className="font-bold text-app-text"><Ltr>{contactsVerified}%</Ltr></div>
        </div>

        <div className="p-2.5 rounded-input bg-app-surface-subtle space-y-1">
          <div className="flex items-center gap-1.5 text-app-muted text-[11px]">
            <FileText className="w-3.5 h-3.5 text-amber-500" />
            <span>Expiring</span>
          </div>
          <div className="font-bold text-amber-600"><Ltr>{documentsExpiring}</Ltr> docs</div>
        </div>
      </div>
    </div>
  );
};
