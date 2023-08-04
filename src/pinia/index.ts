import { createPinia, defineStore } from 'pinia'
import { iDatabaseConfig } from '@/types'

const pinia = createPinia()

export const useStore = defineStore('main', {
  state: () => ({
    isLogin: false as boolean,  // 是否登录
    dbDialogVisable: true as boolean,  // 数据库配置弹框
    dbConfig: {
      type: 'mysql',
      user: '',
      password: '',
      host: '',
      port: 3306,
      database: '',
    } as iDatabaseConfig,
    loading: null as any,  //
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