"use client";

import React, { useState } from "react";
import { OctagonAlert, Play, CheckCircle2, AlertTriangle } from "lucide-react";

export interface KillSwitchProps {
  isPaused: boolean;
  onToggle: (newPausedState: boolean) => void;
}

export function KillSwitch({ isPaused, onToggle }: KillSwitchProps) {
  const [showModal, setShowModal] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");

  const handleAction = () => {
    if (!isPaused) {
      if (confirmInput.trim().toUpperCase() === "PAUSE") {
        onToggle(true);
        setShowModal(false);
        setConfirmInput("");
      }
    } else {
      onToggle(false);
      setShowModal(false);
    }
  };

  return (
    <>
      {isPaused ? (
        <button
          type="button"
          onClick={() => onToggle(false)}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
        >
          <Play className="h-4 w-4 fill-white" />
          <span>Resume All Automations</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-critical-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-critical-700 transition"
        >
          <OctagonAlert className="h-4 w-4" />
          <span>Pause All Automations</span>
        </button>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-critical-500/40 bg-surface-elevated p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-critical-500">
              <div className="rounded-full bg-critical-500/20 p-2.5">
                <OctagonAlert className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-text-main">
                  Emergency Kill Switch Confirmation
                </h3>
                <p className="text-xs text-text-muted">
                  Halt all automated notifications, retries and scheduled tasks.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <p>
                This will immediately freeze all 12 active automation rules across the organization.
                Ongoing alerts will require manual commander intervention.
              </p>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="text-text-muted font-medium block">
                Type <span className="font-mono font-bold text-critical-400">PAUSE</span> to confirm:
              </label>
              <input
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder="PAUSE"
                className="w-full rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm text-text-main font-mono focus:outline-none focus:ring-2 focus:ring-critical-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-border-subtle pt-3">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setConfirmInput("");
                }}
                className="px-3.5 py-1.5 text-xs rounded-lg border border-border-subtle bg-surface-base text-text-muted hover:text-text-main font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={confirmInput.trim().toUpperCase() !== "PAUSE"}
                onClick={handleAction}
                className="px-4 py-1.5 text-xs rounded-lg bg-critical-600 font-bold text-white hover:bg-critical-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Execute Emergency Halt
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
