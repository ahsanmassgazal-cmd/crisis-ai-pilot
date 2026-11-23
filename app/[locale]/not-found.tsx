"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ShieldAlert, ArrowRight, LayoutDashboard } from "lucide-react";

export default function LocalizedNotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="min-h-screen w-full bg-app-bg text-app-text flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md bg-app-surface border border-app-border rounded-card p-8 shadow-xl space-y-6">
        <div className="w-14 h-14 rounded-card bg-brand-50 text-brand-600 dark:bg-brand-50/20 flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-black text-app-text tracking-tight">
            {t("title")}
          </h1>
          <p className="text-xs text-app-muted leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/app"
            className="w-full py-3 px-4 rounded-input bg-brand-600 hover:bg-brand-hover text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>{t("goToCommand")}</span>
            <ArrowRight className="w-3.5 h-3.5 dir-aware-flip shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}
