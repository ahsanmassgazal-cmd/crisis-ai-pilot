"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Sparkles, X, Send, Bot, ArrowRight, DollarSign, RefreshCw } from "lucide-react";
import { Ltr } from "@/components/layout/Ltr";

export interface AiCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  incidentContext?: { id: string; title: string; severity: string };
}

export function AiCopilotDrawer({
  isOpen,
  onClose,
  incidentContext = {
    id: "INC-2026-001",
    title: "SCADA Telemetry Anomaly - Sohar Desalination",
    severity: "critical"
  }
}: AiCopilotDrawerProps) {
  const t = useTranslations("components");
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<Array<{ role: "user" | "assistant"; text: string; time: string }>>([
    {
      role: "assistant",
      text: `Hello Commander. I am monitoring active incident [${incidentContext.id}]. How can I assist with response recommendations, stakeholder drafting, or impact modeling?`,
      time: "10:15"
    }
  ]);
  const [tokenCost, setTokenCost] = useState(0.0034);

  const quickPrompts = [
    "Draft bilingual SMS alert for On-Call Engineers",
    "Identify top 3 critical dependencies from BIA",
    "Suggest next steps for SCADA network containment",
    "Prepare holding statement for Media Lead"
  ];

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newHist = [...history, { role: "user" as const, text: userText, time: now }];
    setHistory(newHist);
    setQuery("");

    // Simulate AI response
    setTimeout(() => {
      let aiReply = "Analyzing incident parameters...";
      if (userText.includes("SMS") || userText.includes("alert")) {
        aiReply = `Recommended Bilingual SMS Draft:\n\n[EN] CRITICAL ALERT: SCADA containment active at Sohar Plant. On-call engineers report to Command Room immediately.\n\n[AR] تنبيه حرج: تفعيل خطة الاحتواء لشبكة سكادا في محطة صحار. على مهندسي المناوبة الحضور فوراً إلى غرفة العمليات.`;
      } else if (userText.includes("dependencies") || userText.includes("BIA")) {
        aiReply = `BIA Critical Dependencies Identified for Sohar Plant:\n1. Secondary RO High-Pressure Pump Line B (RTO: 4 hours)\n2. Substation 33kV Feed (RTO: 1 hour)\n3. Potable Water Blending Reservoir Sensor Gateway (RTO: 2 hours)`;
      } else {
        aiReply = `Based on ISO 22301 & NCEMA frameworks, verify plant physical perimeter access, validate secondary telemetry via manual gauges, and notify Department Director within the 15-minute SLA.`;
      }

      setHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
      setTokenCost((prev) => +(prev + 0.0018).toFixed(4));
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs" onClick={onClose} />
      <div className="fixed inset-y-0 inset-inline-end-0 z-50 w-full sm:w-[460px] bg-surface-elevated border-s border-brand-500/30 shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle p-4 bg-brand-500/10">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-brand-500 p-1.5 text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-main flex items-center gap-1.5">
                AI Crisis Copilot
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-500/20 text-brand-400 font-semibold border border-brand-500/30">
                  Dual-Model
                </span>
              </h3>
              <p className="text-[11px] text-text-muted">
                Context: <span className="font-mono text-text-main">{incidentContext.id}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-text-muted hover:bg-surface-base hover:text-text-main"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {history.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                  msg.role === "user"
                    ? "bg-brand-500 text-white rounded-te-none"
                    : "bg-surface-base text-text-main border border-border-subtle rounded-ts-none shadow-xs"
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <div
                  className={`flex items-center justify-end gap-1 text-[9px] pt-1 mt-1 ${
                    msg.role === "user" ? "text-white/80" : "text-text-muted"
                  }`}
                >
                  <Ltr>{msg.time}</Ltr>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Prompts */}
        <div className="border-t border-border-subtle bg-surface-base p-3 space-y-2">
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
            Suggested Prompts
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(p)}
                className="text-[11px] rounded-lg border border-border-subtle bg-surface-elevated px-2.5 py-1 text-start text-text-muted hover:border-brand-500/50 hover:text-text-main transition"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Box & Cost Meter */}
        <div className="p-3 border-t border-border-subtle bg-surface-elevated space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(query);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("askCopilotPlaceholder")}
              className="flex-1 rounded-xl border border-border-subtle bg-surface-base px-3 py-2 text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <button
              type="submit"
              className="rounded-xl bg-brand-500 p-2 text-white hover:bg-brand-600 transition shadow-sm"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[10px] text-text-muted px-1">
            <span className="flex items-center gap-1">
              <Bot className="h-3 w-3 text-brand-500" />
              Gemini 2.5 Pro + Flash Reasoning
            </span>
            <span className="font-mono text-emerald-500 flex items-center gap-0.5">
              <DollarSign className="h-3 w-3" />
              Session Cost: <Ltr>${tokenCost.toFixed(4)}</Ltr>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
