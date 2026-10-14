<script lang="ts" setup></script>

<template>
  <section class="section pt-5">
    <h2 class="is-sr-only">Featured</h2>
    <div class="columns">
      <div class="featured column is-8 pr-5">
        <div class="columns is-multiline is-4">
          <div class="lead column is-full is-flex p-0 border-bottom">
            <ItemTextPicture
              slug="cusp-permafrost-observations"
              class="is-flex-grow-1 px-4 pt-4 pb-5"
            />
          </div>
          <div class="column is-half is-flex p-0 border-right border-bottom">
            <ItemTextPicture
              slug="story-cold-snap-1989"
              class="is-flex-grow-1 px-4 py-5"
            />
          </div>
          <div class="column is-half is-flex p-0 border-bottom">
            <ItemTextPicture
              slug="story-cmip6-downscaled"
              class="is-flex-grow-1 px-4 py-5"
            />
          </div>
          <div class="column is-half is-flex p-0 border-right border-bottom">
            <ItemTextPicture
              slug="story-climate-indicators"
              class="is-flex-grow-1 px-4 py-5"
            />
          </div>
          <div class="column is-half is-flex p-0 border-bottom">
            <ItemTextPicture
              slug="story-climate-stripes-2"
              class="is-flex-grow-1 px-4 py-5"
            />
          </div>
          <div class="column is-half is-flex p-0 border-right">
            <ItemTextPicture
              slug="story-fire-prone-conditions"
              class="is-flex-grow-1 px-4 py-5"
            />
          </div>
          <div class="column is-half is-flex p-0">
            <ItemTextPicture
              slug="summary-landfast-sea-ice"
              class="is-flex-grow-1 px-4 py-5"
            />
          </div>
        </div>
      </div>
      <div class="column right pl-5 border-left">
        <div class="content resources is-size-5 pt-4">
          <ul>
            <li class="mb-3">
              <strong class="is-inline-block px-2">Hello!</strong> Looking for
              an
              <NuxtLink to="/about">overview of the content</NuxtLink> available
              here?
            </li>
            <li class="mb-3">
              <a href="mailto:uaf-snap-data-tools@alaska.edu">Email us</a> with
              questions?
            </li>
            <li class="mb-3">
              Visit the <a href="https://earthmaps.io">data API</a> that this
              webapp uses to provide data access?
            </li>
            <li class="mb-3">
              Learn about
              <NuxtLink to="/people">our team and who we are?</NuxtLink>
            </li>
          </ul>
        </div>
        <div class="more-items">
          <hr />
          <h3 class="title is-4">More to explore</h3>
          <ul>
            <li>
              <ItemText slug="places-and-polygons" />
            </li>
            <li>
              <ItemText slug="era5-wrf-xray" />
            </li>
            <li>
              <ItemText slug="temperature-cmip6-downscaled" />
            </li>
            <li>
              <ItemText slug="precipitation-cmip6-downscaled" />
            </li>
            <li>
              <ItemText slug="indicator-su-cmip6" />
            </li>
            <li>
              <ItemText slug="indicator-rx1day-cmip6" />
            </li>
            <li>
              <ItemText slug="alfresco-flammability" />
            </li>
            <li>
              <ItemText slug="alfresco-vegetation" />
            </li>
            <li>
              <ItemText slug="indicator-wsdi" />
            </li>
            <li>
              <ItemText slug="sea-ice-cmip6" />
            </li>
            <li>
              <ItemText slug="precipitation-cmip6" />
            </li>
            <li>
              <ItemText slug="permafrost-base-top" />
            </li>
            <li>
              <ItemText slug="indicator-rx5day" />
            </li>
            <li>
              <ItemText slug="indicator-r10mm" />
            </li>
            <li>
              <ItemText slug="indicator-cwd" />
            </li>
            <li>
              <ItemText slug="indicator-cdd" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@import '~/assets/styles/items.scss';

// "Hello!" on the green of the ARDAC logo. The green is outside the sRGB
// range, so it gets an sRGB fallback for browsers without lch().
.resources strong {
  color: $black;
  background-color: #00f200;
  background-color: lch(81.319% 131.414 140.216);
}

.more-items ul li {
  margin-bottom: 1.5rem;
}

// In the featured grid, push each item's picture to the bottom of its cell
// so the pictures in a row line up whatever the length of the text above.
.featured :deep(.item) {
  display: flex;
  flex-direction: column;
  > a {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  figure {
    margin-top: auto;
  }
}

// The right-hand column is a quieter read than the featured stories: lighter
// titles, and text a step lighter in color (still well above WCAG AA
// contrast: 8.1:1 for titles and 6.5:1 for text on the page background).
.right {
  color: #565b5f;
  // Headings a little smaller than Bulma's sizes for them.
  .title {
    font-size: 1.4375rem;
    color: #484d50;
  }
  :deep(.item h3) {
    font-size: 1.35rem;
    font-weight: 500;
    color: #484d50;
  }
  :deep(.item:not(:hover) p) {
    color: #565b5f !important;
  }
  // Bulma's own quiet divider, without the project's dark border on hr.
  hr {
    border: none;
  }
}

.resources li {
  line-height: 1.35;
}

.lead {
  &:deep(.item) {
    h3 {
      font-size: 215%;
      min-height: auto; // undo forced spacing used in other places
    }
    // A larger description with some room above and below.
    p {
      font-size: $size-5;
      padding-block: 0.75rem;
    }
    // The hero picture spans the wide column, so crop it to a shallower
    // shape than the 5:4 used for other items to keep it from filling
    // the screen.
    figure.image {
      aspect-ratio: 2 / 1;
      img {
        object-fit: cover;
      }
    }
  }
}
</style>
