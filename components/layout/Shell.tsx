"use client";

import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { PersistentBanners } from "./PersistentBanners";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { CommandPalette } from "./CommandPalette";
import { RolePickerModal } from "./RolePickerModal";
import { AiCopilotDrawer } from "@/components/crisis/ai/AiCopilotDrawer";
import { PresenterSimulationPanel } from "@/components/crisis/display/PresenterSimulationPanel";
import { useAppStore } from "@/lib/store/useAppStore";

interface ShellProps {
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ children }) => {
  const t = useTranslations();
  const { theme, copilotOpen, setCopilotOpen } = useAppStore();

  // Apply theme class to document element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark", "command");
    root.classList.add(theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col font-sans transition-colors duration-200">
      {/* Top Banners (Sandbox, Kill-Switch, SEV1) */}
      <PersistentBanners />

      {/* Main App Frame */}
      <div className="flex-1 flex overflow-hidden">
        {/* Hick's Law Sidebar */}
        <AppSidebar />

        {/* Content Column */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar Navigation */}
          <TopBar />

          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-6 max-w-[1600px] w-full mx-auto">
            {children}
          </main>

          {/* Global Demo Data & Brand Footer */}
          <footer className="border-t border-app-border bg-app-surface px-6 py-3 flex flex-col sm:flex-row items-center justify-between text-xs text-app-muted gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>{t("app.demoDataNotice")}</span>
            </div>
            <div className="font-medium text-app-muted/90">
              {t("app.poweredBy")}
            </div>
          </footer>
        </div>
      </div>

      {/* Modals & Overlays */}
      <CommandPalette />
      <RolePickerModal />
      <AiCopilotDrawer isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />
      <PresenterSimulationPanel />
    </div>
  );
};
