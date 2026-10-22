# ARDAC

Coding conventions for the Nuxt app live in `explorer/agents.md`. Read it before changing anything under `explorer/`.

## Check layout changes on both sides of every breakpoint

When a change touches templates, Bulma column or spacing classes, or SCSS, check every affected page at each of these widths, not only at phone and desktop sizes:

| Width | Why |
|---|---|
| 375 | Phone. |
| 768 / 769 | `$tablet`. At 768 `columns` stack; at 769 they sit side by side at their narrowest. |
| 1023 / 1024 | `$desktop`. `.section` side padding grows from 1.5rem to 3rem and `.container` gets a max width. |
| 1215 / 1216 | `$widescreen`. |
| 1407 / 1408 | `$fullhd`. Containers stop growing. |

The "mid" widths between 769 and 1215 are where layouts break most often, and two bugs reached review there:

- **Misalignment (#303).** Stacked items got different left edges from per-column padding (`pr-4` / `px-4` / `pl-4`), and headings with fixed margins (`mx-6`) sat 24px further in than the content below them under 1024px.
- **Spill (#302).** On tag pages, the Community card's image is a grid item with `aspect-ratio`. When the item stretched to the height of the text beside it, its width became twice that height, so the image and text spilled out of the card from 769 to 1215px. `align-self: start` fixed it. Watch for the same thing whenever `aspect-ratio` is used inside a grid or flex row.

Measure; don't judge from screenshots. A 4px offset or a slight spill is easy to miss by eye, so run this in the browser preview on the page being checked. For each width it loads the page in an iframe that wide and reports horizontal scrolling and any element that sticks out of its card or section (edit `boxes` to name the containers that matter):

```js
const boxes = '.community, .frontpage-section-wrapper, .section > .container';
const out = [];
for (const w of [375, 768, 769, 1023, 1024, 1215, 1216, 1407, 1408]) {
  const f = Object.assign(document.createElement('iframe'), { src: location.href });
  f.style.cssText = `position:absolute;top:0;width:${w}px;height:900px;visibility:hidden`;
  document.body.append(f);
  await new Promise(r => (f.onload = r));
  await new Promise(r => setTimeout(r, 1500)); // let the SPA render and images load
  const d = f.contentDocument;
  const spill = [...d.querySelectorAll(boxes)].flatMap(box => {
    const b = box.getBoundingClientRect();
    // Bulma's .columns / .column use negative margins on purpose, so skip them.
    return [...box.querySelectorAll('*:not(.columns, .column)')]
      .filter(e => { const r = e.getBoundingClientRect(); return r.width && (r.left < b.left - 0.5 || r.right > b.right + 0.5 || r.bottom > b.bottom + 0.5); })
      .map(e => `${box.className} > ${e.tagName.toLowerCase()}`);
  });
  out.push(`${w}: ${d.documentElement.scrollWidth > w ? 'HSCROLL ' : ''}${[...new Set(spill)].join(', ') || 'ok'}`);
  f.remove();
}
out.join('\n');
```

For alignment, compare the `getBoundingClientRect().left` of each section's heading with the first text in each of its columns at the same widths.

Don't fix spill with `overflow: hidden`. It crops content instead of fitting it, and it hides the next spill from anyone looking at the page. Find the element that is too wide and fix that. (This check still reports spill inside an `overflow: hidden` box, because `getBoundingClientRect()` ignores clipping.)
