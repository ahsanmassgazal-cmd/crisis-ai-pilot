"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import {
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Lock,
  Users,
  CheckCircle2,
  Globe,
  Radio,
  Building2,
  FileText,
  Mail,
  ExternalLink,
} from "lucide-react";
import { siteContact } from "@/lib/config/siteContact";

export default function LandingPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col font-sans selection:bg-brand-50 selection:text-brand-600">
      {/* Top Header */}
      <header className="border-b border-app-border bg-app-surface sticky top-0 z-50 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-600 text-white flex items-center justify-center shadow-sm">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-base leading-tight tracking-tight text-app-text">
              {t("app.name")}
            </span>
            <span className="text-xs text-app-muted">
              {t("app.poweredBy")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-app-border bg-app-surface text-app-text text-xs font-medium hover:bg-app-surface-subtle transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-app-muted" />
            <span>{locale === "en" ? "العربية" : "English"}</span>
          </button>

          <Link
            href="/login"
            className="px-3.5 py-1.5 rounded-lg bg-app-surface-subtle border border-app-border text-app-text text-xs font-medium hover:bg-app-border transition-colors"
          >
            {t("landing.signInButton")}
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16 flex flex-col gap-12">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-600/20 bg-brand-50 text-brand-600 text-xs font-semibold">
            <Radio className="w-3.5 h-3.5 animate-pulse text-brand-600" />
            <span>{t("landing.badge")}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-app-text leading-tight sm:leading-tight">
            {t("landing.title")}
          </h1>

          <p className="text-base sm:text-lg text-app-muted leading-relaxed max-w-2xl">
            {t("landing.subtitle")}
          </p>

          <div className="flex items-center gap-2 text-xs text-app-muted mt-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span>{t("landing.systemStatus")}</span>
          </div>
        </div>

        {/* Two-Card Choice Grid (Degree AI Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto w-full">
          {/* Card 1: Explore Demo Workspace */}
          <div className="relative rounded-2xl border-2 border-brand-600/30 bg-app-surface p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  {t("landing.exploreBadge")}
                </span>
                <Sparkles className="w-5 h-5 text-brand-600" />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-app-text">
                  {t("landing.exploreTitle")}
                </h2>
                <p className="text-xs sm:text-sm text-app-muted mt-1 leading-relaxed">
                  {t("landing.exploreDesc")}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-app-border">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-app-text">
                    {t("landing.exploreBullet1")}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-app-text">
                    {t("landing.exploreBullet2")}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-app-text">
                    {t("landing.exploreBullet3")}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/app"
                className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-brand-600 hover:bg-brand-hover text-white text-sm font-semibold shadow-sm transition-colors"
              >
                <span>{t("landing.exploreButton")}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>

          {/* Card 2: Sign In to Workspace */}
          <div className="relative rounded-2xl border border-app-border bg-app-surface p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {t("landing.signInBadge")}
                </span>
                <Lock className="w-5 h-5 text-app-muted" />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-app-text">
                  {t("landing.signInTitle")}
                </h2>
                <p className="text-xs sm:text-sm text-app-muted mt-1 leading-relaxed">
                  {t("landing.signInDesc")}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-app-border">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-app-text">
                    {t("landing.signInBullet1")}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-app-text">
                    {t("landing.signInBullet2")}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-app-text">
                    {t("landing.signInBullet3")}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/login"
                className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl border border-app-border bg-app-surface-subtle hover:bg-app-border text-app-text text-sm font-semibold transition-colors"
              >
                <span>{t("landing.signInButton")}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </div>

        {/* Data Privacy Guarantee Banner */}
        <div className="max-w-4xl mx-auto w-full rounded-xl border border-app-border bg-app-surface p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-app-text">
              {t("landing.privacyTitle")}
            </h3>
            <p className="text-xs text-app-muted leading-relaxed mt-0.5">
              {t("landing.privacyDesc")}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-app-border bg-app-surface py-6 px-4 sm:px-8 text-center text-xs text-app-muted">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>{t("landing.footerNotice")}</span>
          <div className="flex items-center gap-4">
            <a
              href={siteContact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-app-text transition-colors flex items-center gap-1"
            >
              <span>{t("landing.contact")}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <span className="font-mono">{siteContact.email}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
