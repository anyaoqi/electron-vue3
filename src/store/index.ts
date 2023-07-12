import { createPinia, defineStore } from 'pinia'

const pinia = createPinia()

export const store = defineStore('main', {
  state: () => ({
    count: 0,
  })
})

export default pinia