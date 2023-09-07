
import {computed } from 'vue'
import { iLoginForm } from '@type/index'
import { useStore } from '@/pinia/index'
import { useRouter } from 'vue-router'
import { useLoading } from '@/hooks/index'
import { useLicence } from '@/hooks/user'
import { api4G61, api3G72 } from '@/apis'
import { useUpload, useDataSync } from '@/hooks/uploadTimer'

/**
 * 登录相关操作
 * @returns { isLogin, licenceLogin, handleLogin, handleLogout }
 */
export const useLogin = () => {
  const router = useRouter()
  const store = useStore()
  const isLogin = computed(() => store.isLogin)
  const { setLicence } = useLicence()

  // 许可证登录
  const licenceLogin = async (loginForm: iLoginForm) => {
      const { setLoading } = useLoading()  // loading
      try {
        const mac:string = await window.electronAPI.getMac()
        let device_no = await window.electronAPI.md5(mac + loginForm.username)
        console.log('device_no', device_no);
        const r = await api4G61(loginForm.username, loginForm.password)

        if (r['ALInfoError']['Sucess'] !== '1') {
          const message = r['ALInfoError']['Description'] || '登陆失败'
          // 关闭loading
          setLoading(false)
          throw Error(message)
        }
        console.log('cust_info', r.cust_info);
        setLicence(r.cust_info)

        const cust_uuid = r.cust_info?.cust_uuid||""

        const s = await api3G72(cust_uuid, device_no)
        localStorage.setItem('3G72', JSON.stringify(s.biz_prop_info))

        return {
          success: true,
          api3G61: r,
          api3G72: s,
          error: null
        }
      } catch (error) {
        return {
          success: false,
          error: error
        }
      }
  }

  // 登录(设置登录状态和登录跳转)
  const handleLogin = () => {
    store.setLogin(true)
    router.push('/')
  }

  return {
    isLogin,
    licenceLogin,
    handleLogin,
  }
}

/**
 * 退出相关操作
 * @returns { handleLogout }
 */
export const useLogout = ()=> {
    const router = useRouter()
    const store = useStore()

    // 数据抽取定时器
    const { isOpenTimer, stopUpload } = useUpload()
    // 数据同步
    const { isSyncTimer, syncTimerStop } = useDataSync()
    // 退出
    const handleLogout = () => {
      // 停止数据抽取
      isOpenTimer.value && stopUpload()
      // 停止数据同步
      isSyncTimer.value && syncTimerStop()

      // 设置登录状态
      store.setLogin(false)
      router.push('/login')
    }

    return {
      handleLogout
    }
}