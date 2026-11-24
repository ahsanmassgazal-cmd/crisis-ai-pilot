"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  MapPin,
  Search,
  Building2,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Layers,
  Phone,
} from "lucide-react";
import { Ltr } from "@/components/layout/Ltr";
import { SEED_SITES, Site } from "@/seed/data";
import { MapPanel } from "@/components/crisis/views/MapPanel";

export default function SitesPage() {
  const t = useTranslations();
  const locale = useLocale();

  const [search, setSearch] = useState("");
  const [filterTier, setFilterTier] = useState<"all" | "tier1" | "tier2">("all");
  const [selectedSiteId, setSelectedSiteId] = useState<string>("site-sohar");

  const filteredSites = SEED_SITES.filter((s) => {
    if (filterTier !== "all" && s.criticality !== filterTier) return false;
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      s.name_en.toLowerCase().includes(term) ||
      s.name_ar.includes(search) ||
      s.city.toLowerCase().includes(term)
    );
  });

  const selectedSite = SEED_SITES.find((s) => s.id === selectedSiteId) || SEED_SITES[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-app-border pb-4">
        <div>
          <h1 className="text-xl font-black text-app-text flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-600" />
            <span>{t("sitesCenter.title")}</span>
          </h1>
          <p className="text-xs text-app-muted mt-0.5">
            {t("sitesCenter.subtitle")}
          </p>
        </div>

        {/* Tier Filters */}
        <div className="inline-flex rounded-input border border-app-border bg-app-surface p-1 text-xs">
          <button
            type="button"
            onClick={() => setFilterTier("all")}
            className={`px-3 py-1 rounded font-medium transition ${
              filterTier === "all"
                ? "bg-brand-50 text-brand-600 font-bold shadow-xs"
                : "text-app-muted hover:text-app-text"
            }`}
          >
            {t("sitesCenter.allSites")}
          </button>
          <button
            type="button"
            onClick={() => setFilterTier("tier1")}
            className={`px-3 py-1 rounded font-medium transition ${
              filterTier === "tier1"
                ? "bg-brand-50 text-brand-600 font-bold shadow-xs"
                : "text-app-muted hover:text-app-text"
            }`}
          >
            {t("sitesCenter.tier1Facilities")}
          </button>
          <button
            type="button"
            onClick={() => setFilterTier("tier2")}
            className={`px-3 py-1 rounded font-medium transition ${
              filterTier === "tier2"
                ? "bg-brand-50 text-brand-600 font-bold shadow-xs"
                : "text-app-muted hover:text-app-text"
            }`}
          >
            {t("sitesCenter.tier2Facilities")}
          </button>
        </div>
      </div>

      {/* Main Grid: Sites List & Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sites List */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute inset-inline-start-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-app-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("sitesCenter.searchPlaceholder")}
              className="w-full rounded-input border border-app-border bg-app-surface ps-8 pe-3 py-1.5 text-xs text-app-text focus:outline-none focus:ring-1 focus:ring-brand-600"
            />
          </div>

          <div className="space-y-2.5">
            {filteredSites.map((site) => {
              const isSelected = site.id === selectedSiteId;
              const hasIncidents = site.active_incidents_count > 0;
              return (
                <div
                  key={site.id}
                  onClick={() => setSelectedSiteId(site.id)}
                  className={`p-3.5 rounded-card border cursor-pointer transition text-xs space-y-2 ${
                    isSelected
                      ? "border-brand-600 bg-brand-50/20 dark:bg-brand-950/20 shadow-xs"
                      : "border-app-border bg-app-surface hover:border-brand-600/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-brand-600 uppercase font-mono">
                      {site.criticality}
                    </span>
                    {hasIncidents ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-severity-critical-tint text-severity-critical border border-severity-critical/30 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <Ltr>{site.active_incidents_count}</Ltr> {t("sitesCenter.activeIncidentsLabel")}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {t("components.allSystemsNormal")}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-xs text-app-text">
                      {locale === "ar" ? site.name_ar : site.name_en}
                    </h3>
                    <p className="text-[10px] text-app-muted mt-0.5">
                      {site.city}, {site.country}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-app-muted pt-1 border-t border-app-border font-mono">
                    <span>
                      <Ltr>{site.lat.toFixed(4)}°N, {site.lng.toFixed(4)}°E</Ltr>
                    </span>
                    <span className="text-brand-600 font-semibold">{t("sitesCenter.viewOnMap")} →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Map & Telemetry Details */}
        <div className="lg:col-span-2 space-y-4">
          <MapPanel sites={SEED_SITES} className="h-[360px]" />

          {/* Selected Site Telemetry Card */}
          <div className="rounded-card border border-app-border bg-app-surface p-5 space-y-4 text-xs">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-app-border pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-600 font-mono">
                  {selectedSite.criticality}
                </span>
                <h2 className="text-base font-bold text-app-text mt-0.5">
                  {locale === "ar" ? selectedSite.name_ar : selectedSite.name_en}
                </h2>
                <p className="text-xs text-app-muted">
                  {t("components.cityRegion")} {selectedSite.city}, {selectedSite.country} • <Ltr>{selectedSite.lat.toFixed(4)}°N, {selectedSite.lng.toFixed(4)}°E</Ltr>
                </p>
              </div>

              {selectedSite.active_incidents_count > 0 ? (
                <div className="px-3 py-1.5 rounded-card bg-severity-critical-tint text-severity-critical border border-severity-critical/40 font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{t("sitesCenter.activeSevNotice")}</span>
                </div>
              ) : (
                <div className="px-3 py-1.5 rounded-card bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t("components.allSystemsNormal")}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-card bg-app-surface-subtle space-y-1">
                <span className="text-[10px] text-app-muted uppercase font-bold">{t("sitesCenter.telemetryStream")}</span>
                <p className="text-xs font-bold text-emerald-600">{t("sitesCenter.telemetryActive")}</p>
              </div>
              <div className="p-3 rounded-card bg-app-surface-subtle space-y-1">
                <span className="text-[10px] text-app-muted uppercase font-bold">{t("sitesCenter.powerSupply")}</span>
                <p className="text-xs font-bold text-app-text">{t("sitesCenter.powerDualGrid")}</p>
              </div>
              <div className="p-3 rounded-card bg-app-surface-subtle space-y-1">
                <span className="text-[10px] text-app-muted uppercase font-bold">{t("sitesCenter.onSiteResponders")}</span>
                <p className="text-xs font-bold text-app-text"><Ltr>14</Ltr> {t("sitesCenter.onDuty")}</p>
              </div>
              <div className="p-3 rounded-card bg-app-surface-subtle space-y-1">
                <span className="text-[10px] text-app-muted uppercase font-bold">{t("sitesCenter.primaryContact")}</span>
                <p className="text-xs font-bold text-app-text font-mono"><Ltr>+968 9123 4567</Ltr></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
