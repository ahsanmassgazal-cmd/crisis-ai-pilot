# Crisis AI Pilot — 8-Minute Executive Demo Script (Spec 26)
**Target URL:** `https://crisis-ai-pilot.sigmamaxaisolutions.com`
**Persona Flow:** Incident Commander → Presenter / Simulation → Responder → Executive Stakeholder → Multi-Tenant SuperAdmin

---

## Overview & Demo Architecture
This script walks through the complete, unscripted 8-minute sales demonstration. All state transitions run in the browser powered by IndexedDB (Dexie), Web Crypto SHA-256 hash chains, background job queue workers, and failover adapters.

| Time | Phase | Target Screen | Core Story & Key Clicks (EN / AR) |
|---|---|---|---|
| **0:00 - 1:15** | **Executive Overview** | `/en/app` (Command Center) | Active SEV1 alert banner, Attention Queue, Critical Functions status. Toggle Arabic (`/ar/app`) to demonstrate native RTL, logical typography, and zero layout shift. |
| **1:15 - 2:30** | **Incident Deep Dive** | `/en/app/incidents/inc-2026-001` | Incident Room: SLA countdown ring, affected sites (Sohar Plant), containment tasks, live timeline. |
| **2:30 - 3:45** | **Failure Injection & Failover** | Floating Presenter Panel (`Bottom-Start`) | Click **"Break SMS A (Failover)"** (`تعطيل مسار SMS الرئيسي`). Double-click **"Send Broadcast"**. Worker enforces idempotency (1 delivery created), primary route errors, delivery status switches to violet **"Failed Over"** to SMS Route B. |
| **3:45 - 4:45** | **Approval Gate & AI Copilot** | `/en/app/approvals` | Review pending bilingual broadcast. Attempting to dispatch unapproved message is refused by gate. Edit message resets approval to `pending`. Click **"Approve Broadcast"** (`اعتماد الإرسال`). |
| **4:45 - 5:45** | **Responder Experience (PWA)** | `/en/r` | Switch to mobile viewport. Active emergency card with Fitts's law touch targets. Click **"I'm Safe & Acknowledged"** (`أنا بأمان وتم تأكيد الاستلام`). Delivery status updates to `acknowledged` with timestamp and transmits to Command Center. |
| **5:45 - 6:30** | **Stakeholder Portal & Evidence Pack** | `/en/portal` | Calm, executive-facing portal. Shows approved update. Click **"Download Official Evidence ZIP"** (`تحميل حزمة الأدلة الرسمية`). Generates real ZIP containing `incident_summary.json`, `audit_ledger.csv` (UTF-8 BOM), and `manifest.json` with SHA-256 checksums. |
| **6:30 - 7:15** | **Multi-Tenant Founder Console** | `/en/owner` | View 4 live GCC tenants (`gulf_water`, `national_bank`, `city_hospital`, `ministry_services`). Open **"Provision New Tenant"** (`تهيئة مستأجر جديد`) 5-step wizard with live color & branding preview. |
| **7:15 - 8:00** | **Cryptographic Audit Chain & Tamper Detection** | `/en/app/audit` & Presenter Panel | Audit ledger shows 1,248 blocks with SHA-256 link. Presenter clicks **"Bit-Flip Block 1247"** (`حقن تحريف بالكتلة 1247`). Run **"Verify Cryptographic Chain"** (`التحقق من السلسلة المشفرة`). System detects broken chain and highlights exact block 1247. Click **"Reset Baseline"** (`استعادة الوضع الأصلي`). |

---

## Detailed Step-by-Step Click-Path

### Minute 0:00 — Command Center & Bilingual RTL
1. Open `https://crisis-ai-pilot.sigmamaxaisolutions.com/en/app`.
2. Observe:
   - **No login or access code required** (opens directly into Command Center).
   - Top Bar: **Role Picker** set to `Incident Commander`, Tenant set to `Gulf Water & Power Co.`
   - Top Banner: **SEV1 Active Incident** (`SCADA Network Anomaly & Sensor Desynchronization`).
   - Attention Queue: **3 items in "Now" lane** (breached SLA, pending approval, responder offline).
