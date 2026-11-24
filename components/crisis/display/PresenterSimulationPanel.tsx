"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Presentation,
  X,
  FastForward,
  RotateCcw,
  Zap,
  UserX,
  Radio,
  Fingerprint,
  Mail,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Ltr } from "@/components/layout/Ltr";
import { useAppStore } from "@/lib/store/useAppStore";
import { useRepo } from "@/lib/repo";
import { showToast } from "@/lib/toast";
import { automationRunner } from "@/lib/engine/automations";

export const PresenterSimulationPanel: React.FC = () => {
  const t = useTranslations();
  const repo = useRepo();
  const {
    currentRole,
    presenterPanelOpen,
    setPresenterPanelOpen,
    togglePresenterPanel,
    simSpeed,
    setSimSpeed,
    failures,
    toggleFailure,
    resetFailures,
  } = useAppStore();

  const speeds: Array<1 | 5 | 60 | 300> = [1, 5, 60, 300];

  const handleToggleSms = () => {
    toggleFailure("smsABroken");
    const newState = !failures.smsABroken;
    showToast({
      title: newState ? "SMS A Primary Broken" : "SMS A Restored",
      description: newState
        ? "SMS Route A SMPP gateway error simulated. Next SMS will fail over to SMS Route B."
        : "Primary SMS route restored to healthy.",
      tone: newState ? "rose" : "emerald",
    });
  };

  const handleToggleEmail = () => {
    toggleFailure("emailDelayed");
    const newState = !failures.emailDelayed;
    showToast({
      title: newState ? "Email 2m Delay Injected" : "Email Normal Latency",
      description: newState ? "SMTP outbound relay delayed by 120s." : "SMTP outbound latency restored to normal.",
      tone: newState ? "amber" : "emerald",
    });
  };

  const handleToggleTeams = () => {
    toggleFailure("teamsError");
    const newState = !failures.teamsError;
    showToast({
      title: newState ? "Teams Webhook Error Injected" : "Teams Webhook Restored",
      description: newState ? "Microsoft Graph returns 429 RateLimitExceeded." : "Teams notifications restored.",
      tone: newState ? "rose" : "emerald",
    });
  };

  const handleToggleResponder = () => {
    toggleFailure("responderUnresponsive");
    const newState = !failures.responderUnresponsive;
    showToast({
      title: newState ? "Responder Unresponsive (20%)" : "Responders Responsive",
      description: newState
        ? "On-call lead silent past 5m SLA. Escalation ladder advancing to Tier 2."
        : "Responders answering normally.",
      tone: newState ? "amber" : "emerald",
    });
  };

  const handleToggleScada = async () => {
    toggleFailure("scadaSpike");
    const newState = !failures.scadaSpike;
    if (newState) {
      // Trigger automation evaluation
      await automationRunner.runRules(repo, { scadaMetric: 34.2 });
    }
    showToast({
      title: newState ? "SCADA Telemetry Spike Injected" : "SCADA Telemetry Normal",
      description: newState
        ? "RO differential pressure dropped below 49.0 bar. Attention queue suggested incident created."
        : "SCADA telemetry back within normal operating parameters.",
      tone: newState ? "rose" : "emerald",
    });
  };

  const handleToggleTamper = async () => {
    toggleFailure("auditBitFlipped");
    const newState = !failures.auditBitFlipped;
    if (newState) {
      await repo.audit.tamperBlock(1247);
    }
    showToast({
      title: newState ? "Bit-Flip Tampering Injected" : "Audit Chain Healthy",
      description: newState
        ? "Cryptographic mutation injected into block 1247. Chain verification will flag mismatch."
        : "Tampering cleared.",
      tone: newState ? "rose" : "emerald",
    });
  };

  const handleReset = async () => {
    resetFailures();
    await repo.resetToSeed();
    showToast({
      title: t("presenterPanel.resetBaseline"),
      description: "Sandbox seed state successfully restored to baseline in IndexedDB.",
      tone: "brand",
    });
  };

  return (
    <>
      {/* Floating launcher button for Presenter Persona */}
      {currentRole === "presenter" && (
        <button
          onClick={togglePresenterPanel}
          className="fixed bottom-6 start-6 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl text-xs font-bold transition-all border border-indigo-400"
          aria-label={t("presenterPanel.title")}
        >
          <Presentation className="w-4 h-4 animate-pulse" />
          <span>{t("presenterPanel.title")}</span>
          <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">
            <Ltr>{simSpeed}x</Ltr>
          </span>
        </button>
      )}

      {/* Drawer Overlay */}
      {presenterPanelOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("presenterPanel.title")}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            className="w-full max-w-lg bg-app-surface border border-app-border rounded-card shadow-2xl overflow-hidden flex flex-col space-y-4 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-app-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-input bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center font-bold">
                  <Presentation className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-app-text">{t("presenterPanel.title")}</h3>
                  <p className="text-[11px] text-app-muted">{t("presenterPanel.subtitle")}</p>
                </div>
              </div>
              <button
                onClick={() => setPresenterPanelOpen(false)}
                className="p-1 rounded hover:bg-app-surface-subtle text-app-muted hover:text-app-text"
                aria-label={t("presenterPanel.close")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Section 1: Clock Acceleration */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-app-text uppercase tracking-wider block">
                {t("presenterPanel.clockSpeed")}
              </span>
              <div className="grid grid-cols-4 gap-2">
                {speeds.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSimSpeed(s);
                      showToast({
                        title: t("presenterPanel.clockSpeed"),
                        description: `Simulation clock accelerated to ${s}x rate.`,
                        tone: "brand",
                      });
                    }}
                    className={`py-2 px-3 rounded-input text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                      simSpeed === s
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-app-surface-subtle border-app-border text-app-muted hover:text-app-text"
                    }`}
                  >
                    <FastForward className="w-3.5 h-3.5" />
                    <span><Ltr>{s}x</Ltr></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 2: Failure Injections (6 Controls per Spec) */}
            <div className="space-y-2 pt-2 border-t border-app-border">
              <span className="text-xs font-bold text-app-text uppercase tracking-wider block">
                {t("presenterPanel.injectScenarios")}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* 1: Break SMS A */}
                <button
                  onClick={handleToggleSms}
                  className={`p-2.5 rounded-input border text-start flex items-center justify-between font-medium transition ${
                    failures.smsABroken
                      ? "bg-rose-500/10 border-rose-500 text-rose-500 font-bold"
                      : "bg-app-surface-subtle border-app-border text-app-text hover:bg-app-border/40"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Zap className="w-4 h-4 shrink-0 text-rose-500" />
                    <span className="truncate">{t("presenterPanel.breakSmsA")}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase">{failures.smsABroken ? "Active" : "Off"}</span>
                </button>

                {/* 2: Delay Email 2m */}
                <button
                  onClick={handleToggleEmail}
                  className={`p-2.5 rounded-input border text-start flex items-center justify-between font-medium transition ${
                    failures.emailDelayed
                      ? "bg-amber-500/10 border-amber-500 text-amber-500 font-bold"
                      : "bg-app-surface-subtle border-app-border text-app-text hover:bg-app-border/40"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-4 h-4 shrink-0 text-amber-500" />
                    <span className="truncate">{t("presenterPanel.delayEmail")}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase">{failures.emailDelayed ? "Active" : "Off"}</span>
                </button>

                {/* 3: Teams Error */}
                <button
                  onClick={handleToggleTeams}
                  className={`p-2.5 rounded-input border text-start flex items-center justify-between font-medium transition ${
                    failures.teamsError
                      ? "bg-rose-500/10 border-rose-500 text-rose-500 font-bold"
                      : "bg-app-surface-subtle border-app-border text-app-text hover:bg-app-border/40"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare className="w-4 h-4 shrink-0 text-rose-500" />
                    <span className="truncate">{t("presenterPanel.teamsError")}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase">{failures.teamsError ? "Active" : "Off"}</span>
                </button>

                {/* 4: Responder Unresponsive */}
                <button
                  onClick={handleToggleResponder}
                  className={`p-2.5 rounded-input border text-start flex items-center justify-between font-medium transition ${
                    failures.responderUnresponsive
                      ? "bg-amber-500/10 border-amber-500 text-amber-500 font-bold"
                      : "bg-app-surface-subtle border-app-border text-app-text hover:bg-app-border/40"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <UserX className="w-4 h-4 shrink-0 text-amber-500" />
                    <span className="truncate">{t("presenterPanel.responderSilent")}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase">{failures.responderUnresponsive ? "Active" : "Off"}</span>
                </button>

                {/* 5: SCADA Spike */}
                <button
                  onClick={handleToggleScada}
                  className={`p-2.5 rounded-input border text-start flex items-center justify-between font-medium transition ${
                    failures.scadaSpike
                      ? "bg-rose-500/10 border-rose-500 text-rose-500 font-bold"
                      : "bg-app-surface-subtle border-app-border text-app-text hover:bg-app-border/40"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Radio className="w-4 h-4 shrink-0 text-rose-500" />
                    <span className="truncate">{t("presenterPanel.scadaSpike")}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase">{failures.scadaSpike ? "Active" : "Off"}</span>
                </button>

                {/* 6: Bit-flip Tamper */}
                <button
                  onClick={handleToggleTamper}
                  className={`p-2.5 rounded-input border text-start flex items-center justify-between font-medium transition ${
                    failures.auditBitFlipped
                      ? "bg-rose-500/10 border-rose-500 text-rose-500 font-bold"
                      : "bg-app-surface-subtle border-app-border text-app-text hover:bg-app-border/40"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Fingerprint className="w-4 h-4 shrink-0 text-rose-500" />
                    <span className="truncate">{t("presenterPanel.bitFlipTamper")}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase">{failures.auditBitFlipped ? "Active" : "Off"}</span>
                </button>
              </div>
            </div>

            {/* Section 3: Reset Sandbox */}
            <div className="pt-2 border-t border-app-border">
              <button
                onClick={handleReset}
                className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-input font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t("presenterPanel.resetBaseline")}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
