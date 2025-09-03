import parseDMS from 'parse-dms'

export default defineNuxtPlugin(nuxtApp => {
  return {
    provide: {
      parseDMS,
    },
  }
})
