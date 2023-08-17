import { createPinia, defineStore } from 'pinia'
import { iDatabase, iLicence } from '@/types'

const pinia = createPinia()

interface State {
  isLogin: boolean,
  dbDialogVisable: boolean,
  dbConfig: iDatabase,
  loading: any,
  licenceInfo: iLicence|null,
  isOpenTimer: boolean
}

export const useStore = defineStore('main', {
  state: ():State => ({
     // 是否登录
    isLogin: false,
    // 数据库配置弹框
    dbDialogVisable: true,
    // 数据库连接配置
    dbConfig: {
      type: 'mysql',
      user: '',
      password: '',
      host: '',
      port: 3306,
      database: '',
    },
    // 加载中
    loading: null,
    // 许可证信息
    licenceInfo: null,
    // 上传定时器开关
    isOpenTimer: false,
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
    setOpenTimer(isOpen: boolean) {
      this.isOpenTimer = isOpen
    }
  }
})

export default pinia