"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import {
  LayoutDashboard,
  Siren,
  Radio,
  Focus,
  BellRing,
  CheckSquare,
  FileText,
  Activity,
  Users,
  BookOpen,
  MapPin,
  AlertTriangle,
  BarChart3,
  Cpu,
  LifeBuoy,
  Flame,
  Zap,
  Workflow,
  Network,
  FolderArchive,
  ArrowDownUp,
  PieChart,
  GraduationCap,
  ShieldCheck,
  Fingerprint,
  Settings,
  Tv,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Shield,
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";

export const AppSidebar: React.FC = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  const navGroups = [
    {
      label: t("nav.groupCommand"),
      items: [
        { label: t("nav.commandCenter"), href: "/app", icon: LayoutDashboard },
        { label: t("nav.incidents"), href: "/app/incidents", icon: Siren },
        { label: t("nav.incidentRoom"), href: "/app/incidents/inc-2026-001", icon: Radio },
        { label: t("nav.attentionQueue"), href: "/app/focus", icon: Focus },
      ],
    },
    {
      label: t("nav.groupCommunicate"),
      items: [
        { label: t("nav.notifications"), href: "/app/notifications", icon: BellRing },
        { label: t("nav.approvals"), href: "/app/approvals", icon: CheckSquare },
        { label: t("nav.templates"), href: "/app/templates", icon: FileText },
        { label: t("nav.statusPage"), href: "/app/status-page", icon: Activity },
      ],
    },
    {
      label: t("nav.groupPrepare"),
      items: [
        { label: t("nav.people"), href: "/app/people", icon: Users },
        { label: t("nav.plans"), href: "/app/plans", icon: BookOpen },
        { label: t("nav.sites"), href: "/app/sites", icon: MapPin },
        { label: t("nav.risks"), href: "/app/risks", icon: AlertTriangle },
      ],
    },
    {
      label: t("nav.groupContinuity"),
      items: [
        { label: t("nav.bia"), href: "/app/continuity/bia", icon: BarChart3 },
        { label: t("nav.criticalFunctions"), href: "/app/continuity/functions", icon: Cpu },
        { label: t("nav.recovery"), href: "/app/continuity/recovery", icon: LifeBuoy },
        { label: t("nav.drills"), href: "/app/drills", icon: Flame },
      ],
    },
    {
      label: t("nav.groupAutomate"),
      items: [
        { label: t("nav.automations"), href: "/app/automations", icon: Zap },
        { label: t("nav.triggers"), href: "/app/triggers", icon: Workflow },
        { label: t("nav.integrations"), href: "/app/integrations", icon: Network },
      ],
    },
    {
      label: t("nav.groupData"),
      items: [
        { label: t("nav.documents"), href: "/app/documents", icon: FolderArchive },
        { label: t("nav.importExport"), href: "/app/data", icon: ArrowDownUp },
        { label: t("nav.reports"), href: "/app/reports", icon: PieChart },
        { label: t("nav.lessons"), href: "/app/lessons", icon: GraduationCap },
      ],
    },
    {
      label: t("nav.groupGovern"),
      items: [
        { label: t("nav.compliance"), href: "/app/compliance", icon: ShieldCheck },
        { label: t("nav.audit"), href: "/app/audit", icon: Fingerprint },
        { label: t("nav.settings"), href: "/app/settings", icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={`border-e border-app-border bg-app-surface flex flex-col justify-between shrink-0 transition-all duration-300 relative z-20 ${
        sidebarCollapsed ? "w-[72px]" : "w-[264px]"
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 border-b border-app-border flex items-center justify-between px-4">
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-input bg-brand-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
              <Shield className="w-4 h-4 fill-current" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-sm tracking-tight text-app-text truncate">
                {t("app.wordmark")}
              </span>
              <span className="text-[10px] text-app-muted truncate">
                SigmaMax AI Solutions
              </span>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 mx-auto rounded-input bg-brand-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
            <Shield className="w-4 h-4 fill-current" />
          </div>
        )}

        <button
          onClick={toggleSidebar}
          className="text-app-muted hover:text-app-text p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-input hover:bg-app-surface-subtle transition-colors"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4 dir-aware-flip" />
          ) : (
            <ChevronLeft className="w-4 h-4 dir-aware-flip" />
          )}
        </button>
      </div>

      {/* Nav Items List */}
      <nav aria-label={t("components.sidebarNav")} className="flex-1 overflow-y-auto py-3 px-2 space-y-4 text-xs">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!sidebarCollapsed && (
              <h2 className="px-3 text-[10px] font-bold text-app-muted/80 uppercase tracking-wider">
                {group.label}
              </h2>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item, iIdx) => {
                const isActive =
                  item.href === "/app"
                    ? pathname === "/app"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <li key={iIdx}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-input transition-colors font-medium ${
                        isActive
                          ? "bg-brand-50 text-brand-600 dark:bg-brand-50/20 font-bold"
                          : "text-app-text hover:bg-app-surface-subtle"
                      } ${sidebarCollapsed ? "justify-center px-0" : ""}`}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-brand-600" : "text-app-muted"}`} />
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {/* Wall Mode Special Entry */}
        <div className="pt-2 border-t border-app-border/60">
          <Link
            href="/app/wall"
            className={`flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-input text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors font-medium ${
              sidebarCollapsed ? "justify-center px-0" : ""
            }`}
            title={t("nav.wallMode")}
          >
            <Tv className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span className="truncate font-semibold">{t("nav.wallMode")}</span>}
          </Link>
        </div>
      </nav>

      {/* Footer: Other Portals Quick Access */}
      {!sidebarCollapsed ? (
        <div className="p-3 border-t border-app-border bg-app-surface-subtle/50 text-[11px] space-y-1.5">
          <div className="font-semibold text-app-muted px-1 text-[10px] uppercase">
            {t("commandPalette.navigation")}
          </div>
          <div className="grid grid-cols-2 gap-1 text-app-muted">
            <Link
              href="/owner"
              className="p-1 rounded hover:text-brand-600 flex items-center justify-between"
            >
              <span>{t("portals.ownerConsole")}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </Link>
            <Link
              href="/r"
              className="p-1 rounded hover:text-brand-600 flex items-center justify-between"
            >
              <span>{t("portals.responderApp")}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </Link>
            <Link
              href="/portal"
              className="p-1 rounded hover:text-brand-600 flex items-center justify-between"
            >
              <span>{t("portals.stakeholderPortal")}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </Link>
            <Link
              href="/status/gulf_water"
              className="p-1 rounded hover:text-brand-600 flex items-center justify-between"
            >
              <span>{t("portals.publicStatus")}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="p-2 border-t border-app-border flex justify-center">
          <Link href="/owner" className="p-1 text-app-muted hover:text-brand-600" title={t("portals.ownerConsole")}>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </aside>
  );
};
