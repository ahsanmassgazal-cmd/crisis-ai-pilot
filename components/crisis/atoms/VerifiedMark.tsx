import React from "react";
import { useTranslations } from "next-intl";
import { ShieldCheck, ShieldAlert } from "lucide-react";

interface VerifiedMarkProps {
  verified?: boolean;
  className?: string;
}

export const VerifiedMark: React.FC<VerifiedMarkProps> = ({
  verified = false,
  className = "",
}) => {
  const t = useTranslations("components");
  if (verified) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 ${className}`}
      >
        <ShieldCheck className="w-3 h-3 text-emerald-600" />
        <span>{t("verified")}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700 ${className}`}
    >
      <ShieldAlert className="w-3 h-3 text-slate-400" />
      <span>{t("sampleToBeVerified")}</span>
    </span>
  );
};
