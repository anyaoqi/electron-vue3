import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useStore } from '@/pinia/index'
import { iDatabase } from '@type/index'
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
  const setConfig = (config: iDatabase) => {
    store.setDbConfig(config)
  }
  return { config, setConfig }
}

/**
 * 全局加载Loading
 * @returns { loading, setLoading }
 */
export const useLoading = () => {
  const store = useStore()
  const loading = computed(() => store.loading)

  const setLoading = (boo: boolean = true, text: string = 'Loading') => {
    if(loading.value) {
      store.loading.close()
    }
    if(boo === true) {
      store.loading = ElLoading.service({
        lock: true,
        text: text,
        background: 'rgba(0, 0, 0, 0.7)',
      })
    }
    if(boo === false) {
      loading.value && store.loading.close()
    }
  }

  return {
    loading,
    setLoading
  }
}