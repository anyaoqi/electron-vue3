import { createPinia, defineStore } from 'pinia'

const pinia = createPinia()

export const useStore = defineStore('main', {
  state: () => ({
    isLogin: false,  // 是否登录
    dbDialogVisable: true,  // 数据库配置弹框
  }),
  actions: {
    setLogin(isLogin: boolean) {
      this.isLogin = isLogin
    },
    openDbDialog(isShow: boolean = true) {
      console.log(isShow);
      
      this.dbDialogVisable = isShow
    },
  }
})

export default pinia