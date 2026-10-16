<template>
  <article class="person-card">
    <div class="is-flex is-align-items-center mb-3">
      <div class="person-card-photo mystery mr-4" aria-hidden="true">?</div>
      <h3 class="title is-2 mb-0"><span class="you">YOU!!</span></h3>
    </div>
    <p>
      <strong>We'd love to collaborate with you!</strong> Want to see your data
      on ARDAC? Get in touch!
    </p>
    <p class="mt-2">
      <a href="mailto:uaf-snap-data-tools@alaska.edu">
        uaf-snap-data-tools@alaska.edu
      </a>
    </p>
  </article>
</template>

<style lang="scss" scoped>
// An empty photo circle for the person we haven't met yet.
.mystery {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: $white-darker;
  color: $gray-darker;
  font-size: 2.5rem;
  font-weight: 700;
  @include tablet {
    font-size: 3.5rem;
  }
}

// The green of the ARDAC logo, as behind "Hello!" on the home page. It's
// outside the sRGB range, so it gets an sRGB fallback for browsers without
// lch().
// inline-block with line-height 1 lets the green box hug the letters. The
// line already leaves a little room above and below the capitals, so less
// padding there than at the sides shows the same green on all four sides.
.you {
  display: inline-block;
  padding: 0.2em 0.3em;
  line-height: 1;
  color: $black;
  background-color: #00f200;
  background-color: lch(81.319% 131.414 140.216);
}
</style>
