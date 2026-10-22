# ARDAC

Coding conventions for the Nuxt app live in `explorer/agents.md`. Read it before changing anything under `explorer/`.

## Check layout changes at 768px and 1023px

When a change touches templates, Bulma column or spacing classes, or SCSS, load the affected pages in the browser preview at **768px** and **1023px** wide and check that headings, subtitles and item text share the same left and right edges as the content above them.

These are the last widths before two Bulma breakpoints, and misalignment has slipped through review at both:

- **768px**: the last width before `$tablet` (769px). Below it, `columns` stack vertically, so per-column padding such as `pr-4` / `px-4` / `pl-4` puts stacked items at different left edges.
- **1023px**: the last width before `$desktop` (1024px). Below it, `.section` drops its side padding from 3rem to 1.5rem, so a heading with fixed margins (such as `mx-6`) ends up indented further than the content beside it.

Also glance at 375px (phone) and 1408px+ (`$fullhd`, where containers stop growing). Measure the edges with `getBoundingClientRect()` instead of judging from a screenshot: a 4px offset is easy to miss by eye.
