"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import {
  ShieldAlert,
  Lock,
  ArrowRight,
  Globe,
  AlertCircle,
  Building2,
} from "lucide-react";
import { useAppStore, RoleId } from "@/lib/store/useAppStore";
import { showToast } from "@/lib/toast";

interface RoleCard {
  role: RoleId;
  labelKey: string;
}

const ROLE_CARDS: RoleCard[] = [
  { role: "superAdmin", labelKey: "login.roleOwner" },
  { role: "commander", labelKey: "login.roleManager" },
  { role: "responder", labelKey: "login.roleResponder" },
  { role: "executive", labelKey: "login.roleStakeholder" },
];

interface AccountCredential {
  email: string;
  passwordHash: string; // SHA-256 hex
  role: RoleId;
  labelKey: string;
  dest: string;
}

// Passwords stored purely as SHA-256 hashes — plain text lives solely in ACCESS_CREDENTIALS.txt
const AUTHORIZED_ACCOUNTS: AccountCredential[] = [
  {
    email: "owner@sigmamaxaisolutions.com",
    passwordHash: "84403415052ccf5ba8b006fc68e1c6779d12c64d7e86b8bab32de8c32650af92",
    role: "superAdmin",
    labelKey: "login.roleOwner",
    dest: "/owner",
  },
  {
    email: "manager@sigmamaxaisolutions.com",
    passwordHash: "36e0fb5abb38830d7590bb29b0e41d1c11c93e7300d460332df7608cdadd884c",
    role: "commander",
    labelKey: "login.roleManager",
    dest: "/app",
  },
  {
    email: "responder@sigmamaxaisolutions.com",
    passwordHash: "2709b3f805b9164b7ef47f873d33c6da8322a921faf62f659d0fbd810fd513d1",
    role: "responder",
    labelKey: "login.roleResponder",
    dest: "/r",
  },
  {
    email: "stakeholder@sigmamaxaisolutions.com",
    passwordHash: "79838cf97ccd5438500f2e130c246ae02583e6d3d11e9e41739889f1e32c846d",
    role: "executive",
    labelKey: "login.roleStakeholder",
    dest: "/portal",
  },
];

async function sha256(str: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function WorkspaceLoginPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { setRole } = useAppStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const enteredHash = await sha256(password);
      const match = AUTHORIZED_ACCOUNTS.find(
        (a) =>
          a.email.toLowerCase() === email.trim().toLowerCase() &&
          a.passwordHash === enteredHash
      );

      if (match) {
        setRole(match.role);
        showToast({
          title: t("login.authenticatedAs"),
          description: t(match.labelKey as any),
          tone: "emerald",
        });
        setTimeout(() => {
          router.push(match.dest);
        }, 300);
      } else {
        setLoading(false);
        setError(true);
      }
    } catch {
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-app-border bg-app-surface px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-600 text-white flex items-center justify-center shadow-sm">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-base leading-tight tracking-tight text-app-text">
            {t("app.name")}
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-2 min-h-[44px] min-w-[44px] justify-center rounded-lg border border-app-border bg-app-surface text-app-text text-xs font-medium hover:bg-app-surface-subtle transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-app-muted" />
            <span>{locale === "en" ? "العربية" : "English"}</span>
          </button>

          <Link
            href="/app"
            className="text-xs text-brand-600 hover:text-brand-hover font-medium flex items-center gap-1 px-3 py-2 min-h-[44px] min-w-[44px] justify-center"
          >
            <span>{t("login.backToDemo")}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </Link>
        </div>
      </header>

      {/* Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full rounded-2xl border border-app-border bg-app-surface p-6 sm:p-8 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col gap-1 text-center items-center">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-2">
              <Lock className="w-6 h-6 text-brand-600" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-app-text">
              {t("login.title")}
            </h1>
            <p className="text-xs sm:text-sm text-app-muted">
              {t("login.subtitle")}
            </p>
          </div>

          {/* Role Informational Scope (No Auto-Fill) */}
          <div className="flex flex-col gap-2 pt-2 border-t border-app-border">
            <span className="text-xs font-semibold text-app-muted">
              {t("login.quickRoleTitle")}
            </span>
            <div className="grid grid-cols-2 gap-2">
              {ROLE_CARDS.map((preset) => (
                <div
                  key={preset.role}
                  className="p-3 min-h-[44px] rounded-lg border border-app-border bg-app-surface-subtle text-app-text text-xs flex items-center justify-between"
                >
                  <span className="font-medium truncate">{t(preset.labelKey as any)}</span>
                  <span className="text-[10px] text-app-muted uppercase font-mono">{preset.role.slice(0, 3)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center gap-2 text-rose-700 dark:text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{t("login.invalidCredentials")}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-app-text">
                {t("login.emailLabel")}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("login.emailPlaceholder")}
                className="w-full px-3.5 py-2.5 min-h-[44px] rounded-lg border border-app-border bg-app-surface text-app-text text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-app-text">
                {t("login.passwordLabel")}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("login.passwordPlaceholder")}
                className="w-full px-3.5 py-2.5 min-h-[44px] rounded-lg border border-app-border bg-app-surface text-app-text text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 min-h-[44px] rounded-xl bg-brand-600 hover:bg-brand-hover text-white text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>{t("login.submit")}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </form>

          {/* Notice */}
          <div className="pt-3 border-t border-app-border text-center text-xs text-app-muted">
            <p>{t("login.privacyNote")}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
