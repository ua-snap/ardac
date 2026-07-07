# ARDAC Explorer Agentic Coding Guide

Use this guide when generating or editing code for `explorer/` in the ARDAC repo. The goal is to produce code that looks native to this codebase rather than introducing generic Nuxt/Vue patterns.

## Core objective

Match the existing architecture first:
- Nuxt 3 SPA
- Composition API
- TypeScript
- Pinia stores
- Bulma + project SCSS
- Leaflet / Plotly via Nuxt plugins
- Metadata-driven item registry

Optimize for consistency with existing code over introducing new abstractions.

## Non-negotiable style rules
- Honor all conventions used in the editor configuration file.

## Architectural rules

### 1) Respect the registry-driven content model

ARDAC Explorer is built around a content registry:
- `assets/items.ts` is the canonical item catalog.
- Item pages resolve content components dynamically from the slug.
- Slugs map to global component names by converting kebab-case to PascalCase.

When adding a new item:
1. Add the slug to `types/slugs.d.ts`
2. Add any new tags to `types/tags.d.ts`
3. Add the item metadata to `assets/items.ts`
4. Add the item to the pre-render list in `nuxt.config.ts`
5. Create the content component in `components/global/` using PascalCase derived from the slug
6. Add placeholder for preview imagery and placeholder alt text if applicable, for the human developer to complete
7. Consider whether the item should be linked from bios / people content

Do not bypass this system with ad hoc route-specific metadata.

### 2) Keep pages thin; let stores and registries do the work

Pages in this repo are usually light orchestration layers:
- `pages/index.vue` mostly selects a layout and composes sections
- `pages/item/[slug].vue` resolves the component from the slug
- `pages/tag/[tag].vue` filters items and renders them in a grid

Do not put large amounts of remote-fetching logic directly into pages unless there is already a page-specific precedent.

### 3) Put shared state and remote fetching in Pinia stores

Shared data flow belongs in stores.
Follow the existing pattern:
- define stores with `defineStore('name', () => { ... })`
- keep state in `ref(...)`
- expose small functions for fetch / transform / lifecycle operations
- reset intermediate values before fetches when appropriate to prevent stale data from being shown in the UI
- read endpoints from runtime config or a centralized mapping

If a component needs remote data that could be reused or coordinated with other UI state, prefer a store over component-local fetch logic.

### 4) Use plugins to expose third-party libraries

This repo exposes browser-heavy libraries through Nuxt plugins and consumes them with `useNuxtApp()` or store/component imports that match the existing approach.

Do not invent a parallel wrapper pattern unless there is a strong repo-local reason.

## File placement rules

### New item content
Place new content components in:
- `components/global/<PascalCaseFromSlug>.vue`

Examples:
- `map-permafrost` -> `MapPermafrost.vue`
- `story-fire-prone-conditions` -> `StoryFireProneConditions.vue`

### Reusable item preview blocks
If you need an item card / summary block, reuse the existing patterns:
- `components/Item/Brief.vue`
- `components/Item/Text.vue`
- `components/Item/TextPicture.vue`

Do not create a new card variant.

### Stores
Put shared state in the existing store domains when possible:
- `stores/store.ts` for item catalog / filtering helpers
- `stores/data.ts` for remote data fetches
- `stores/map.ts` for Leaflet map lifecycle / layers / legends
- `stores/chart.ts` for chart titles, inputs, labels, and related state

Prefer extending an existing store over creating a new store with overlapping responsibility.

### Utilities
Use `utils/` for small, stateless helper functions:
- slug conversion / validation
- metadata helpers
- math / chart transforms
- domain-specific transforms that do not require app state

If logic needs reactive state or network calls, it probably belongs in a store instead.

## Component conventions

### Script block
Use:
```vue
<script lang="ts" setup>
```

Prefer concise Composition API code:
- `const props = defineProps<...>()`
- `const route = useRoute()`
- `const store = useStore()`
- `const foo = computed(() => ...)`
- `onMounted(...)`
- `onUnmounted(...)`
- `watch(...)` when reacting to store-driven changes

Do not reintroduce Options API patterns.

