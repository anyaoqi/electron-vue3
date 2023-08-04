import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useStore } from '@/pinia/index'
import { iDatabaseConfig } from '@/types'
import { ElLoading } from 'element-plus'

/**
 * 数据库配置弹框显示状态
 */
export const useHookDialog = ()=> {
  const store = useStore()
  const { dbDialogVisable } = storeToRefs(store)
  const setDialogVisable = (show: boolean = true) => {
    store.openDbDialog(show)
  }
  return { dialogVisable: dbDialogVisable , setDialogVisable }
}

/**
 * 数据库配置相关操作
 * @returns { config,  setConfig }
 */
export const useDbConfig = () => {
  const store = useStore()
  const config = computed(() => store.dbConfig)
  const setConfig = (config: iDatabaseConfig) => {
    store.setDbConfig(config)
  }
  return { config, setConfig }
}


export const useLoading = () => {
  const store = useStore()
  const loading = computed(() => store.loading)

  const setLoading = (boo: boolean = true) => {
    if(loading.value) {
      store.loading.close()
      store.loading = null
    }
    if(boo) {
      store.loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
    }
  }

  return {
    loading,
    setLoading
  }
}