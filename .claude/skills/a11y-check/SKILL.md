---
name: a11y-check
description: Check the ARDAC Explorer for WCAG 2.1 AA accessibility problems with pa11y-ci plus the manual checks a scanner can't do. Use before opening a PR that changes templates, components, styles, charts, maps or item content, when asked to audit or check accessibility (a11y), or when a reviewer reports pa11y errors.
---

# Accessibility check for the Explorer

The site targets WCAG 2.1 Level AA. The rules for writing accessible markup are
in `explorer/agents.md` under "Images and accessibility"; this skill is how to
check the result. An automated scan finds roughly a third of real problems, so
always do both parts: the pa11y-ci scan and the manual pass.

## 1. Get the site running

- The dev server must be serving the branch under test on port 3000. Start it
  with the `explorer` preview configuration (or `npm run dev` in `explorer/`).
- If styles fail to compile right after switching branches, `node_modules` is
  probably from another branch's lockfile (for example a different Bulma
  version). Run `npm install` in `explorer/` and restart the server. Tell the
  user, since it changes their install.

## 2. Run pa11y-ci

pa11y-ci is a global install, not a project dependency. Check with
`pa11y-ci --version`. If it's missing, ask the user to run
`npm install -g pa11y-ci` (it downloads its own Chromium) rather than installing
it yourself.

With nvm, a global install belongs to the Node version that was active when it
was installed. Run `nvm use` in `explorer/` first so pa11y-ci runs under the
project's Node 24 from `.nvmrc`; if it's missing there, it was installed under
another version.

If it fails with `Could not find Chrome (ver. ...)`, Puppeteer's own Chrome
wasn't downloaded. Either point it at an installed Chrome with
`PUPPETEER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"`
(macOS path), or ask the user to run `npx puppeteer browsers install chrome`.

Run from `explorer/`. The config in `explorer/.pa11yci.cjs` builds the URL list
from `assets/items.ts` (home, about, people, every tag, every item), so there is
no list to maintain.

- Whole site (93 pages at the time of writing, a few minutes):
  `pa11y-ci`
- Only the pages you touched:
  `PA11Y_PATHS=/item/story-cold-snap-1989,/about pa11y-ci`
- Another server: `PA11Y_BASE_URL=http://localhost:3001 pa11y-ci`
- Machine-readable output for comparing runs: add `--json`.

Run it in the background for the whole site. The default rule set is
HTML_CodeSniffer at WCAG2AA, which is what reviewers on this repo use, so keep
it unless asked otherwise.

To show what a change fixed, run the same scan on `main` and on the branch and
report the per-page error counts side by side.

## 3. Fix what it finds

Read each error's selector and HTML snippet, find the component (the
`data-v-inspector` attribute in dev builds names the file and line), and fix the
source. Patterns seen on this site:

| pa11y message | Usual cause here | Fix |
|---|---|---|
| Link points to a named anchor that doesn't exist | Placeholder `href="#..."` in a story component | Point it at a real `id` on the page, or use `NuxtLink` for another page |
| Insufficient contrast | Bulma `is-light` variants, grey helper text | Darken the color in `assets/styles/main.scss` and recheck the ratio (4.5:1 for text) |
| Anchor with no link content and no name | Plotly modebar buttons, icon-only links | Charts: make sure the chart is drawn with `$Plotly.newPlot`, which goes through `plugins/plotly.client.ts`. Icon links: add an `aria-label` |
| Form control has no label | Selects and inputs in chart controls | `<label for>` matching a unique `id` |
| Heading levels skipped | `h2` followed by `h4` | Follow the outline in `agents.md`; size with Bulma classes |

Don't silence a rule or drop a page from the scan to get to zero. If something
can't be fixed (third-party markup we don't control, for example), say so in the
PR with the reason.

## 4. Manual pass

pa11y only sees each page as it first loads. Most item pages draw their charts
and controls only after a place is picked, so the scan never sees them. Check
these by hand in the browser, on the pages you changed:

- **After picking a place:** on item pages with place search, choose a place
  and check that charts render, chart download buttons have a name and are
  reachable by Tab, and selects/radios are labeled.
- **Keyboard:** Tab through the page from the top. The skip link appears
  first, focus is always visible, nothing is clickable but unreachable, and
  focus moves to "Pick a new place" after choosing one.
- **Text alternatives:** alt text describes what the image shows (not just its
  filename), decorative images use `alt=""`, and charts have a descriptive
  Plotly title, since that title becomes their accessible name.
- **Reflow:** at 320px wide there is no horizontal scrolling and the mobile
  menu opens.
- **Colors:** chart series and map palettes aren't covered by any of this.
  Note it in the PR if you changed them.

The Playwright suite has one accessibility test ("Check accessibility basics"
in `explorer/tests/test-suite.spec.js`). Run `npx playwright test` from
`explorer/`, and extend that test when a fix is worth guarding.

## 5. Report

In the PR description or reply to the reviewer, include:

- pa11y-ci per-page error counts before and after (or just the remaining
  errors, with selectors, if any are left).
- What you checked by hand and on which pages.
- Anything not fixed and why.