### Templates
Prefer:
- Prefer existing Bulma/project class patterns; avoid introducing one-off classes or inline styles unless necessary.
- `NuxtLink` for internal navigation
- explicit conditional rendering with `v-if` / `v-else`
- simple lists / sections over over-abstracted markup
- Use plain, semantic HTML for the page structure.
The templates in this repo are generally readable and direct. Preserve that quality.

### Styling
Add no styling to the generated code.

## Content and metadata conventions

### Items
Each item entry should stay compact and descriptive:
- `slug`
- `title`
- `blurb`
- `tags`
- optional `image`
- optional `imageAlt`
- optional `priority`

Blurb text should remain short and plain. Do not add HTML to item blurbs. Blurbs should be written in a science communication, journalistic style, and not exceed 200 characters.

### Images and accessibility
If an item includes preview imagery, always include meaningful `imageAlt`.
If you add images in templates, supply `alt` text unless the image is purely decorative and the existing component pattern indicates otherwise.

### People / bios
If a new item is story-like, newly significant, or strongly associated with a data creator / subject-matter contributor, consider whether it should also be connected via:
- `assets/bios.ts`
- `types/people.d.ts`
- `/public/images/people`
- `pages/people.vue`
- `Bios` or `Bio` components

## Naming rules

- Slugs: kebab-case
- Global content components: PascalCase from slug
- Stores: `useXStore`
- Routes: rely on Nuxt file-based routing
- Variables / functions: follow the current codebase’s plain TS naming; prefer clear nouns and verbs over clever names

Do not invent inconsistent naming for the same concept across metadata, route params, and component names.

## Data-fetching rules

When adding a new dataset-driven view:
1. Add or extend the endpoint mapping in the relevant store
2. Build the request URL from runtime config + known path segments
3. Reset pending / previous state before fetch when appropriate
4. Capture error state in store-owned refs
5. Let the consuming component react to store state

Prefer the existing pragmatic fetch style over introducing a larger client layer unless the repo already moves in that direction.

## Map and chart rules

### Maps
Map lifecycle belongs in the map store.
Components should typically:
- create the map on mount
- destroy the map on unmount
- keep the component wrapper minimal

Do not let many different components each create their own custom Leaflet bootstrapping path unless that is unavoidable.

### Charts
Chart titles and input/label state already have store-level helpers.
When adding a chart:
- reuse chart-store title conventions
- follow existing selector / control patterns
- keep presentation in the component and reusable chart state in the store or utility layer
- reference existing implemenations extensively to keep the same code style between different chart implementations

## Page patterns to copy

### Home page
Never edit the home page.

### Item page
Resolve dynamic content from the slug.

### Tag page
Filter from the item registry, then render grid content from the filtered list.
Do not hardcode duplicated tag collections if the registry already knows the relationship.

## Testing rules

This repo uses Playwright for browser-level verification.
When adding or changing user-facing behavior:
- prefer end-to-end tests that exercise the real UI
- use explicit navigation and selector assertions
- verify the key visible outputs for a user flow
- keep tests aligned with existing naming and structure in `tests/test-suite.spec.js`

If your change affects a route, item page, tag page, chart visibility, map behavior, or a place-selection flow, consider adding or updating a Playwright scenario.

## What not to do

- Do not switch to Options API
- Do not introduce code that is not controlled the editor config dotfile.
- Do not add a new CSS framework
- Do not write any CSS, add any class names to elements, or write any SCSS.
- Do not bypass the item registry with one-off hardcoded content structures
- Do not add a parallel fetch/client architecture unless there is a repo-wide decision to do so
- Do not create new item preview/card types casually
- Do not move shared map/chart/data logic out of stores into random components
- Do not add HTML to item blurbs
- Do not break the slug -> type -> item metadata -> global component convention

## Preferred implementation checklist for new work

Before writing code, ask:
1. Is this an item/catalog/content change, a page change, a store change, or a utility change?
2. Does the registry (`assets/items.ts` + `types/*.d.ts`) need updating?
3. Should this behavior live in an existing store?
4. Is there already a component pattern I can copy?
5. Should I add or update a Playwright test?

## Golden rule

When in doubt, copy an existing nearby pattern from this repo and make the smallest possible change that fits naturally into:
- the registry model
- the Pinia store model
- the slug-driven routing/content model

