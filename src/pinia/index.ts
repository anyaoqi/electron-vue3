import { createPinia, defineStore } from 'pinia'
import { iDatabase, iLicence } from '@/types'

const pinia = createPinia()

interface State {
  isLogin: boolean,
  dbDialogVisable: boolean,
  dbConfig: iDatabase,
  loading: any,
  licenceInfo: iLicence|null
}

export const useStore = defineStore('main', {
  state: ():State => ({
    isLogin: false,  // 是否登录
    dbDialogVisable: true,  // 数据库配置弹框
    dbConfig: {
      type: 'mysql',
      user: '',
      password: '',
      host: '',
      port: 3306,
      database: '',
    },
    loading: null,
    licenceInfo: null,
  }),
  actions: {
    setLogin(isLogin: boolean) {
      this.isLogin = isLogin
    },
    openDbDialog(isShow: boolean = true) {
      this.dbDialogVisable = isShow
    },
    setDbConfig(config: iDatabase) {
      this.dbConfig = config
    },
  }
})

export default pinia