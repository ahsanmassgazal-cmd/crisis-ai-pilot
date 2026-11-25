# Crisis AI Pilot — Fix & Implementation Plan (Stage 2)

**Branch:** `audit-fix`  
**Baseline Git Tag:** `baseline-before-audit-20261125` (`73f978d`)  
**Target Live URL:** `https://crisis-ai-pilot.sigmamaxaisolutions.com`

---

## 1. Classification of All Items

### KEEP (Must NOT be broken or altered)
1. **Dexie IndexedDB Engine & Client-Side Repository (`lib/repo/`):** Full offline-capable repository architecture with schema versioning.
2. **Bilingual i18n & Next-Intl Architecture (`i18n/`, `messages/en.json`, `messages/ar.json`):** Strict bidirectional layout support (`dir="ltr"` / `dir="rtl"`), IBM Plex Sans Arabic font, zero hard-coded strings.
3. **Cryptographic Immutable Audit Ledger (`lib/engine/audit.ts`):** 1,248 verified SHA-256 hash-chained audit rows with genesis hash validation.
4. **BroadcastChannel Real-Time Multi-Tab Sync (`lib/engine/sync.ts`):** Synchronization across Commander, Responder, and Stakeholder tabs in the same browser.
5. **Print & PDF Generation (`app/[locale]/(workspace)/app/reports/print/[id]`):** Browser-rendered HTML-to-canvas-to-PDF report generation with correct Arabic text shaping.
6. **All 40 Workspace Routes:** 40/40 working routes verified in baseline smoke suite.

---

### FIX (Existing components requiring modification)
1. **Theme Tokens (`app/globals.css`, `tailwind.config.ts`):**
   - *Current:* Purple `#6D28D9` and generic dark background.
   - *Target:* Degree AI Command Navy (`#1B2A41`) as deep primary, Signal Orange (`#E8662C`) as secondary/action accent, Pure Red (`#DC2626`) strictly reserved for Critical/P1 alerts. Light background `#F7F8FA`, surface `#FFFFFF`, ink `#1B2A41`. Dark background `#0B111C`, surface `#151F30`, primary `#F08A55`, accent `#7FA0CC`. Default theme: Light for all visitors.
   - *Risk:* Low. Pure CSS variable changes with 100% token coverage.
2. **Root Routing (`next.config.mjs`, `app/[locale]/page.tsx`):**
   - *Current:* Redirects `/` directly to `/en/app`.
   - *Target:* Degree AI two-card landing page at `app/[locale]/page.tsx` with "Explore Demo" and "Sign In". Remove direct redirects from `next.config.mjs`.
   - *Risk:* Low.
3. **Demo Banner & TopBar (`components/layout/PersistentBanners.tsx`, `components/layout/TopBar.tsx`):**
   - *Current:* Shows demo alert without action buttons.
   - *Target:* "Demo · sample data · try anything" with "Reset Demo" button and "Book a Call" link pointing to `https://sigmamaxaisolutions.com/contact`.
   - *Risk:* Low.
4. **Automation Drama & Responders Drama (`seed/data.ts`, `seed/expanded.ts`):**
   - *Current:* All 12 automations enabled with 100% success.
   - *Target:* Exactly 11/12 automations active, 1 rule showing intentional demo drama ("SMS Route A failover active"), and 3 unreached responders marked.
   - *Risk:* Low.
5. **Clean Comment in `lib/repo/types.ts`:**
   - *Target:* Remove reference to `Supabase` to enforce complete ban on infra jargon.
   - *Risk:* Zero.

---

### ADD (New files and capabilities)
1. **Centralized Contact Configuration (`lib/config/siteContact.ts`):**
   - Email: `ahsansigmamaxai@gmail.com`
   - Website: `https://sigmamaxaisolutions.com`
   - WhatsApp: `""` (empty)
2. **Bilingual Landing Page (`app/[locale]/page.tsx`):**
   - Hero: "Autonomous Crisis Management & Continuity Command" (Bilingual EN/AR).
   - Card 1: "Explore Demo Workspace" (Badge: "Public showcase · No login needed", 3 key features, button opens `/app`).
   - Card 2: "Sign In to Workspace" (Badge: "Authorised team only", 3 key features, button opens `/[locale]/login`).
   - Privacy guarantee section ("Your data stays private: Real workspaces and public demo run in completely isolated environments").
   - Branded footer with links and contact modal.
3. **Real Workspace Login Page (`app/[locale]/(auth)/login/page.tsx`):**
   - Clean, professional authentication form supporting 4 real roles:
     - Platform Owner: `owner@sigmamaxaisolutions.com` / `CrisisPilot2026!Owner`
     - Crisis Manager: `manager@sigmamaxaisolutions.com` / `CrisisPilot2026!Mgr`
     - Responder: `responder@sigmamaxaisolutions.com` / `CrisisPilot2026!Resp`
     - Stakeholder: `stakeholder@sigmamaxaisolutions.com` / `CrisisPilot2026!Stake`
   - Role guard protecting `/owner`, `/r`, and `/portal` when in real workspace mode.
