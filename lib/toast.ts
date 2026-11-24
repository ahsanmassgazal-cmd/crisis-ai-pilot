// Global toast notification utility for browser sandbox

export interface ToastOptions {
  title?: string;
  description?: string;
  tone?: "brand" | "critical" | "rose" | "amber" | "emerald" | "normal";
}

type ToastInput = string | ToastOptions;

let toastTimeout: NodeJS.Timeout | null = null;

export function showToast(input: ToastInput) {
  if (typeof window === "undefined") return;

  const title = typeof input === "string" ? input : input.title || "";
  const description = typeof input === "object" ? input.description || "" : "";
  const tone = typeof input === "object" ? input.tone || "brand" : "brand";

  // Dispatch custom browser event for toast listeners
  const event = new CustomEvent("crisis:toast", {
    detail: { title, description, tone, timestamp: Date.now() },
  });
  window.dispatchEvent(event);

  // Render floating transient toast element in DOM if not present
  let toastContainer = document.getElementById("crisis-floating-toast");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "crisis-floating-toast";
    toastContainer.className =
      "fixed bottom-5 end-5 z-50 flex flex-col gap-2 max-w-sm transition-all duration-300 pointer-events-none";
    document.body.appendChild(toastContainer);
  }

  const toastItem = document.createElement("div");
  const bgClass =
    tone === "critical" || tone === "rose"
      ? "bg-rose-900 border-rose-700 text-white"
      : tone === "amber"
      ? "bg-amber-900 border-amber-700 text-white"
      : tone === "emerald"
      ? "bg-emerald-900 border-emerald-700 text-white"
      : "bg-slate-900 border-slate-700 text-white";

  toastItem.className = `p-3 rounded-card border shadow-lg text-xs pointer-events-auto flex flex-col gap-0.5 animate-in fade-in slide-in-from-bottom-2 duration-200 ${bgClass}`;

  const titleEl = document.createElement("div");
  titleEl.className = "font-bold";
  titleEl.textContent = title;
  toastItem.appendChild(titleEl);

  if (description) {
    const descEl = document.createElement("div");
    descEl.className = "text-[11px] opacity-80";
    descEl.textContent = description;
    toastItem.appendChild(descEl);
  }

  toastContainer.appendChild(toastItem);

  setTimeout(() => {
    toastItem.classList.add("opacity-0", "transition-opacity", "duration-300");
    setTimeout(() => {
      if (toastItem.parentNode) {
        toastItem.parentNode.removeChild(toastItem);
      }
    }, 300);
  }, 3500);
}
