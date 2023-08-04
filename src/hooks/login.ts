
import {computed } from 'vue'
import { iLoginForm } from '@/types'
import { useStore } from '@/pinia/index'
import { useRouter } from 'vue-router'
import { useLoading } from '@/hooks/index'

/**
 * 登录相关操作
 * @returns { isLogin, licenceLogin, handleLogin, handleLogout }
 */
export const useLogin = () => {
  const router = useRouter()
  const store = useStore()
  const isLogin = computed(() => store.isLogin)

  // 许可证登录
  const licenceLogin = async (loginForm: iLoginForm) => {
      const { setLoading } = useLoading()  // loading

      const mac:string = await window.electronAPI.getMac()
      let device_no = await window.electronAPI.md5(mac + loginForm.username)
      console.log('device_no', device_no);
      const r = await window.electronAPI.requestSoap('3G61', {
        deviceid: 'WINDOWS',
        login_name: loginForm.username,
        login_pwd: loginForm.password,
        device_no: device_no
      })

      if (r['ALInfoError']['Sucess'] !== '1') {
        const message = r['ALInfoError']['Description'] || '登陆失败'
        // 关闭loading
        setLoading(false)
        throw Error(message)
      }

      const cust_uuid = r?.cust_info?.cust_uuid||""
      const s = await window.electronAPI.requestSoap('3G72', {
        cust_uuid: cust_uuid,
        deviceid: 'WINDOWS',
        device_no: device_no
      })
      localStorage.setItem('3G72', JSON.stringify(s.biz_prop_info))
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

    // 退出
    const handleLogout = () => {
      store.setLogin(false)
      router.push('/login')
    }

    return {
      handleLogout
    }
}