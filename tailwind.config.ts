import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "var(--brand-50)",
          600: "var(--brand-600)",
          hover: "var(--brand-hover)",
        },
        app: {
          bg: "var(--bg)",
          surface: "var(--surface)",
          "surface-subtle": "var(--surface-subtle)",
          border: "var(--border)",
          text: "var(--text)",
          muted: "var(--text-muted)",
        },
        severity: {
          critical: "var(--sev-critical)",
          "critical-tint": "var(--sev-critical-tint)",
          high: "var(--sev-high)",
          "high-tint": "var(--sev-high-tint)",
          medium: "var(--sev-medium)",
          "medium-tint": "var(--sev-medium-tint)",
          low: "var(--sev-low)",
          "low-tint": "var(--sev-low-tint)",
          info: "var(--sev-info)",
          "info-tint": "var(--sev-info-tint)",
        },
        status: {
          draft: "var(--status-draft)",
          active: "var(--status-active)",
          inprogress: "var(--status-inprogress)",
          monitoring: "var(--status-monitoring)",
          blocked: "var(--status-blocked)",
          resolved: "var(--status-resolved)",
          closed: "var(--status-closed)",
        },
        priority: {
          p1: "var(--priority-p1)",
          p2: "var(--priority-p2)",
          p3: "var(--priority-p3)",
          p4: "var(--priority-p4)",
        },
        channel: {
          sms: "var(--channel-sms)",
          email: "var(--channel-email)",
          teams: "var(--channel-teams)",
          whatsapp: "var(--channel-whatsapp)",
          voice: "var(--channel-voice)",
          push: "var(--channel-push)",
        },
        category: {
          cyber: "var(--category-cyber)",
          fire: "var(--category-fire)",
          power: "var(--category-power)",
          weather: "var(--category-weather)",
          health: "var(--category-health)",
          supply: "var(--category-supply)",
          security: "var(--category-security)",
          reputation: "var(--category-reputation)",
          it: "var(--category-it)",
          environmental: "var(--category-environmental)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "IBM Plex Sans Arabic", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      borderRadius: {
        card: "14px",
        input: "10px",
        chip: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
