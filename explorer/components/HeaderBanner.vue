<script lang="ts" setup></script>

<template>
  <div class="headerbanner">
    Scenarios Network for Alaska + Arctic Planning
  </div>
</template>

<style lang="scss" scoped>
.headerbanner {
  position: relative; // Needed so z-index is honored
  z-index: 500; // stack over any other elements in headerbar

  padding: 0.75rem;

  background-color: $gray;

  color: #fff;
  font-size: 0.8rem;
  text-align: center;
  letter-spacing: 0.3ex;
  line-height: 1;
  font-weight: 400;
  text-transform: uppercase;

  border-bottom: 0.25rem solid #fff;
}
</style>
