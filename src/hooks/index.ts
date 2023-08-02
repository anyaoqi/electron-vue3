import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useStore } from '@/pinia/index'
import { useRouter } from 'vue-router'
import { iDatabaseConfig } from '@/types/databaseType'
const store = useStore()

/**
 * 数据库配置弹框显示状态
 */
export const useHookDialog = ()=> {
  const { dbDialogVisable } = storeToRefs(store)
  const setDialogVisable = (show: boolean = true) => {
    store.openDbDialog(show)
  }
  return { dialogVisable: dbDialogVisable , setDialogVisable }
}

/**
 * 登录操作
 * @returns { isLogin, login, logout }
 */
export const useHookLogin = () => {
  const router = useRouter()
  const isLogin = computed(() => store.isLogin)
  // 登录
  const login = () => {
    store.setLogin(true)
    router.push('/')
  }
  // 退出
  const logout = () => {
    store.setLogin(false)
    router.push('/login')
  }
  return { isLogin, login, logout }
}

/**
 * 数据库配置相关操作
 * @returns { config,  setConfig }
 */
export const useDbConfig = () => {
  const config = computed(() => store.dbConfig)
  const setConfig = (config: iDatabaseConfig) => {
    store.setDbConfig(config)
  }
  return { config, setConfig }
}