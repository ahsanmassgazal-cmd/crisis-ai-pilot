import React from "react";
import { useTranslations } from "next-intl";
import { Ltr } from "@/components/common/Ltr";

export interface MatrixRisk {
  id: string;
  title: string;
  likelihood: number; // 1-5
  impact: number;     // 1-5
}

interface RiskMatrix5x5Props {
  risks?: MatrixRisk[];
  onSelectCell?: (likelihood: number, impact: number) => void;
  className?: string;
}

export const RiskMatrix5x5: React.FC<RiskMatrix5x5Props> = ({
  risks = [],
  onSelectCell,
  className = "",
}) => {
  const t = useTranslations("components");
  const getCellColor = (likelihood: number, impact: number) => {
    const score = likelihood * impact;
    if (score >= 16) {
      return "bg-severity-critical-tint text-severity-critical border-severity-critical/40 hover:bg-red-200 dark:hover:bg-red-950";
    }
    if (score >= 10) {
      return "bg-severity-high-tint text-severity-high border-severity-high/40 hover:bg-orange-200 dark:hover:bg-orange-950";
    }
    if (score >= 5) {
      return "bg-severity-medium-tint text-severity-medium border-severity-medium/40 hover:bg-amber-200 dark:hover:bg-amber-950";
    }
    return "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100";
  };

  const getCount = (l: number, i: number) => {
    return risks.filter((r) => r.likelihood === l && r.impact === i).length;
  };

  const likelihoodLabels = ["5 - Almost Certain", "4 - Likely", "3 - Possible", "2 - Unlikely", "1 - Rare"];
  const impactLabels = ["1 - Negligible", "2 - Minor", "3 - Moderate", "4 - Major", "5 - Catastrophic"];

  return (
    <div className={`p-5 rounded-card bg-app-surface border border-app-border space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-app-text">{t("riskMatrixTitle")}</h3>
          <p className="text-xs text-app-muted mt-0.5">{t("riskMatrixSub")}</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-semibold">
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300">{t("riskLow")}</span>
          <span className="px-2 py-0.5 rounded bg-severity-medium-tint text-severity-medium border border-severity-medium">{t("riskMedium")}</span>
          <span className="px-2 py-0.5 rounded bg-severity-high-tint text-severity-high border border-severity-high">{t("riskHigh")}</span>
          <span className="px-2 py-0.5 rounded bg-severity-critical-tint text-severity-critical border border-severity-critical">{t("riskCritical")}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[480px] grid grid-cols-6 gap-1 text-center text-xs">
          {/* Header Corner */}
          <div className="p-2 text-[11px] font-bold text-app-muted flex items-center justify-center">
            L \ I
          </div>
          {impactLabels.map((lbl, idx) => (
            <div key={idx} className="p-2 font-bold text-app-muted text-[10px] truncate" title={lbl}>
              {lbl}
            </div>
          ))}

          {/* 5 Rows for Likelihood (5 down to 1) */}
          {[5, 4, 3, 2, 1].map((l) => (
            <React.Fragment key={l}>
              <div className="p-2 font-bold text-app-muted text-[10px] text-end flex items-center justify-end" title={likelihoodLabels[5 - l]}>
                <span>L{l}</span>
              </div>
              {[1, 2, 3, 4, 5].map((i) => {
                const count = getCount(l, i);
                return (
                  <button
                    key={`${l}-${i}`}
                    onClick={() => onSelectCell?.(l, i)}
                    className={`h-11 rounded border flex flex-col items-center justify-center font-bold text-xs transition-colors shadow-xs ${getCellColor(
                      l,
                      i
                    )}`}
                  >
                    {count > 0 ? (
                      <span className="px-2 py-0.5 rounded-chip bg-app-surface text-app-text font-black text-[11px] shadow-xs">
                        <Ltr>{count}</Ltr>
                      </span>
                    ) : (
                      <span className="text-[10px] opacity-40 font-mono">
                        <Ltr>{l * i}</Ltr>
                      </span>
                    )}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
