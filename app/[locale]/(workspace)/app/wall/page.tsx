"use client";

import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Tv,
  ArrowLeft,
  ArrowRight,
  Radio,
  Siren,
  Clock,
  Shield,
  Activity,
  Layers,
  MapPin,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Ltr } from "@/components/layout/Ltr";
import { StatusBadge } from "@/components/crisis/atoms/StatusBadge";
import { SlaRing } from "@/components/crisis/display/SlaRing";

export default function WallModePage() {
  const t = useTranslations();
  const locale = useLocale();

  const [activeBoard, setActiveBoard] = useState<"incidents" | "sites">("incidents");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-GB", { timeZone: "Asia/Muscat" }) + " GST");
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // 30s auto rotation
  useEffect(() => {
    const rot = setInterval(() => {
      setActiveBoard((prev) => (prev === "incidents" ? "sites" : "incidents"));
    }, 30000);
    return () => clearInterval(rot);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col justify-between select-none">
      {/* Top Operational Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-input bg-brand-600 flex items-center justify-center font-black">
            <Tv className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight">{t("wallModeCenter.title")}</h1>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-mono font-bold animate-pulse">
                LIVE OPS
              </span>
            </div>
            <p className="text-xs text-slate-400">{t("wallModeCenter.fullscreenNotice")}</p>
          </div>
        </div>

        {/* Clock & Controls */}
        <div className="flex items-center gap-4">
          <div className="font-mono text-sm font-bold bg-slate-900 border border-slate-800 px-3 py-1.5 rounded text-emerald-400">
            <Ltr>{currentTime || "10:55:00 GST"}</Ltr>
          </div>

          <Link
            href="/app"
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold rounded-input text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 dir-aware-flip" />
            <span>{t("wallModeCenter.exitWallMode")}</span>
          </Link>
        </div>
      </div>

      {/* Main Board Container */}
      <div className="flex-1 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Key Operational KPIs */}
        <div className="space-y-4">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-card space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {t("wallModeCenter.activeIncidentsTile")}
            </span>
            <div className="text-4xl font-black text-rose-500"><Ltr>1</Ltr></div>
            <span className="text-xs text-rose-400 font-semibold block">
              INC-2026-001 • Critical P1
            </span>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-card space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {t("wallModeCenter.nationalReadinessTile")}
            </span>
            <div className="text-4xl font-black text-brand-400"><Ltr>94%</Ltr></div>
            <span className="text-xs text-slate-400 block">
              {t("wallModeCenter.telemetryNodesOnline")}
            </span>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-card space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {t("wallModeCenter.activeRespondersTile")}
            </span>
            <div className="text-4xl font-black text-emerald-400"><Ltr>42</Ltr></div>
            <span className="text-xs text-emerald-400/80 block">
              {t("wallModeCenter.ackSlaMet")}
            </span>
          </div>
        </div>

        {/* Center / Right Column: Live Incident Flash Board */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 bg-slate-900/90 border border-rose-900/60 rounded-card space-y-4 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Siren className="w-5 h-5 text-rose-500 animate-bounce" />
                <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">
                  <Ltr>INC-2026-001</Ltr>
                </span>
                <span className="text-xs font-bold uppercase text-slate-300">{t("wallModeCenter.activeSev1Notice")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono text-amber-400">{t("wallModeCenter.slaRemainingNotice", { time: "38m" })}</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-black text-white">
                {locale === "ar"
                  ? "خلل في شبكة التحكم الإشرافي وتوقف إشارات محطة صحار"
                  : "Industrial SCADA Telemetry Network Disruption (Sohar Plant)"}
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Simultaneous loss of pressure feedback loop across Section 4 RO trains. Dual-commander containment protocol active. Auxiliary power isolated.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">{t("wallModeCenter.incidentLead")}</span>
                <span className="font-bold text-white mt-1 block">{locale === "ar" ? "م. سالم الحارثي" : "Eng. Salim Al-Harthy"}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">{t("wallModeCenter.assignedPlaybook")}</span>
                <span className="font-bold text-brand-400 mt-1 block font-mono">CP-DESAL-04</span>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">{t("wallModeCenter.failoverTarget")}</span>
                <span className="font-bold text-emerald-400 mt-1 block">{t("wallModeCenter.nizwaHubName")}</span>
              </div>
            </div>
          </div>

          {/* Infrastructure Health Status Strip */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-card flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-slate-200">{t("tenants.gulf_water")}:</span>
              <span className="text-emerald-400">{t("wallModeCenter.normalCapacityNotice")}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-slate-200">{locale === "ar" ? "محطة صحار:" : "Sohar Plant:"}</span>
              <span className="text-amber-400">{t("wallModeCenter.auxBackupEngaged")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Strip */}
      <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-brand-500" />
          <span>{t("wallModeCenter.wallFooter")}</span>
        </div>
        <div>
          <span>{t("wallModeCenter.autoRotateToggle")}</span>
        </div>
      </div>
    </div>
  );
}
