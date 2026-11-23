"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Clock,
  ArrowLeft,
  Shield,
  Smartphone,
} from "lucide-react";
import { Ltr } from "@/components/common/Ltr";

export default function ResponderAppPage() {
  const t = useTranslations();
  const [responseStatus, setResponseStatus] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col items-center justify-start p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md space-y-5">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-app-border pb-3">
          <div className="flex items-center gap-2">
            <Link href="/app" className="text-app-muted hover:text-brand-600 transition-colors">
              <ArrowLeft className="w-4 h-4 dir-aware-flip" />
            </Link>
            <div className="flex items-center gap-1.5 font-bold text-sm">
              <Smartphone className="w-4 h-4 text-brand-600" />
              <span>{t("portals.responderApp")}</span>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300 font-bold">
            ON-CALL
          </span>
        </div>

        {/* Current Active Emergency Alert Card */}
        <div className="p-4 rounded-card border-2 border-severity-critical bg-app-surface shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-severity-critical">
              <Bell className="w-4 h-4 animate-bounce shrink-0" />
              <span>CRITICAL ALERT (SEV1)</span>
            </div>
            <span className="text-[11px] font-mono text-app-muted">
              <Clock className="w-3 h-3 inline me-1" />
              <Ltr>20:15</Ltr> GST
            </span>
          </div>

          <h2 className="font-bold text-base text-app-text">
            SCADA Telemetry Disruption — Evacuate Section 4
          </h2>

          <p className="text-xs text-app-muted leading-relaxed">
            All engineering and maintenance personnel in Sohar Desalination Plant Section 4 must report to Assembly Point B immediately.
          </p>

          {/* Big Action Buttons (Fitts's Law) */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => setResponseStatus("safe")}
              className={`w-full py-3.5 px-4 rounded-input font-bold text-sm flex items-center justify-center gap-2 shadow transition-all ${
                responseStatus === "safe"
                  ? "bg-emerald-600 text-white ring-2 ring-emerald-400"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>I&apos;m Safe &amp; Acknowledged</span>
            </button>

            <button
              onClick={() => setResponseStatus("help")}
              className={`w-full py-3.5 px-4 rounded-input font-bold text-sm flex items-center justify-center gap-2 border transition-all ${
                responseStatus === "help"
                  ? "bg-severity-critical text-white"
                  : "border-severity-critical text-severity-critical hover:bg-severity-critical-tint/30"
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
              <span>Need Help / Trapped</span>
            </button>
          </div>

          {responseStatus && (
            <div className="text-center text-xs font-semibold text-emerald-600 pt-1">
              ✓ Status recorded and transmitted to Incident Commander
            </div>
          )}
        </div>

        {/* Assigned Responder Tasks */}
        <div className="rounded-card bg-app-surface border border-app-border p-4 space-y-3">
          <h3 className="font-bold text-xs text-app-text uppercase tracking-wider">
            My Assigned Tasks (1)
          </h3>
          <div className="p-3 rounded-input bg-app-surface-subtle border border-app-border space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-app-text">
              <span>Isolate Feed Pump 3B Manually</span>
              <span className="text-priority-p1 text-[10px]">P1 Due &lt; 15m</span>
            </div>
            <p className="text-[11px] text-app-muted">
              Location: Auxiliary Pump Room B, North Wing.
            </p>
          </div>
        </div>

        {/* GPS Check-in badge */}
        <div className="p-3 rounded-input bg-app-surface-subtle border border-app-border flex items-center justify-between text-xs text-app-muted">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-600" />
            <span>Sohar Plant (24.36°N, 56.74°E)</span>
          </div>
          <span className="text-[11px] font-semibold text-brand-600">Verified</span>
        </div>

        <div className="text-center text-[11px] text-app-muted pt-4">
          <Shield className="w-3.5 h-3.5 inline me-1 text-brand-600" />
          <span>{t("app.name")} Responder Gateway</span>
        </div>
      </div>
    </div>
  );
}
