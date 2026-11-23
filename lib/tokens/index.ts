import {
  OctagonAlert,
  TriangleAlert,
  CircleAlert,
  Info,
  MessageCircle,
  FilePen,
  CircleDot,
  Loader,
  Eye,
  Ban,
  CircleCheck,
  Archive,
  ChevronsUp,
  ChevronUp,
  Minus,
  ChevronDown,
  MessageSquareText,
  Mail,
  Users,
  PhoneCall,
  BellRing,
  ShieldAlert,
  Flame,
  Zap,
  CloudLightning,
  HeartPulse,
  Truck,
  Siren,
  Megaphone,
  ServerCrash,
  Droplets,
  LucideIcon,
} from "lucide-react";

export type SeverityLevel = "critical" | "high" | "medium" | "low" | "info";
export type IncidentStatus =
  | "draft"
  | "active"
  | "inprogress"
  | "monitoring"
  | "blocked"
  | "resolved"
  | "closed";
export type PriorityLevel = "p1" | "p2" | "p3" | "p4";
export type ChannelType =
  | "sms"
  | "email"
  | "teams"
  | "whatsapp"
  | "voice"
  | "push";
export type CategoryType =
  | "cyber"
  | "fire"
  | "power"
  | "weather"
  | "health"
  | "supply"
  | "security"
  | "reputation"
  | "it"
  | "environmental";

export interface SeverityMeta {
  level: SeverityLevel;
  icon: LucideIcon;
  badgeClass: string;
}

export const SEVERITY_CONFIG: Record<SeverityLevel, SeverityMeta> = {
  critical: {
    level: "critical",
    icon: OctagonAlert,
    badgeClass: "bg-severity-critical-tint text-severity-critical border-severity-critical",
  },
  high: {
    level: "high",
    icon: TriangleAlert,
    badgeClass: "bg-severity-high-tint text-severity-high border-severity-high",
  },
  medium: {
    level: "medium",
    icon: CircleAlert,
    badgeClass: "bg-severity-medium-tint text-severity-medium border-severity-medium",
  },
  low: {
    level: "low",
    icon: Info,
    badgeClass: "bg-severity-low-tint text-severity-low border-severity-low",
  },
  info: {
    level: "info",
    icon: MessageCircle,
    badgeClass: "bg-severity-info-tint text-severity-info border-severity-info",
  },
};

export const STATUS_CONFIG: Record<
  IncidentStatus,
  { icon: LucideIcon; colorClass: string }
> = {
  draft: { icon: FilePen, colorClass: "text-status-draft" },
  active: { icon: CircleDot, colorClass: "text-status-active" },
  inprogress: { icon: Loader, colorClass: "text-status-inprogress" },
  monitoring: { icon: Eye, colorClass: "text-status-monitoring" },
  blocked: { icon: Ban, colorClass: "text-status-blocked" },
  resolved: { icon: CircleCheck, colorClass: "text-status-resolved" },
  closed: { icon: Archive, colorClass: "text-status-closed" },
};

export const PRIORITY_CONFIG: Record<
  PriorityLevel,
  { icon: LucideIcon; chipClass: string }
> = {
  p1: { icon: ChevronsUp, chipClass: "bg-priority-p1 text-white" },
  p2: { icon: ChevronUp, chipClass: "bg-priority-p2 text-white" },
  p3: { icon: Minus, chipClass: "border border-priority-p3 text-priority-p3" },
  p4: { icon: ChevronDown, chipClass: "border border-priority-p4 text-priority-p4" },
};

export const CHANNEL_CONFIG: Record<
  ChannelType,
  { icon: LucideIcon; colorClass: string; isComingSoon?: boolean }
> = {
  sms: { icon: MessageSquareText, colorClass: "text-channel-sms" },
  email: { icon: Mail, colorClass: "text-channel-email" },
  teams: { icon: Users, colorClass: "text-channel-teams" },
  whatsapp: { icon: MessageCircle, colorClass: "text-channel-whatsapp", isComingSoon: true },
  voice: { icon: PhoneCall, colorClass: "text-channel-voice", isComingSoon: true },
  push: { icon: BellRing, colorClass: "text-channel-push" },
};

export const CATEGORY_CONFIG: Record<
  CategoryType,
  { icon: LucideIcon; colorClass: string }
> = {
  cyber: { icon: ShieldAlert, colorClass: "text-category-cyber" },
  fire: { icon: Flame, colorClass: "text-category-fire" },
  power: { icon: Zap, colorClass: "text-category-power" },
  weather: { icon: CloudLightning, colorClass: "text-category-weather" },
  health: { icon: HeartPulse, colorClass: "text-category-health" },
  supply: { icon: Truck, colorClass: "text-category-supply" },
  security: { icon: Siren, colorClass: "text-category-security" },
  reputation: { icon: Megaphone, colorClass: "text-category-reputation" },
  it: { icon: ServerCrash, colorClass: "text-category-it" },
  environmental: { icon: Droplets, colorClass: "text-category-environmental" },
};
