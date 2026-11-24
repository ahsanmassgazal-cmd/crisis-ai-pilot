"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Ltr } from "@/components/layout/Ltr";
import { Smartphone, Mail, MessageSquare, Send, CheckCheck, AlertCircle } from "lucide-react";

export interface PhonePreviewProps {
  channel: "sms" | "email" | "teams";
  title?: string;
  sender?: string;
  timestamp?: string;
  bodyEn: string;
  bodyAr?: string;
  actions?: Array<{ label: string; primary?: boolean }>;
}

export function PhonePreview({
  channel: initialChannel = "sms",
  title = "Incident Escalation Notification",
  sender = "Crisis Command [Auto]",
  timestamp = "10:14 AM",
  bodyEn,
  bodyAr,
  actions = [{ label: "1: Acknowledge", primary: true }, { label: "2: Decline", primary: false }]
}: PhonePreviewProps) {
  const t = useTranslations("components");
  const [channel, setChannel] = useState<"sms" | "email" | "teams">(initialChannel);
  const [lang, setLang] = useState<"en" | "ar">("en");

  const currentBody = lang === "ar" && bodyAr ? bodyAr : bodyEn;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Channel & Language Toggles */}
      <div className="flex items-center gap-2">
        <div className="inline-flex rounded-lg border border-border-subtle bg-surface-base p-1 text-xs">
          <button
            type="button"
            onClick={() => setChannel("sms")}
            className={`inline-flex items-center gap-1 rounded px-2.5 py-1 font-medium transition ${
              channel === "sms"
                ? "bg-brand-500 text-white shadow-sm"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            SMS
          </button>
          <button
            type="button"
            onClick={() => setChannel("email")}
            className={`inline-flex items-center gap-1 rounded px-2.5 py-1 font-medium transition ${
              channel === "email"
                ? "bg-brand-500 text-white shadow-sm"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            Email
          </button>
          <button
            type="button"
            onClick={() => setChannel("teams")}
            className={`inline-flex items-center gap-1 rounded px-2.5 py-1 font-medium transition ${
              channel === "teams"
                ? "bg-brand-500 text-white shadow-sm"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Teams
          </button>
        </div>

        {bodyAr && (
          <div className="inline-flex rounded-lg border border-border-subtle bg-surface-base p-1 text-xs">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`rounded px-2 py-1 font-medium transition ${
                lang === "en" ? "bg-surface-elevated font-semibold text-text-main" : "text-text-muted"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("ar")}
              className={`rounded px-2 py-1 font-medium transition ${
                lang === "ar" ? "bg-surface-elevated font-semibold text-text-main" : "text-text-muted"
              }`}
            >
              عربي
            </button>
          </div>
        )}
      </div>

      {/* Realistic Mobile Device Frame */}
      <div className="relative w-[300px] h-[520px] rounded-[36px] border-4 border-slate-700 bg-slate-950 p-3 shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Dynamic Island / Speaker */}
        <div className="mx-auto h-4 w-24 rounded-full bg-slate-800" />

        {/* Screen Area */}
        <div className="flex-1 rounded-[24px] bg-slate-900 border border-slate-800 overflow-y-auto flex flex-col p-3 my-2 text-white">
          {/* Channel Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center text-[10px] font-bold">
                CP
              </div>
              <div>
                <p className="text-xs font-semibold text-white leading-tight">{sender}</p>
                <p className="text-[10px] text-slate-400 capitalize">{channel} Notification</p>
              </div>
            </div>
            <span className="text-[10px] text-slate-400">
              <Ltr>{timestamp}</Ltr>
            </span>
          </div>

          {/* SMS View */}
          {channel === "sms" && (
            <div className="flex-1 flex flex-col justify-end gap-3">
              <div className="self-start max-w-[85%] rounded-2xl rounded-ts-none bg-slate-800 p-3 text-xs text-slate-200 border border-slate-700 space-y-2">
                <p className="font-semibold text-white">{title}</p>
                <p className="text-slate-300 whitespace-pre-line leading-relaxed">{currentBody}</p>
                <div className="pt-1 flex items-center justify-end gap-1 text-[9px] text-slate-400">
                  <Ltr>{timestamp}</Ltr>
                  <CheckCheck className="h-3 w-3 text-brand-400" />
                </div>
              </div>

              {actions.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <p className="text-[10px] text-slate-400">{t("replyToRespond")}:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {actions.map((act, i) => (
                      <span
                        key={i}
                        className={`text-[10px] px-2 py-1 rounded-full border ${
                          act.primary
                            ? "bg-brand-500/20 border-brand-500/50 text-brand-300 font-medium"
                            : "bg-slate-800 border-slate-700 text-slate-300"
                        }`}
                      >
                        {act.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Email View */}
          {channel === "email" && (
            <div className="flex-1 flex flex-col gap-2">
              <div className="rounded-lg bg-slate-800/80 p-2 text-xs border border-slate-700 space-y-1">
                <div className="text-[10px] text-slate-400">{t("subject")}: <span className="text-slate-200 font-medium">{title}</span></div>
                <div className="text-[10px] text-slate-400">{t("from")}: <span className="text-slate-200">{sender}</span></div>
              </div>
              <div className="rounded-lg bg-slate-800 p-3 text-xs text-slate-200 border border-slate-700 flex-1 space-y-3">
                <div className="border-b border-slate-700/60 pb-2">
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-critical-500/20 text-critical-300 font-medium border border-critical-500/30">
                    <AlertCircle className="h-3 w-3" /> {t("urgentCrisisUpdate")}
                  </span>
                </div>
                <p className="whitespace-pre-line leading-relaxed">{currentBody}</p>
                {actions.length > 0 && (
                  <div className="pt-2 border-t border-slate-700/60 flex flex-col gap-1.5">
                    {actions.map((act, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`w-full py-1.5 text-center text-[11px] rounded font-medium ${
                          act.primary
                            ? "bg-brand-500 text-white hover:bg-brand-600"
                            : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                        }`}
                      >
                        {act.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Teams Adaptive Card View */}
          {channel === "teams" && (
            <div className="flex-1 flex flex-col gap-2">
              <div className="rounded-xl border border-indigo-500/40 bg-slate-800/90 p-3 shadow-lg space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
                    Microsoft Teams Card
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                    Action Required
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-white">{title}</h4>
                <p className="text-[11px] text-slate-300 whitespace-pre-line leading-relaxed">{currentBody}</p>

                {actions.length > 0 && (
                  <div className="pt-2 flex flex-col gap-1.5">
                    {actions.map((act, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`w-full py-1 text-center text-[10px] rounded font-semibold ${
                          act.primary
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-700 text-slate-300 border border-slate-600"
                        }`}
                      >
                        {act.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Home Bar Indicator */}
        <div className="mx-auto h-1 w-28 rounded-full bg-slate-700" />
      </div>
    </div>
  );
}
