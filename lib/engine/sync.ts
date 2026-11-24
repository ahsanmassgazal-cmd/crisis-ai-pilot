/**
 * Cross-tab live synchronization via BroadcastChannel('crisis-demo')
 * Enables Responder PWA changes to instantly propagate to Incident Commander Room in real-time.
 */

export type SyncMessage =
  | { type: "DELIVERY_ACKNOWLEDGED"; deliveryId: string; status: string; timestamp: string }
  | { type: "INCIDENT_UPDATED"; incidentId: string }
  | { type: "TASK_UPDATED"; taskId: string; status: string }
  | { type: "RESET_DEMO" }
  | { type: "AUDIT_APPENDED" };

class DemoSyncManager {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<(msg: SyncMessage) => void> = new Set();

  constructor() {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        this.channel = new BroadcastChannel("crisis-demo");
        this.channel.onmessage = (event) => {
          this.notify(event.data);
        };
      } catch (e) {
        console.warn("BroadcastChannel initialization warning:", e);
      }
    }
  }

  broadcast(message: SyncMessage) {
    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch (e) {
        console.warn("BroadcastChannel postMessage error:", e);
      }
    }
    // Also notify listeners in current window/tab
    this.notify(message);
  }

  subscribe(listener: (msg: SyncMessage) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(msg: SyncMessage) {
    this.listeners.forEach((listener) => {
      try {
        listener(msg);
      } catch (err) {
        console.error("Sync listener error:", err);
      }
    });
  }

  close() {
    if (this.channel) {
      try {
        this.channel.close();
      } catch {}
      this.channel = null;
    }
    this.listeners.clear();
  }
}

export const demoSync = new DemoSyncManager();
