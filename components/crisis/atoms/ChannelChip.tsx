import React from "react";
import { CHANNEL_CONFIG, ChannelType } from "@/lib/tokens";

interface ChannelChipProps {
  channel: ChannelType;
  className?: string;
  showComingSoon?: boolean;
}

export const ChannelChip: React.FC<ChannelChipProps> = ({
  channel,
  className = "",
  showComingSoon = true,
}) => {
  const meta = CHANNEL_CONFIG[channel] || CHANNEL_CONFIG.sms;
  const Icon = meta.icon;

  const names: Record<ChannelType, string> = {
    sms: "SMS",
    email: "Email",
    teams: "Teams",
    whatsapp: "WhatsApp",
    voice: "Voice",
    push: "Push",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-input text-xs font-semibold border border-app-border bg-app-surface text-app-text shadow-sm ${className}`}
    >
      <Icon className={`w-3.5 h-3.5 shrink-0 ${meta.colorClass}`} />
      <span>{names[channel]}</span>
      {meta.isComingSoon && showComingSoon && (
        <span className="text-[9px] px-1.5 py-0.2 rounded bg-app-surface-subtle text-app-muted font-mono font-medium">
          Coming
        </span>
      )}
    </span>
  );
};
