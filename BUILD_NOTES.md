# Crisis AI Pilot — Build Notes & Architectural Decisions

This document tracks all design decisions, architectural choices, and simplifications made during the complete build execution.

## Design Decisions
1. **Interactive Data Views**:
   - `DataTable`: TanStack Table with multi-sorting, filtering, density toggle, column chooser, pagination, and virtual-ready design.
   - `MapPanel`: High-performance SVG-based Leaflet-compatible interactive map for Oman/GCC sites with pins, status pulse, and coordinates.
   - `Charts`: Pure, high-performance responsive SVG charts matching the Okabe-Ito color-blind safe palette to avoid heavy canvas initialization overhead and guarantee instant SSR/RTL compliance.
   - `KanbanBoard`: Multi-lane Drag/Drop compatible status columns with WIP limits and priority score indicators.
2. **Design Tokens & Logical Classes**:
   - Strictly logical Tailwind CSS classes (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`, `border-s-`, `border-e-`, `rounded-s-`, `rounded-e-`).
   - Zero raw hex in all UI components — strictly using defined CSS variables.
3. **Repository Pattern (Section 16)**:
   - All components interact with `useRepo()` backed by `lib/repo/index.ts` and comprehensive seed data in `seed/` and IndexedDB (Dexie).
4. **Native Arabic Letter Shaping in PDF Reports (F1.1)**:
   - Generating PDF directly from raw character streams in JavaScript fails to apply OpenType/HarfBuzz glyph substitution and cursive joining.
   - Built a dedicated HTML print route (`/[locale]/app/reports/print/[id]`) with print CSS and embedded IBM Plex Sans Arabic font. The browser shapes all Arabic ligatures and connections natively. Captured with `html2canvas` + `jsPDF` for multi-page A4 export, alongside native `window.print()` fallback.
5. **Cross-Tab Live Synchronization & Presenter Phone Preview (F1.2)**:
   - Built `lib/engine/sync.ts` using `BroadcastChannel('crisis-demo')` and Dexie `liveQuery` listeners. When a responder taps "I'm safe" in `/r`, the Incident Room ack count updates within 2 seconds without full page reload.
   - Presenter persona has a split "Responder Phone Preview" embedding `/r` in an iPhone frame (390×844) for single-screen executive demos.
6. **Clean Demo Start & Reset Engine (F1.3)**:
   - Added `?demo=fresh` URL handling that resets Dexie and in-memory stores to factory baseline and broadcasts `RESET_DEMO` across tabs.
7. **Guided 8-Minute Executive Demo Coach Card (F3.1)**:
   - Floating coach card walks through the 8-minute demonstration script step-by-step with next-click guidance and strategic value propositions in both English and Arabic.
8. **Export Suite & Cryptographic Evidence Pack (F2.4)**:
   - Supports CSV (UTF-8 BOM), XLSX, JSON, RFC-5545 ICS calendar events, DOCX OpenXML, and full evidence ZIP with SHA-256 manifest.
9. **RTL, Numerals, Hijri Dates & CLDR 6 Arabic Plural Forms (F2.7)**:
   - Implemented `lib/engine/rtl.ts` providing Arabic-Indic numeral conversion, Umm al-Qura Hijri date formatting, `<bdi>` directional isolation, and complete 6 Arabic plural forms (zero, one, two, few, many, other).
10. **Zero Placeholders & Full Seed Data (F3.4 & F2.5)**:
    - 248 people, 8 playbooks, 9 incidents, 60 tasks, 10 critical functions, 24 risks, 7 drills, 40 documents, 1,248 audit rows, 1,800 delivery attempts, 3 pending approvals, 12 automation rules, 3 import batches, and 10 compliance items.
