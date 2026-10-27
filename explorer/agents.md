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
4. Create the content component in `components/global/` using PascalCase derived from the slug
5. Add placeholder for preview imagery and placeholder alt text if applicable, for the human developer to complete
6. Consider whether the item should credit people (its `people` field in `assets/items.ts`)

`nuxt.config.ts` builds its pre-render list from `assets/items.ts`, so the item's page and any new tag pages are pre-rendered without another step. Do not add routes to it by hand.

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
- `sea-ice-concentration` -> `SeaIceConcentration.vue`
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
- The site uses Bulma 1. Its `tile` classes no longer exist: lay out with `columns` / `column`, and add the project's `stack` class to a column whose items should share its height.
- Bulma's Sass variables are set in `assets/styles/_bulma-setup.scss` (base variables such as fonts and colors) and at the top of `assets/styles/main.scss` (component variables such as heading weight). Check there before overriding a Bulma default somewhere else.
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
- `type`: `'community'` (a community-built dataset people can contribute to), `'explainer'` (a story or guide) or `'xray'` (a dataset to explore by place)
- `title`
- `blurb`
- `tags`
- optional `image`
- optional `imageAlt`
- optional `priority`

Blurb text should remain short and plain. Do not add HTML to item blurbs. Blurbs should be written in a science communication, journalistic style, and not exceed 200 characters.

### Images and accessibility
The site targets WCAG 2.1 Level AA. When adding or editing content:

- If an item includes preview imagery, always include meaningful `imageAlt`.
- If you add images in templates, always include an `alt` attribute: describe the image, or use `alt=""` if it is purely decorative.
- Headings follow the document outline, and their size comes from Bulma classes rather than the tag. The site name is the only `h1`. An item's title is `<h2 class="title is-3">`, its sections are `<h3 class="title is-4">`, and so on. Do not skip levels.
- Every form control needs a `<label>` whose `for` matches the control's `id`, and IDs must be unique on the page. Give a group of radio buttons `role="radiogroup"` and a label.
- Use `<button>` or a link for anything clickable. Do not put `@click` on a `div`, `li`, or `span` without also making it focusable and operable from the keyboard.
- Do not rely on color alone. Links in running text are underlined by the global styles, and text needs a 4.5:1 contrast ratio against its background.
- Charts get their accessible name from the Plotly layout title (see `plugins/plotly.client.ts`), so give every chart a descriptive title.
- Mark decorative emoji with `aria-hidden="true"`.

To check your changes, follow the `a11y-check` skill (`.claude/skills/a11y-check/SKILL.md` at the repo root): a pa11y-ci scan using `explorer/.pa11yci.cjs`, plus the manual checks a scanner can't do.

### People / bios
If a new item is story-like, newly significant, or strongly associated with a data creator / subject-matter contributor, consider whether it should credit people:
- List them in the item's `people` field in `assets/items.ts`, in the order the item credits them. This is the only place the link between people and items is recorded: the People page and the item page both read it.
- Show them on the item page with `<Bios slug="the-item-slug" />` at the end of its content component.

A new person also needs:
- an entry in `assets/bios.ts`, with a `role` (job title and organization) when known
- their name in `types/people.d.ts`
- a photo in `/public/images/people`

The People page lists everyone in `assets/bios.ts` automatically.

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