4. **Credential Persistence Files:**
   - Gitignored `ACCESS_CREDENTIALS.txt` in project root.
   - Appended to `%USERPROFILE%\Downloads\SigmaMax_Access\SigmaMax_ALL_Access_Credentials.txt`.
5. **Expanded Datasets (`seed/expanded.ts`):**
   - 40 Sites: Muscat, Sohar, Salalah, Nizwa, Sur, Duqm, Khasab, Buraimi, Dubai, Abu Dhabi, Riyadh, Jeddah, Dammam, Doha, Manama, Kuwait City, London, Houston, Rotterdam, Singapore, Tokyo, Sydney, Frankfurt, Paris, Amsterdam, Calgary, Aberdeen, Perth, Stavanger, Jubail, Yanbu, Ras Laffan, Ruwais, Jebel Ali, Mina Al Fahal, Qalhat, Barka, Ghubrah, Wadi Dayqah, Suwaiq.
   - 30 Playbooks: Full spectrum from SCADA/OT Cyber, Supply Chain, Cyclone, Desalination Contamination, Power Blackout, CBRN, Port Logistics, to Cloud Outage.
   - 12 Drills: 12 months history of announced, unannounced, and tabletop exercises.
6. **Favicon & OpenGraph Metadata (`app/icon.svg`, `app/opengraph-image.tsx`):**
   - High-resolution SVG favicon and dynamic OpenGraph card in Command Navy and Signal Orange.

---

### OWNER DECISION
- No items require owner pause or escalation. All architectural choices strictly conform to Master Spec v1.0 and Project Card #16 requirements.

---

## 2. Execution Groups (Stage 3 Breakdown)

### Group A: Access Structure & Landing Page
- Build `app/[locale]/page.tsx` (Degree AI two-card layout).
- Update `next.config.mjs` to remove direct redirect.
- Create `lib/config/siteContact.ts`.
- Build `app/[locale]/(auth)/login/page.tsx`.
- Secure `/owner`, `/r`, `/portal` with workspace auth state.
- Create `ACCESS_CREDENTIALS.txt` and append to master credentials file.
- Update demo banner with "Reset Demo" and "Book a Call".
- *Verification:* Lints + build + login test + landing page test.
- *Git Commit:* `feat: implement landing page, auth separation and demo banners (Group A)`

### Group B: Demo Data Expansion (Spec & Card #16)
- Expand `EXPANDED_SITES` to 40 sites with realistic GCC/global coordinates.
- Expand `EXPANDED_PLANS` to 30 crisis playbooks.
- Expand `EXPANDED_DRILLS` to 12 drills spanning 12 months.
- Configure 11/12 active automations with 1 intentional drama failure.
- Ensure 3 unreached responders are marked.
- Update `test/eval/seed-spec23.test.ts` to assert new counts.
- *Verification:* `npm run eval` passes 100%.
- *Git Commit:* `feat: expand demo data to 40 sites, 30 plans, 12 drills and intentional drama (Group B)`

### Group C: Brand Theme & Degree AI Styling
- Update `app/globals.css` with Command Navy `#1B2A41` + Signal Orange `#E8662C`.
- Update `tailwind.config.ts`.
- Enforce default light theme in `app/[locale]/layout.tsx`.
- Reserve pure red `#DC2626` strictly for Critical/P1 alerts.
- *Verification:* `npm run lint:tokens` + visual checks.
- *Git Commit:* `style: apply Degree AI theme tokens navy and orange with light default (Group C)`

### Group D: Devices & Readability
- Verify 6 viewports with Playwright.
- Ensure table containers have `overflow-x-auto` on mobile.
- Verify touch targets >= 44x44px.
- *Verification:* `npx playwright test test/e2e/viewport-audit.spec.ts`.
- *Git Commit:* `fix: responsive layout and mobile table scrolling (Group D)`

### Group E: Content Safety & Reliability Guards
- Clean `lib/repo/types.ts` comment.
- Add 5-second automatic fallback to data loaders.
- Run banned words audit across all files.
- *Verification:* Clean regex scan.
- *Git Commit:* `chore: enforce content safety and loader resilience (Group E)`

### Group F: Favicon, SEO & Bilingual Polish
- Add SVG icon in Navy/Orange (`app/icon.svg`).
- Add OpenGraph metadata card.
- Verify bilingual strings in `en.json` and `ar.json`.
- *Verification:* `npm run i18n:check` + `npm run build`.
- *Git Commit:* `feat: brand assets, favicon, OG metadata and i18n polish (Group F)`
