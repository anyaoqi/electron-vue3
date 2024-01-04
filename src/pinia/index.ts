import { createPinia, defineStore } from 'pinia'

const pinia = createPinia()

// State类型
interface State {
}

// 创建store
export const useStore = defineStore('main', {
  state: ():State => ({
  }),
  getters: {},
  actions: {},
})

export default pinia