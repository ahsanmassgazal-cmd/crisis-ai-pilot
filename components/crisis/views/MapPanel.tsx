"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Site, SEED_SITES } from "@/seed/data";
import { MapPin, Navigation, Building2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Ltr } from "@/components/common/Ltr";

export interface MapPoint {
  lat: number;
  lng: number;
  label: string;
}

export interface MapPanelProps {
  sites?: Site[];
  points?: MapPoint[];
  onSelectSite?: (site: Site) => void;
  className?: string;
}

export const MapPanel: React.FC<MapPanelProps> = ({
  sites: directSites,
  points,
  onSelectSite,
  className = "",
}) => {
  const t = useTranslations("components");
  const sites: Site[] = directSites || (points ? points.map((p, idx) => ({
    id: `point-${idx}`,
    tenant_id: "gulf_water",
    name_en: p.label,
    name_ar: p.label,
    city: "Sohar",
    country: "Oman",
    lat: p.lat,
    lng: p.lng,
    criticality: "tier1" as const,
    active_incidents_count: 1
  })) : SEED_SITES);
  const [selectedSite, setSelectedSite] = useState<Site | null>(sites[0] || null);

  const handleSelect = (s: Site) => {
    setSelectedSite(s);
    onSelectSite?.(s);
  };

  return (
    <div className={`p-4 rounded-card bg-app-surface border border-app-border space-y-4 shadow-sm ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-xs text-app-text flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-brand-600" />
            <span>{t("mapTitle")}</span>
          </h3>
          <p className="text-[11px] text-app-muted mt-0.5">{t("mapSub")}</p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-app-surface-subtle text-app-muted">
          <Ltr>{sites.length}</Ltr> {t("monitoredLocations")}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SVG Interactive Geo Visualizer */}
        <div className="lg:col-span-2 relative h-72 rounded-input bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center p-4">
          {/* Stylized Coastal Line SVG Background */}
          <svg className="w-full h-full opacity-30 pointer-events-none" viewBox="0 0 400 300">
            <path
              d="M 120 40 Q 180 60 220 100 T 280 200 T 220 280 L 160 280 Z"
              fill="currentColor"
              className="text-slate-700"
            />
          </svg>

          {/* Interactive Site Pins */}
          {sites.map((s) => {
            // Project relative coordinates to box
            const isSelected = selectedSite?.id === s.id;
            const hasCritical = s.active_incidents_count > 0;

            // Normalized positions for Oman map
            const posX = ((s.lng - 53) / 7) * 80 + 10;
            const posY = 100 - ((s.lat - 16) / 10) * 80 - 10;

            return (
              <button
                key={s.id}
                onClick={() => handleSelect(s)}
                style={{ left: `${posX}%`, top: `${posY}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-20 focus:outline-none"
              >
                <div className="relative flex items-center justify-center">
                  {hasCritical && (
                    <span className="absolute w-6 h-6 rounded-full bg-severity-critical opacity-75 animate-ping" />
                  )}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg transition-transform ${
                      isSelected
                        ? "scale-125 ring-2 ring-white bg-brand-600"
                        : hasCritical
                        ? "bg-severity-critical"
                        : "bg-emerald-600"
                    }`}
                  >
                    <MapPin className="w-4 h-4 fill-current" />
                  </div>
                </div>

                <span className="absolute top-full mt-1 start-1/2 transform -translate-x-1/2 px-1.5 py-0.5 rounded bg-slate-950/90 text-white text-[9px] font-bold whitespace-nowrap shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {s.city} {hasCritical ? "(!)" : ""}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Site Details Card */}
        <div className="p-3.5 rounded-input bg-app-surface-subtle/80 border border-app-border space-y-3 flex flex-col justify-between">
          {selectedSite ? (
            <>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-app-surface border border-app-border font-bold">
                    {selectedSite.criticality.toUpperCase()}
                  </span>
                  {selectedSite.active_incidents_count > 0 ? (
                    <span className="text-[11px] font-bold text-severity-critical flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{selectedSite.active_incidents_count} Active Incidents</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t("allSystemsNormal")}</span>
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-sm text-app-text">
                  {selectedSite.name_en}
                </h4>
                <div className="text-xs text-app-muted">{selectedSite.name_ar}</div>
              </div>

              <div className="space-y-1 text-[11px] text-app-muted border-t border-app-border pt-2">
                <div className="flex justify-between">
                  <span>{t("cityRegion")}</span>
                  <span className="font-semibold text-app-text">{selectedSite.city}, {selectedSite.country}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span>{t("coordinates")}</span>
                  <span className="text-app-text">
                    <Ltr>{selectedSite.lat.toFixed(4)}°N, {selectedSite.lng.toFixed(4)}°E</Ltr>
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-xs text-app-muted my-auto">{t("selectSitePin")}</div>
          )}
        </div>
      </div>
    </div>
  );
};
