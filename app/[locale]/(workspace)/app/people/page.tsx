"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Ltr } from "@/components/common/Ltr";
import { SEED_PEOPLE } from "@/seed/data";
import {
  Users,
  Calendar,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  UserCheck
} from "lucide-react";

export default function PeopleAndGroupsPage() {
  const t = useTranslations();
  const [people, setPeople] = useState(SEED_PEOPLE);
  const [filterTeam, setFilterTeam] = useState("all");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"directory" | "oncall">("directory");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filtered = people.filter((p) => {
    if (filterTeam !== "all" && p.group_id !== filterTeam) return false;
    if (search && !p.name_en.toLowerCase().includes(search.toLowerCase()) && !p.name_ar.includes(search)) {
      return false;
    }
    return true;
  });

  const onCallSchedule = [
    { shift: "Primary Shift (08:00 - 16:00)", lead: "Eng. Salem Al-Harthy", role: "Incident Commander", status: "Active" },
    { shift: "Primary SCADA Shift (08:00 - 16:00)", lead: "Tariq Al-Lawati", role: "Lead SCADA Engineer", status: "Active" },
    { shift: "Evening Standby (16:00 - 00:00)", lead: "Dr. Hamed Al-Riyami", role: "Water Quality Director", status: "Standby" },
    { shift: "Night Standby (00:00 - 08:00)", lead: "Majid Al-Habsi", role: "Physical Security Officer", status: "Standby" }
  ];

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 inset-inline-end-6 z-50 rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-semibold text-white shadow-xl animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-main">
            {t("nav.people")}
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Crisis response roster, role assignments, 24/7 on-call shift calendar, and contact verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab toggle */}
          <div className="inline-flex rounded-lg border border-border-subtle bg-surface-base p-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("directory")}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                activeTab === "directory"
                  ? "bg-surface-elevated text-text-main shadow-xs font-semibold"
                  : "text-text-muted hover:text-text-main"
              }`}
            >
              Roster Directory ({people.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("oncall")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
                activeTab === "oncall"
                  ? "bg-surface-elevated text-text-main shadow-xs font-semibold"
                  : "text-text-muted hover:text-text-main"
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              On-Call Calendar
            </button>
          </div>

          <button
            type="button"
            onClick={() => showToast("Opening Add Person modal...")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 shadow-sm transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t("peopleCenter.addResponder")}</span>
          </button>
        </div>
      </div>

      {activeTab === "directory" ? (
        <div className="space-y-4">
          {/* Filter and search */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="inline-flex rounded-lg border border-border-subtle bg-surface-base p-1">
              {[
                { id: "all", label: "All Teams" },
                { id: "grp-command", label: "Command & Control" },
                { id: "grp-tech", label: "SCADA & Engineering" },
                { id: "grp-comms", label: "Media & Comms" },
                { id: "grp-safety", label: "Health & Safety" }
              ].map((team) => (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => setFilterTeam(team.id)}
                  className={`px-3 py-1 rounded font-medium transition ${
                    filterTeam === team.id
                      ? "bg-surface-elevated text-text-main shadow-xs font-semibold"
                      : "text-text-muted hover:text-text-main"
                  }`}
                >
                  {team.label}
                </button>
              ))}
            </div>

            <div className="relative min-w-[240px]">
              <Search className="absolute inset-inline-start-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("peopleCenter.searchPlaceholder")}
                className="w-full rounded-lg border border-border-subtle bg-surface-elevated ps-8 pe-3 py-1.5 text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {filtered.map((person) => (
              <div
                key={person.id}
                className="rounded-xl border border-border-subtle bg-surface-elevated p-4 space-y-3 hover:border-brand-500/40 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center text-xs">
                      {person.name_en.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <h3 className="font-bold text-text-main text-xs">{person.name_en}</h3>
                      <p className="text-[11px] text-brand-400 font-medium font-arabic" dir="rtl">{person.name_ar}</p>
                      <p className="text-[10px] text-text-muted capitalize">{(person.role || person.title).replace("_", " ")}</p>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active
                  </span>
                </div>

                <div className="space-y-1 bg-surface-base p-2.5 rounded-lg border border-border-subtle text-[11px]">
                  <div className="flex items-center gap-2 text-text-muted">
                    <Phone className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                    <span className="font-mono text-text-main"><Ltr>{person.phone || person.phone_e164}</Ltr></span>
                  </div>
                  <div className="flex items-center gap-2 text-text-muted">
                    <Mail className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                    <span className="text-text-main truncate">{person.email}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-text-muted pt-1">
                  <span>{t("peopleCenter.languageLabel")}: <strong className="text-text-main uppercase">{person.lang || person.language_pref}</strong></span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> E.164 Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* On-Call Calendar Tab */
        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div>
              <h3 className="text-sm font-bold text-text-main">{t("peopleCenter.onCallRosterTitle")}</h3>
              <p className="text-[11px] text-text-muted">{t("peopleCenter.onCallRosterSub")}</p>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              100% Shift Coverage
            </span>
          </div>

          <div className="space-y-3">
            {onCallSchedule.map((shift, idx) => (
              <div
                key={idx}
                className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-lg border border-border-subtle bg-surface-base"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text-main">{shift.shift}</span>
                    <span
                      className={`text-[10px] px-2 py-0.2 rounded font-semibold ${
                        shift.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-surface-elevated text-text-muted border border-border-subtle"
                      }`}
                    >
                      {shift.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted">
                    Designated Lead: <strong className="text-text-main">{shift.lead}</strong> ({shift.role})
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => showToast(`Requested swap for ${shift.shift}`)}
                  className="px-3 py-1.5 rounded-lg border border-border-subtle bg-surface-elevated text-text-muted hover:text-text-main font-medium"
                >
                  Request Shift Swap
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
