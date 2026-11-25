# BASELINE: Crisis AI Pilot (THE KEEP LIST)

Every route, feature, and mechanism in this document was verified on 25 Nov 2026.
Under **Golden Rule 1 (Do No Harm)**, everything in this list must remain fully functional throughout all audit, theme, and enhancement stages.

## 1. Verified Working Routes (HTTP < 400, Zero Console Errors)

| Route | Scope | Baseline Screenshot | Status |
|---|---|---|---|
| `/en/app` | Command Center (English) | `audit/baseline/command-center-en.png` | ✅ KEEP |
| `/ar/app` | Command Center (Arabic RTL) | `audit/baseline/command-center-ar.png` | ✅ KEEP |
| `/en/app/incidents` | Incident List & Multi-Views | `audit/baseline/incidents-en.png` | ✅ KEEP |
| `/ar/app/incidents` | Incident List (Arabic RTL) | `audit/baseline/incidents-ar.png` | ✅ KEEP |
| `/en/app/incidents/inc-2026-001` | Incident Command Room (EN) | `audit/baseline/incident-room-en.png` | ✅ KEEP |
| `/ar/app/incidents/inc-2026-001` | Incident Command Room (AR) | `audit/baseline/incident-room-ar.png` | ✅ KEEP |
| `/en/app/incidents/new` | Incident Activation Wizard | `audit/baseline/incident-new-en.png` | ✅ KEEP |
| `/en/app/notifications` | Multi-Gateway Delivery Hub | `audit/baseline/notifications-en.png` | ✅ KEEP |
| `/en/app/approvals` | Human-in-the-Loop Sign-Off | `audit/baseline/approvals-en.png` | ✅ KEEP |
| `/en/app/plans` | Continuity Playbooks | `audit/baseline/plans-en.png` | ✅ KEEP |
| `/en/app/sites` | Critical Assets & Locations | `audit/baseline/sites-en.png` | ✅ KEEP |
| `/en/app/risks` | Risk Matrix & Treatment | `audit/baseline/risks-en.png` | ✅ KEEP |
| `/en/app/continuity/bia` | Business Impact Analysis | `audit/baseline/bia-en.png` | ✅ KEEP |
| `/en/app/continuity/functions` | Critical Functions Registry | `audit/baseline/functions-en.png` | ✅ KEEP |
| `/en/app/continuity/recovery` | Disaster Recovery Strategies | `audit/baseline/recovery-en.png` | ✅ KEEP |
| `/en/app/drills` | Preparedness Exercises | `audit/baseline/drills-en.png` | ✅ KEEP |
| `/en/app/compliance` | ISO 22301 & NCEMA Matrix | `audit/baseline/compliance-en.png` | ✅ KEEP |
| `/en/app/audit` | Cryptographic Ledger | `audit/baseline/audit-en.png` | ✅ KEEP |
| `/en/app/documents` | Document Hub & Plan Extraction | `audit/baseline/documents-en.png` | ✅ KEEP |
| `/en/app/automations` | Rule Engine & Escalations | `audit/baseline/automations-en.png` | ✅ KEEP |
| `/en/app/integrations` | SCADA & Carrier Connectors | `audit/baseline/integrations-en.png` | ✅ KEEP |
| `/en/app/reports` | Executive Reporting Analytics | `audit/baseline/reports-en.png` | ✅ KEEP |
| `/en/app/reports/print/inc-2026-001` | Report Print Page (EN) | `audit/baseline/reports-print-en.png` | ✅ KEEP |
| `/ar/app/reports/print/inc-2026-001` | Report Print Page (AR Shaped) | `audit/baseline/reports-print-ar.png` | ✅ KEEP |
| `/en/app/settings` | White-Label & Gateways | `audit/baseline/settings-en.png` | ✅ KEEP |
| `/en/app/templates` | Broadcast Templates | `audit/baseline/templates-en.png` | ✅ KEEP |
| `/en/app/triggers` | Ingestion Triggers | `audit/baseline/triggers-en.png` | ✅ KEEP |
| `/en/app/people` | Responders Directory | `audit/baseline/people-en.png` | ✅ KEEP |
| `/en/app/lessons` | Post-Incident Reviews | `audit/baseline/lessons-en.png` | ✅ KEEP |
| `/en/app/wall` | Emergency Wall Display | `audit/baseline/wall-en.png` | ✅ KEEP |
| `/en/app/focus` | Crisis Focus Mode | `audit/baseline/focus-en.png` | ✅ KEEP |
| `/en/app/data` | Import / Export Center | `audit/baseline/data-en.png` | ✅ KEEP |
| `/en/app/status-page` | Status Page Administration | `audit/baseline/status-page-en.png` | ✅ KEEP |
| `/en/owner` | Multi-Tenant Console | `audit/baseline/owner-en.png` | ✅ KEEP |
| `/en/r` | Responder Mobile PWA (EN) | `audit/baseline/responder-r-en.png` | ✅ KEEP |
| `/ar/r` | Responder Mobile PWA (AR) | `audit/baseline/responder-r-ar.png` | ✅ KEEP |
| `/en/portal` | Stakeholder Portal (EN) | `audit/baseline/portal-en.png` | ✅ KEEP |
| `/ar/portal` | Stakeholder Portal (AR) | `audit/baseline/portal-ar.png` | ✅ KEEP |
| `/en/status/gulf_water` | Public Citizen Status Page | `audit/baseline/status-public-en.png` | ✅ KEEP |
| `/en/login` | Existing Login Route | `audit/baseline/login-en.png` | ✅ KEEP |

## 2. Core Functional Mechanisms on the KEEP List
1. **Live Cross-Tab BroadcastChannel (`demoSync`)**:
   - `DELIVERY_ACKNOWLEDGED` message sent from `/r` immediately increments ack counter in `/app/incidents/[id]` within 2s without full page refresh.
2. **Arabic Typography & PDF Shaping**:
   - High-fidelity letter connections and ligatures via IBM Plex Sans Arabic in DOM, rendered to multi-page A4 PDF via `html2canvas` + `jsPDF`.
3. **Cryptographic SHA-256 Audit Chain**:
   - 1,248 sequential blocks with genesis block validation, tamper injection test, and integrity verification.
4. **Presenter Simulation Engine**:
   - Acceleration (1x..300x), 6 failure injections, Guided 8-minute demo coach card, and `?demo=fresh` instant factory seed restore.
5. **Real Export Engine**:
   - UTF-8 BOM CSV, XLSX, JSON, RFC-5545 ICS calendar event, DOCX OpenXML, and 5-file Evidence ZIP with SHA-256 manifest.
6. **Bilingual Parity**:
   - Complete key parity between `messages/en.json` and `messages/ar.json`, RTL logical CSS classes only, no physical left/right.
