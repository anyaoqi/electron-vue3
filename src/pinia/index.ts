import { createPinia, defineStore } from 'pinia'
import { iDatabaseConfig } from '@/types/databaseType'
const pinia = createPinia()

export const useStore = defineStore('main', {
  state: () => ({
    isLogin: false,  // 是否登录
    dbDialogVisable: true,  // 数据库配置弹框
    dbConfig: {}
  }),
  actions: {
    setLogin(isLogin: boolean) {
      this.isLogin = isLogin
    },
    openDbDialog(isShow: boolean = true) {
      this.dbDialogVisable = isShow
    },
    setDbConfig(config: iDatabaseConfig) {
      this.dbConfig = config
    }
  }
})

export default pinia