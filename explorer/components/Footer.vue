<script lang="ts" setup>
const year = new Date().getFullYear()
</script>

<template>
  <footer>
    <div class="container is-fullhd content">
      <p class="bolder">
        Made by the
        <a
          href="https://www.snap.uaf.edu/"
          title="Boo! 👻 The SNAP tech team data ghost says hi!"
          >Scenarios Network for Alaska + Arctic Planning</a
        >
        located at the
        <a href="https://uaf-iarc.org">International Arctic Research Center</a>.
      </p>
      <p>
        Funding provided by the
        <a href="https://science.osti.gov/ber/Research/eessd/Data-Management"
          >Data Management Program</a
        >, Climate and Environmental Sciences Division, US Department of Energy.
      </p>

      <p class="lighter">
        Please contact
        <a href="mailto:uaf-snap-data-tools@alaska.edu"
          >uaf-snap-data-tools@alaska.edu</a
        >
        with questions or comments.
      </p>

      <p>
        Copyright &copy; {{ year }} University of Alaska Fairbanks. All rights
        reserved. The
        <a href="https://www.alaska.edu/">University of Alaska</a> is an Equal
        Opportunity/Equal Access Employer and Educational Institution. The
        University is committed to a
        <a href="https://www.alaska.edu/nondiscrimination/"
          >policy of non-discrimination</a
        >
        against individuals on the basis of any legally protected status.
      </p>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
footer {
  border-top: 1rem solid $gray;
  background-color: $white;
  color: $black;
  padding: 3rem;

  font-size: 140%;
  font-weight: 500;
  line-height: 1.1;

  .bolder {
    font-weight: 600;
  }

  .lighter {
    font-weight: 300;
    font-size: 90%;
  }
}
</style>
