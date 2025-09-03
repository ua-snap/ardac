import lodash from 'lodash'
import deepdash from 'deepdash'
const _ = deepdash(lodash)

export default defineNuxtPlugin(nuxtApp => {
  return {
    provide: {
      _,
    },
  }
})
