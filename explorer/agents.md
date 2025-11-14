# ARDAC Explorer Agent Guide

## Project Snapshot
- Nuxt 3 SPA using Composition API + TypeScript with Pinia for state, Plotly for charts, and Leaflet for maps.
- SSR is disabled; builds rely on client-side plugins and a prerender list for key routes.
- Styling combines Bulma, project SCSS, and Leaflet assets.$$

## Architecture
- Layouts assemble the shared shell (Header, Navbar, Tagbar, Footer) around routed content.
- Domain narratives live in `components/global`, named in PascalCase derived from each item slug.
- Static catalogue metadata sits in `assets/items.ts`, mirrored by global TypeScript definitions in `types`.
- Plugins expose third-party libraries through `useNuxtApp()` so components stay framework-friendly.

## State & Data Flow
- Pinia stores own remote calls (for example `useDataStore.fetchData`), reset intermediate state, and rely on `runtimeConfig` URLs.
- Place, map, and chart stores expose `ref`-backed state that components consume via `storeToRefs`.
- Components watch store-derived refs to trigger fetches and tear down data on unmount to avoid stale payloads.

## Component Patterns
- Use `<script setup lang="ts">`, declare props with interfaces, and share control state via `defineModel` when wrapper/controls pairs collaborate.
- Prefer `computed` getters for derivations and early-return to guard against missing data.
- Keep watchers focused on side-effects (fetching, rebuilding charts) and group dependencies in array form.
- Always present fallbacks (notifications, empty states) when upstream data or user selections are absent.

## Visualization Patterns
- Plotly charts assemble trace arrays in dedicated builders and re-render via watchers while reusing shared color/config constants.
- Heavy statistical lifting lives in `utils/era5WrfStatistics.ts`, keeping SFCs focused on presentation.
- Controls surface climatology, percentile bands, and extremes toggles with guardrails enforced by composables.

## Mapping Patterns
- Leaflet wiring is centralized in `useMapStore`, covering CRS setup, layer toggling, legends, and lifecycle cleanup.
- Map-aware components defer DOM-dependent work with `nextTick` and dispose map instances on unmount.

## Styling & UX
- Global SCSS imports Bulma and Leaflet styles, with overrides in `assets/styles`.
- Component styles default to scoped rules that augment Bulma classes.
- Accessibility aids include alt text alongside catalogue imagery and informative messaging for missing selections.

## Content & Types
- Adding catalogue items means updating slug/tag unions in `types`, appending entries in `assets/items.ts`, and creating a matching global component.
- Bios, notebooks, and other structured narratives follow the recipes documented in the README.

## Utilities & Composables
- Shared logic moves into utilities or composables with concise doc blocks summarizing intent and safeguards.
- Composables stay side-effect free except for explicitly managed handlers (e.g., checkbox validation).

## Testing & QA
- Automated tests are absent; rely on manual spot checks of charts, maps, and fetch error paths.
- Verify both success and failure flows whenever touching API or visualization code.

## Development Workflow
- Use `nvm use lts/hydrogen` before `npm install`; start locally with `npm run dev`.
- Configure `SNAP_API_URL`, `GEOSERVER_URL`, and `RASDAMAN_URL` when pointing at non-default services.
- Production builds come from `npm run generate` with S3 deployment and CloudFront cache invalidation as outlined in the README.

## General Guidance
- Always beware the "complexity demon"
- Keep long-term maintenance considerations in mind
- Have a touch of "Grug-brain" sensibility, but don't go overboard with it.
- Always format with `prettier`
- Principles: KISS, YAGNI