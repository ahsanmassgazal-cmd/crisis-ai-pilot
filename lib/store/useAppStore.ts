import { create } from "zustand";

export type TenantId =
  | "gulf_water"
  | "national_bank"
  | "city_hospital"
  | "ministry_services";

export type RoleId =
  | "superAdmin"
  | "tenantAdmin"
  | "commander"
  | "team"
  | "continuity"
  | "comms"
  | "responder"
  | "executive"
  | "auditor"
  | "presenter";

export type AutomationMode = "auto" | "assisted" | "manual";
export type ThemeMode = "light" | "dark" | "command";

export interface PresenterFailures {
  smsABroken: boolean;
  emailDelayed: boolean;
  teamsError: boolean;
  responderUnresponsive: boolean;
  scadaSpike: boolean;
  auditBitFlipped: boolean;
}

interface AppState {
  currentTenant: TenantId;
  currentRole: RoleId;
  automationMode: AutomationMode;
  isAutomationsPaused: boolean;
  isSandboxMode: boolean;
  theme: ThemeMode;
  commandPaletteOpen: boolean;
  rolePickerOpen: boolean;
  activeSev1BannerVisible: boolean;
  sidebarCollapsed: boolean;
  copilotOpen: boolean;
  presenterPanelOpen: boolean;
  simSpeed: 1 | 5 | 60 | 300;
  failures: PresenterFailures;

  setTenant: (tenant: TenantId) => void;
  setRole: (role: RoleId) => void;
  setAutomationMode: (mode: AutomationMode) => void;
  togglePauseAutomations: () => void;
  setTheme: (theme: ThemeMode) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setRolePickerOpen: (open: boolean) => void;
  dismissSev1Banner: () => void;
  toggleSidebar: () => void;
  setCopilotOpen: (open: boolean) => void;
  toggleCopilot: () => void;
  setPresenterPanelOpen: (open: boolean) => void;
  togglePresenterPanel: () => void;
  setSimSpeed: (speed: 1 | 5 | 60 | 300) => void;
  toggleFailure: (failureKey: keyof PresenterFailures) => void;
  setFailure: (failureKey: keyof PresenterFailures, value: boolean) => void;
  resetFailures: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentTenant: "gulf_water",
  currentRole: "commander",
  automationMode: "auto",
  isAutomationsPaused: false,
  isSandboxMode: true,
  theme: "light",
  commandPaletteOpen: false,
  rolePickerOpen: false,
  activeSev1BannerVisible: true,
  sidebarCollapsed: false,
  copilotOpen: false,
  presenterPanelOpen: false,
  simSpeed: 1,
  failures: {
    smsABroken: false,
    emailDelayed: false,
    teamsError: false,
    responderUnresponsive: false,
    scadaSpike: false,
    auditBitFlipped: false,
  },

  setTenant: (currentTenant) => set({ currentTenant }),
  setRole: (currentRole) => set({ currentRole }),
  setAutomationMode: (automationMode) => set({ automationMode }),
  togglePauseAutomations: () =>
    set((state) => ({ isAutomationsPaused: !state.isAutomationsPaused })),
  setTheme: (theme) => set({ theme }),
  setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
  setRolePickerOpen: (rolePickerOpen) => set({ rolePickerOpen }),
  dismissSev1Banner: () => set({ activeSev1BannerVisible: false }),
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setCopilotOpen: (copilotOpen) => set({ copilotOpen }),
  toggleCopilot: () => set((state) => ({ copilotOpen: !state.copilotOpen })),
  setPresenterPanelOpen: (presenterPanelOpen) => set({ presenterPanelOpen }),
  togglePresenterPanel: () =>
    set((state) => ({ presenterPanelOpen: !state.presenterPanelOpen })),
  setSimSpeed: (simSpeed) => set({ simSpeed }),
  toggleFailure: (key) =>
    set((state) => ({
      failures: {
        ...state.failures,
        [key]: !state.failures[key],
      },
    })),
  setFailure: (key, value) =>
    set((state) => ({
      failures: {
        ...state.failures,
        [key]: value,
      },
    })),
  resetFailures: () =>
    set({
      failures: {
        smsABroken: false,
        emailDelayed: false,
        teamsError: false,
        responderUnresponsive: false,
        scadaSpike: false,
        auditBitFlipped: false,
      },
    }),
}));
