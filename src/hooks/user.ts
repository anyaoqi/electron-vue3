import { computed } from 'vue'
import { useStore } from '@/pinia'
import { iLicence } from '@type/index'

// 许可证相关操作
export const useLicence = () => {
  const store = useStore();
  // 许可证信息
  const licence = computed(() => store.licenceInfo)
  const cust_uuid = licence.value ? licence.value.cust_uuid : ''
  const cust_code = licence.value ? licence.value.cust_code : ''
  // 设置许可证信息
  const setLicence = (licenceInfo: iLicence) => {
    store.licenceInfo = licenceInfo
  }
  // 移除许可证信息
  const removeLicence = () => {
    store.licenceInfo = null
  }

  return {
    licence: licence,
    cust_uuid: cust_uuid,
    cust_code: cust_code,
    setLicence,
    removeLicence
  }
}