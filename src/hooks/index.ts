import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useStore } from '@/pinia/index'
import { useRouter } from 'vue-router'
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