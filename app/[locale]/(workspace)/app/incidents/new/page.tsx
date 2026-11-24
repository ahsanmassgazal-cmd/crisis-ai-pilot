"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Ltr } from "@/components/common/Ltr";
import { mockRepository } from "@/lib/repo";
import { SeverityBadge } from "@/components/crisis/atoms/SeverityBadge";
import { PriorityChip } from "@/components/crisis/atoms/PriorityChip";
import { CategoryTag } from "@/components/crisis/atoms/CategoryTag";
import {
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Users,
  Send,
  Building2,
  FileText,
  AlertTriangle,
  Flame,
  Check
} from "lucide-react";

export default function ActivateIncidentPage() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [scenarioPreset, setScenarioPreset] = useState("cyber");
  const [title, setTitle] = useState("SCADA Network Telemetry Outlier (Sohar)");
  const [site, setSite] = useState("Sohar Desalination Plant");
  const [category, setCategory] = useState("cyber");
  const [severity, setSeverity] = useState<"critical" | "high" | "medium" | "low">("critical");

  // Severity evaluation answers
  const [safetyImpact, setSafetyImpact] = useState("medium");
  const [operationalImpact, setOperationalImpact] = useState("high");
  const [regulatoryImpact, setRegulatoryImpact] = useState("high");

  // Matched plan & audiences
  const [selectedPlan, setSelectedPlan] = useState("CP-DESAL-04: SCADA Telemetry Containment Protocol");
  const [selectedAudiences, setSelectedAudiences] = useState([
    "Primary SCADA On-Call Team",
    "Regional Operations Director",
    "Executive Crisis Committee"
  ]);

  const [isActivating, setIsActivating] = useState(false);

  const handleActivate = () => {
    setIsActivating(true);
    setTimeout(() => {
      router.push(`/${locale}/app/incidents/inc-1`);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-border-subtle pb-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-critical-500 animate-pulse" />
          <h1 className="text-xl font-bold tracking-tight text-text-main">
            Activate New Crisis Incident
          </h1>
        </div>
        <p className="text-xs text-text-muted mt-1">
          4-step incident activation procedure with AI-assisted playbook matching and automated responder dispatch.
        </p>
      </div>

      {/* Stepper Wizard Progress */}
      <div className="grid grid-cols-4 gap-2 text-xs">
        {[
          { num: 1, label: "Scenario & Site" },
          { num: 2, label: "Severity Assessment" },
          { num: 3, label: "Plan & Audiences" },
          { num: 4, label: "Review & Activate" }
        ].map((s) => (
          <div
            key={s.num}
            className={`rounded-xl border p-2.5 text-center transition ${
              step === s.num
                ? "border-brand-500 bg-brand-500/10 text-brand-400 font-bold"
                : step > s.num
                ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400 font-semibold"
                : "border-border-subtle bg-surface-base text-text-muted"
            }`}
          >
            <span className="block text-[10px] uppercase font-mono">
              Step <Ltr>{s.num}</Ltr>
            </span>
            <span className="truncate block text-xs">{s.label}</span>
          </div>
        ))}
      </div>

      {/* STEP 1: SCENARIO & SITE */}
      {step === 1 && (
        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-6 space-y-5 text-xs animate-fade-in">
          <div>
            <h3 className="text-sm font-bold text-text-main">{t("activate.step1Head")}</h3>
            <p className="text-[11px] text-text-muted mt-0.5">
              Select an incident template or enter custom incident parameters.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-1.5">
            <label className="font-semibold text-text-main block">{t("activate.quickTemplates")}</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "cyber", title: "SCADA Cyber Anomaly", cat: "cyber" },
                { id: "power", title: "Grid Substation Outage", cat: "power" },
                { id: "weather", title: "Flash Flood Warning", cat: "weather" },
                { id: "spill", title: "Chlorine / Chemical Spill", cat: "environmental" }
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setScenarioPreset(p.id);
                    setTitle(p.title);
                    setCategory(p.cat);
                  }}
                  className={`p-2.5 rounded-lg border text-start transition ${
                    scenarioPreset === p.id
                      ? "border-brand-500 bg-brand-500/10 text-brand-400 font-bold"
                      : "border-border-subtle bg-surface-base text-text-muted hover:text-text-main"
                  }`}
                >
                  <span className="block font-semibold">{p.title}</span>
                  <span className="text-[10px] uppercase text-text-muted font-mono">{p.cat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="font-semibold text-text-main block">{t("activate.incidentTitle")}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-xs text-text-main focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-text-main block">{t("activate.affectedSite")}</label>
                <select
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  className="w-full rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-xs text-text-main focus:ring-1 focus:ring-brand-500"
                >
                  <option value="Sohar Desalination Plant">{t("activate.soharPlant")}</option>
                  <option value="Muscat Central Pumping Station">{t("activate.muscatStation")}</option>
                  <option value="Salalah Power & Distribution">{t("activate.salalahPower")}</option>
                  <option value="Nizwa Regional Operations Hub">{t("activate.nizwaHub")}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-text-main block">{t("activate.categoryLabel")}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-xs text-text-main focus:ring-1 focus:ring-brand-500"
                >
                  <option value="cyber">{t("activate.cyberAnomaly")}</option>
                  <option value="power">{t("activate.powerFailure")}</option>
                  <option value="weather">{t("activate.extremeWeather")}</option>
                  <option value="environmental">{t("activate.chemicalSpill")}</option>
                  <option value="health">{t("activate.healthSafety")}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-border-subtle">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-600 transition"
            >
              <span>{t("activate.continueSeverity")}</span>
              <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SEVERITY ASSESSMENT */}
      {step === 2 && (
        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-6 space-y-5 text-xs animate-fade-in">
          <div>
            <h3 className="text-sm font-bold text-text-main">{t("activate.step2Head")}</h3>
            <p className="text-[11px] text-text-muted mt-0.5">
              Answer the standard ISO 22301 triage matrix questions to determine incident classification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-border-subtle bg-surface-base p-3 space-y-2">
              <label className="font-semibold text-text-main block">{t("activate.humanSafety")}</label>
              <select
                value={safetyImpact}
                onChange={(e) => setSafetyImpact(e.target.value)}
                className="w-full rounded border border-border-subtle bg-surface-elevated p-1.5 text-xs text-text-main"
              >
                <option value="critical">{t("activate.threatToLife")}</option>
                <option value="high">{t("activate.injuryRisk")}</option>
                <option value="medium">{t("activate.containedHazard")}</option>
                <option value="low">{t("activate.zeroInjury")}</option>
              </select>
            </div>

            <div className="rounded-lg border border-border-subtle bg-surface-base p-3 space-y-2">
              <label className="font-semibold text-text-main block">{t("activate.operationalDisruption")}</label>
              <select
                value={operationalImpact}
                onChange={(e) => setOperationalImpact(e.target.value)}
                className="w-full rounded border border-border-subtle bg-surface-elevated p-1.5 text-xs text-text-main"
              >
                <option value="critical">{t("activate.over50Offline")}</option>
                <option value="high">{t("activate.over25Throttled")}</option>
                <option value="medium">{t("activate.under25Redundant")}</option>
                <option value="low">{t("activate.minimalDeviation")}</option>
              </select>
            </div>

            <div className="rounded-lg border border-border-subtle bg-surface-base p-3 space-y-2">
              <label className="font-semibold text-text-main block">{t("activate.regulatoryPublicImpact")}</label>
              <select
                value={regulatoryImpact}
                onChange={(e) => setRegulatoryImpact(e.target.value)}
                className="w-full rounded border border-border-subtle bg-surface-elevated p-1.5 text-xs text-text-main"
              >
                <option value="critical">{t("activate.nationalDisclosure")}</option>
                <option value="high">{t("activate.regulatorNotice")}</option>
                <option value="medium">{t("activate.complianceReport")}</option>
                <option value="low">{t("activate.standardLog")}</option>
              </select>
            </div>
          </div>

          {/* AI Recommended Severity Banner */}
          <div className="rounded-xl border border-critical-500/30 bg-critical-500/10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-critical-500 p-2 text-white">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-text-main">{t("activate.calculatedSeverity")}</span>
                  <SeverityBadge severity="critical" />
                </div>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Initial SLA: 15 minutes • Requires mandatory Level 2 escalation within 30 minutes.
                </p>
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-critical-500/20 text-critical-300 border border-critical-500/30">
              P1 ACT NOW
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1 rounded-lg border border-border-subtle bg-surface-base px-3 py-1.5 text-text-muted hover:text-text-main"
            >
              <ArrowLeft className="h-3.5 w-3.5 rtl-flip" />
              <span>{t("common.back")}</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-600 transition"
            >
              <span>{t("activate.continuePlan")}</span>
              <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PLAN & AUDIENCES */}
      {step === 3 && (
        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-6 space-y-5 text-xs animate-fade-in">
          <div>
            <h3 className="text-sm font-bold text-text-main">{t("activate.step3Head")}</h3>
            <p className="text-[11px] text-text-muted mt-0.5">
              The platform matched the optimal operational playbook based on site tier and incident category.
            </p>
          </div>

          {/* Matched Playbook */}
          <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" /> Auto-Matched Playbook (98% Confidence)
              </span>
              <span className="text-[10px] text-text-muted">{t("activate.versionLabel")}</span>
            </div>
            <h4 className="font-bold text-text-main text-sm">{selectedPlan}</h4>
            <p className="text-[11px] text-text-muted">
              Includes pre-configured tasks: Telemetry isolation, secondary reservoir activation, and regulatory draft.
            </p>
          </div>

          {/* Targeted Audiences */}
          <div className="space-y-2">
            <label className="font-semibold text-text-main block">{t("activate.selectedGroups")}</label>
            <div className="space-y-2">
              {[
                { name: "Primary SCADA On-Call Team", count: 14, channels: "SMS + Teams" },
                { name: "Regional Operations Director", count: 1, channels: "Voice + SMS" },
                { name: "Executive Crisis Committee", count: 6, channels: "Teams + Email" },
                { name: "Water Quality Lab Specialists", count: 4, channels: "SMS" }
              ].map((grp) => {
                const isSelected = selectedAudiences.includes(grp.name);
                return (
                  <div
                    key={grp.name}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedAudiences(selectedAudiences.filter((x) => x !== grp.name));
                      } else {
                        setSelectedAudiences([...selectedAudiences, grp.name]);
                      }
                    }}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                      isSelected
                        ? "border-brand-500 bg-surface-base"
                        : "border-border-subtle bg-surface-base/60 text-text-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`h-4 w-4 rounded flex items-center justify-center border ${
                          isSelected
                            ? "bg-brand-500 border-brand-500 text-white"
                            : "border-border-subtle"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      <div>
                        <span className="font-semibold text-text-main">{grp.name}</span>
                        <span className="text-[10px] text-text-muted block">Channels: {grp.channels}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-text-muted">
                      <Ltr>{grp.count}</Ltr> recipients
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1 rounded-lg border border-border-subtle bg-surface-base px-3 py-1.5 text-text-muted hover:text-text-main"
            >
              <ArrowLeft className="h-3.5 w-3.5 rtl-flip" />
              <span>{t("common.back")}</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-600 transition"
            >
              <span>{t("activate.reviewParameters")}</span>
              <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & ACTIVATE */}
      {step === 4 && (
        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-6 space-y-5 text-xs animate-fade-in">
          <div>
            <h3 className="text-sm font-bold text-text-main">{t("activate.step4Head")}</h3>
            <p className="text-[11px] text-text-muted mt-0.5">
              Confirm incident parameters. Activation will initialize the Incident Room and dispatch emergency alerts.
            </p>
          </div>

          <div className="rounded-xl border border-border-subtle bg-surface-base p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-2">
              <div>
                <span className="text-[10px] text-text-muted uppercase">{t("activate.incidentName")}</span>
                <h4 className="text-base font-bold text-text-main">{title}</h4>
              </div>
              <div className="flex items-center gap-2">
                <SeverityBadge severity={severity} />
                <PriorityChip lane="now" score={98} />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-text-muted block text-[10px]">{t("activate.siteLabel")}</span>
                <span className="font-semibold text-text-main">{site}</span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px]">{t("activate.categoryLabel")}</span>
                <span className="font-semibold text-text-main capitalize">{category}</span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px]">{t("activate.playbookLabel")}</span>
                <span className="font-semibold text-text-main">CP-DESAL-04</span>
              </div>
            </div>
          </div>

          {/* Broadcast Preview */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-amber-400 text-xs flex items-center gap-1.5">
                <Send className="h-3.5 w-3.5" /> Initial Broadcast Preview (SMS & Teams)
              </span>
              <span className="text-[10px] text-text-muted">{t("activate.totalRecipients")}</span>
            </div>
            <p className="font-mono text-[11px] text-text-main bg-surface-base p-3 rounded-lg border border-border-subtle leading-relaxed">
              &quot;CRITICAL ALERT [SEV1]: {title} at {site}. Immediate emergency response activated. Report to Incident Room immediately.&quot;
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-1 rounded-lg border border-border-subtle bg-surface-base px-3 py-1.5 text-text-muted hover:text-text-main"
            >
              <ArrowLeft className="h-3.5 w-3.5 rtl-flip" />
              <span>{t("common.back")}</span>
            </button>
            <button
              type="button"
              disabled={isActivating}
              onClick={handleActivate}
              className="inline-flex items-center gap-2 rounded-xl bg-critical-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-critical-700 transition"
            >
              <Flame className="h-4 w-4" />
              <span>{isActivating ? "Activating Incident..." : "Confirm & Activate Incident"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
