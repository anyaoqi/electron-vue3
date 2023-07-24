import { createPinia, defineStore } from 'pinia'

const pinia = createPinia()

export const useStore = defineStore('main', {
  state: () => ({
    isLogin: false,
  }),
  actions: {
    setLogin(isLogin: boolean) {
      this.isLogin = isLogin
    }
  }
})

export default pinia