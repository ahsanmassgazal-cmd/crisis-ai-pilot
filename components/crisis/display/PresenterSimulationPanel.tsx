"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  Presentation,
  X,
  FastForward,
  Play,
  RotateCcw,
  Zap,
  UserX,
  Radio,
  Fingerprint,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { Ltr } from "@/components/layout/Ltr";
import { useAppStore } from "@/lib/store/useAppStore";
import { showToast } from "@/lib/toast";

export const PresenterSimulationPanel: React.FC = () => {
  const t = useTranslations();
  const {
    currentRole,
    presenterPanelOpen,
    setPresenterPanelOpen,
    togglePresenterPanel,
    simSpeed,
    setSimSpeed,
  } = useAppStore();

  const speeds: Array<1 | 5 | 60 | 300> = [1, 5, 60, 300];

  const handleInject = (scenarioName: string, description: string) => {
    showToast({
      title: scenarioName,
      description,
      tone: "amber",
    });
  };

  const handleReset = () => {
    showToast({
      title: t("presenterPanel.resetBaseline"),
      description: "Sandbox seed state successfully restored to baseline.",
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

            {/* Section 2: Failure Injections */}
            <div className="space-y-2 pt-2 border-t border-app-border">
              <span className="text-xs font-bold text-app-text uppercase tracking-wider block">
                {t("presenterPanel.injectScenarios")}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() =>
                    handleInject(
                      t("presenterPanel.injectScada"),
                      "Section 4 RO differential pressure dropped -14.2 bar below SLA."
                    )
                  }
                  className="p-2.5 rounded-input border border-app-border bg-app-surface-subtle hover:bg-app-border/40 text-start flex items-center gap-2 font-medium text-app-text"
                >
                  <Radio className="w-4 h-4 text-status-critical shrink-0" />
                  <span className="truncate">{t("presenterPanel.injectScada")}</span>
                </button>

                <button
                  onClick={() =>
                    handleInject(
                      t("presenterPanel.injectResponderOffline"),
                      "Primary on-call lead unresponsive for 8 mins; automatic escalation to secondary lead triggered."
                    )
                  }
                  className="p-2.5 rounded-input border border-app-border bg-app-surface-subtle hover:bg-app-border/40 text-start flex items-center gap-2 font-medium text-app-text"
                >
                  <UserX className="w-4 h-4 text-status-degraded shrink-0" />
                  <span className="truncate">{t("presenterPanel.injectResponderOffline")}</span>
                </button>

                <button
                  onClick={() =>
                    handleInject(
                      t("presenterPanel.injectSmsLatency"),
                      "OmanTel SMPP queue backpressure simulated; SMS latency increased to 90s."
                    )
                  }
                  className="p-2.5 rounded-input border border-app-border bg-app-surface-subtle hover:bg-app-border/40 text-start flex items-center gap-2 font-medium text-app-text"
                >
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="truncate">{t("presenterPanel.injectSmsLatency")}</span>
                </button>

                <button
                  onClick={() =>
                    handleInject(
                      t("presenterPanel.injectTamper"),
                      "Bit-flip injected into Block 1247. Cryptographic chain integrity will detect hash mismatch."
                    )
                  }
                  className="p-2.5 rounded-input border border-app-border bg-app-surface-subtle hover:bg-app-border/40 text-start flex items-center gap-2 font-medium text-app-text"
                >
                  <Fingerprint className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="truncate">{t("presenterPanel.injectTamper")}</span>
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
