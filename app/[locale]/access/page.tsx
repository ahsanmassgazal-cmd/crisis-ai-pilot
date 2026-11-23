"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Shield, KeyRound, ArrowRight, AlertCircle, Globe } from "lucide-react";

export default function AccessGatePage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleLocale = () => {
    router.replace(pathname, { locale: locale === "en" ? "ar" : "en" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError(false);

    try {
      const res = await fetch("/api/access-gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      if (res.ok) {
        router.push("/app");
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col items-center justify-center p-4">
      {/* Language Switcher at Top */}
      <div className="absolute top-6 end-6">
        <button
          onClick={toggleLocale}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-input border border-app-border bg-app-surface hover:bg-brand-50 hover:text-brand-600 transition-colors text-xs font-semibold"
        >
          <Globe className="w-3.5 h-3.5 text-brand-600 shrink-0" />
          <span>{locale === "en" ? "عربي" : "English"}</span>
        </button>
      </div>

      <div className="w-full max-w-md bg-app-surface border border-app-border rounded-card p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-card bg-brand-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Shield className="w-6 h-6 fill-current" />
          </div>
          <h1 className="text-xl font-black text-app-text tracking-tight">
            {t("app.wordmark")}
          </h1>
          <p className="text-xs text-app-muted leading-relaxed">
            {t("accessGate.subtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-app-text flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-brand-600" />
              <span>{t("accessGate.title")}</span>
            </label>
            <input
              type="password"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (error) setError(false);
              }}
              placeholder={t("accessGate.placeholder")}
              className={`w-full px-3 py-2.5 rounded-input border bg-app-surface text-sm outline-none transition-colors ${
                error
                  ? "border-severity-critical focus:border-severity-critical"
                  : "border-app-border focus:border-brand-600"
              }`}
              autoFocus
            />
          </div>

          {error && (
            <div className="p-2.5 rounded-input bg-severity-critical-tint text-severity-critical text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{t("accessGate.error")}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="w-full py-2.5 px-4 rounded-input bg-brand-600 hover:bg-brand-hover disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>{loading ? "Verifying..." : t("accessGate.submit")}</span>
            <ArrowRight className="w-3.5 h-3.5 dir-aware-flip" />
          </button>
        </form>

        <div className="pt-4 border-t border-app-border text-center space-y-1">
          <p className="text-[11px] text-app-muted">
            {t("accessGate.hint")}
          </p>
          <p className="text-[10px] text-app-muted/80">
            {t("app.poweredBy")}
          </p>
        </div>
      </div>
    </div>
  );
}
