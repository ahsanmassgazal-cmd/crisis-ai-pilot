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