3. Switch language: Click **"العربية"** in the top bar.
   - Screen instantly pivots to `dir="rtl"`.
   - Text aligns to the right, numbers and phone formats stay LTR-isolated (`+968 0000 1001`), icons mirror correctly.
   - Switch back to English or remain in Arabic as preferred.

### Minute 1:15 — Incident Command Room
1. Click on **"INC-2026-001"** card or navigate to `/en/app/incidents/inc-2026-001`.
2. Demonstrate:
   - SLA Ring with elapsed time and remaining window.
   - Interactive Tabs: **Overview, Timeline, Tasks, Stakeholders, Comms, Audit**.
   - Tasks list showing assigned responders, priorities (P1-P4), and real-time status.

### Minute 2:30 — Presenter Failure Injection & Idempotency
1. Switch role to **"Presenter"** using Role Picker in Top Bar, or click the floating indigo badge in the bottom-start corner.
2. In the Presenter Panel:
   - Accelerate clock: Click **"5x"** or **"60x"**.
   - Failure Injection: Click **"Break SMS A (Failover)"** (`تعطيل مسار SMS الرئيسي`).
3. Navigate to `/en/app/notifications`:
   - Click **"Send Emergency Notification"** twice rapidly (simulating nervous double-click).
   - Observe: Exactly one delivery is registered due to SHA-256 idempotency key `sha256(incident:person:channel:version)`.
   - Observe Delivery State: Shows **"Failed Over"** in violet tone (`SMS Route B`), proving resilient multi-provider failover.

### Minute 3:45 — Approval Gate & AI Copilot
1. Navigate to `/en/app/approvals`.
2. Notice the pending evacuation statement for Sohar Maintenance Yard:
   - Badge: **"AI draft — needs approval"** in purple.
   - Trying to bypass approval is blocked by the dispatcher.
   - Click **"Approve"** (`اعتماد`): Status updates to `approved` and timestamp is recorded in the immutable audit ledger.

### Minute 4:45 — Responder PWA Experience
1. Open `/en/r` (or scan mobile QR code).
2. Large emergency card:
   - Emergency vibration & warning alert: `SCADA Telemetry Disruption — Evacuate Section 4`.
   - Tap **"I'm Safe & Acknowledged"** (`أنا بأمان وتم تأكيد الاستلام`).
   - Button confirms with green checkmark.
   - The Incident Command Room immediately receives the acknowledgment.
3. Tap on assigned task checkbox: marks task completed and syncs to command center.

### Minute 5:45 — Stakeholder Portal & Official Evidence Pack
1. Open `/en/portal`.
2. Stakeholder sees only approved briefings (filtered from raw tactical logs).
3. Click **"Download Official Evidence ZIP"** (`تحميل حزمة الأدلة الرسمية`).
4. Open the downloaded `.zip` file:
   - `incident_summary.json`
   - `audit_ledger.csv` (encoded with UTF-8 BOM `\uFEFF` for Excel Arabic support)
   - `deliveries_report.csv`
   - `chain_verification.json`
   - `manifest.json` with SHA-256 checksum of each file.

### Minute 6:30 — Multi-Tenant Founder Console
1. Navigate to `/en/owner`.
2. Demonstrates the startup founder view:
   - 4 client tenants with health metrics and active subscriptions.
   - Tenant switcher: Click **"Switch to Tenant"** to instantly manage another GCC organization.
   - Click **"Provision New Tenant"**:
     - Step 1: Legal Name EN/AR & Country.
     - Step 2: Primary Commander credentials.
     - Step 3: Brand accent color picker with real-time card preview.
     - Step 4: Tier package (Enterprise, Professional, Pilot).
     - Step 5: Review & Deploy.

### Minute 7:15 — Cryptographic Audit & Tamper Detection
1. Navigate to `/en/app/audit`.
2. Shows 1,248 blocks cryptographically linked from the genesis hash.
3. Click **"Verify Chain"**: returns 100% Valid (green).
4. Open Presenter Panel and click **"Bit-Flip Block 1247"** (`حقن تحريف بالكتلة 1247`).
5. Re-run **"Verify Chain"**:
   - System immediately detects mismatch and flags:
     `Bit-flip / data tampering detected at seq 1247. Expected hash ..., found ...`
6. Click **"Reset Baseline"** (`استعادة الوضع الأصلي`):
   - Restores the entire IndexedDB database back to default seed.
