<script lang="ts" setup>
const props = defineProps(['jupyterlabUrl', 'githubUrl'])
</script>

<template>
  <section class="section">
    <div class="columns">
      <div class="column is-three-quarters notebook content is-size-5">
        <div class="message">
          <div class="message-body content is-size-5">
            <span class="robot">🤖</span> This article describes using the
            <strong>Python programming language</strong> to access, process and
            visualize data.<span class="is-hidden-mobile">
              Access working code and downloads from the sidebar to the
              right.</span
            >
          </div>
        </div>
        <slot></slot>
      </div>
      <div class="column">
        <div class="actions border-left pl-5">
          <h4 class="title is-4">Use this code</h4>
          <div class="is-size-5">
            <ul>
              <li>
                <NuxtLink :to="githubUrl"
                  >&#x2192; download this notebook from GitHub</NuxtLink
                >
              </li>
            </ul>
            <p class="mt-3">
              New to Jupyter Notebooks?
              <NuxtLink
                to="https://jupyter-notebook.readthedocs.io/en/stable/notebook.html"
                >&#x2192; read an introduction</NuxtLink
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.robot {
  font-size: 2rem;
  vertical-align: baseline;
  display: inline-block;
  margin-right: 0.35rem;
}
:deep(*) {
  h1 {
    font-size: 1.65rem;
  }
  h3 {
    font-size: 1.5rem;
    margin-top: 2.25rem;
  }
  pre {
    margin-bottom: 1.25rem;
  }
  strong {
    font-weight: 500;
  }
  a.anchor-link {
    display: none;
  }
  .prompt.input_prompt {
    display: none;
  }
}
</style>
