<script lang="ts" setup></script>

<template>
  <section class="section">
    <div class="columns">
      <div class="featured column is-8 pr-5">
        <div class="tile is-ancestor">
          <div class="tile is-parent is-vertical">
            <div class="tile lead is-child border-bottom">
              <ItemTextPicture slug="story-cold-snap-1989" />
            </div>
            <div class="general">
              <div class="row tile is-parent mb-4">
                <div class="left tile is-child">
                  <ItemTextPicture slug="story-cmip6-downscaled" showTag />
                </div>
                <div class="right tile is-child">
                  <ItemTextPicture slug="story-climate-indicators" showTag />
                </div>
              </div>
              <div class="row tile is-parent mb-4">
                <div class="left tile is-child">
                  <ItemTextPicture slug="story-climate-stripes-2" showTag />
                </div>
                <div class="left tile is-child">
                  <ItemTextPicture slug="story-fire-prone-conditions" showTag />
                </div>
              </div>
              <div class="tile is-parent">
                <div class="left tile is-child">
                  <ItemTextPicture
                    slug="story-arctic-climate-data-node"
                    showTag
                  />
                </div>
                <div class="left tile is-child">
                  <ItemTextPicture slug="summary-landfast-sea-ice" showTag />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column right pl-5 border-left">
        <div class="content is-size-5 hello">
          <p>
            Hello! Looking for an
            <NuxtLink to="/about">overview of the content</NuxtLink>
            available here? <NuxtLink to="/about">&#x2192; read</NuxtLink>
          </p>
        </div>
        <ItemText slug="places-and-polygons" />
        <div class="content resources is-size-5">
          <hr class="light" />
          <p>Resources</p>
          <ul>
            <li class="mb-3">
              <a href="mailto:uaf-snap-data-tools@alaska.edu">Email us</a> with
              questions
            </li>
            <li class="mb-3">
              Visit the <a href="https://earthmaps.io">data API</a> that this
              webapp uses to provide data access
            </li>
            <li class="mb-3">
              Learn about
              <NuxtLink to="/people">our team and who we are</NuxtLink>
            </li>
          </ul>
          <hr />
          <h4 class="title is-4">Get involved!</h4>
          <p>
            You can help build this! Do you have an idea for a data story? Do
            you create datasets? We would love to hear your ideas!
          </p>
          <a href="mailto:uaf-snap-data-tools@alaska.edu" class="button is-info"
            >Get in touch</a
          >
        </div>
        <div class="more-items">
          <hr />
          <h4 class="title is-4">More to explore</h4>
          <ul>
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
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@import '~/assets/styles/items.scss';

.hello {
  background-color: $white-darker;
  padding: 1rem;
  border: 1px dashed $gray-lighter;
}

.more-items ul li {
  margin-bottom: 1.5rem;
}

.resources li {
  line-height: 1.35;
}

@media (min-width: 769px) {
  .tile.row {
    border-bottom: 1px dashed $gray-lighter;
  }

  .general .tile.left {
    &:deep(.item) {
      padding-right: 1rem;
      border-right: 1px dashed $gray-lighter;
    }
  }
  .general .tile.right {
    margin-left: 1rem !important;
  }
}

.lead {
  &:deep(.item) {
    h3 {
      font-size: 215%;
      min-height: auto; // undo forced spacing used in other places
    }
    // The hero picture spans the wide column, so crop it to a shallower
    // shape than the 5:4 used for other items to keep it from filling
    // the screen.
    figure.image {
      padding-top: 50%;
      img {
        object-fit: cover;
      }
    }
  }
}
</style>
