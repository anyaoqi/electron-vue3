import { useLicence } from '@/hooks/user'
import { requestSoap } from './api'
import type {
  FieldsStore,
  FieldsSupplier,
  FieldsNotbCategory,
  FieldsNotbGoods,
  FieldsMemberInfo,
  FieldRetailOrder,
  FieldInOrder,
  FieldLossOrder,
  FieldOutOrder,
  FieldDayInvoicing,
  FieldReportingForm
} from '@type/index'

const deviceid = 'WINDOWS'

// 登录接口
export const api3G61 = async (username: string, password: string) => {
    const mac:string = await window.electronAPI.getMac()
    let device_no = await window.electronAPI.md5(mac + username)
    console.log('device_no', device_no);
    return await requestSoap('3G61', {
      deviceid: deviceid,
      login_name: username,
      login_pwd: password,
      device_no: device_no
    })
}

// 登录获取店铺信息
export const api3G72 = async (cust_uuid: string, device_no: string) => {
  return await requestSoap('3G72', {
    deviceid: deviceid,
    cust_uuid: cust_uuid,
    device_no: device_no
  })
}

// 门店信息下载/客户信息同步请求
export const api4G00 = async () => {
  const { cust_uuid } = useLicence()
  
  return await requestSoap('4G00', {
    deviceid: deviceid,
    cust_uuid: cust_uuid
  })
}

/**
 * 卷烟信息同步请求
 * @param clientver 终端版本号
 * 终端卷烟信息版本号（yyyyMMddHHmmss）当终端无版本信息时传空,当终端版本号传入99999999999999时服务端返回所有卷烟信息
 * @param pageIndex 起始位 用于查询结果分页处理 从0开始
 * @param pageSize 偏移量 用于查询结果分页处理 每页记录条目数 偏移量最大500
 */
export const api4G01 = async (clientver: string, pageIndex: string, pageSize: string) => {
  const { cust_uuid } = useLicence()
  return await requestSoap('4G01', {
    deviceid: deviceid,
    cust_uuid: cust_uuid,
    clientver: clientver, // 终端版本号
    querytype:'1', // 查询标识 1返回所有字段，其他返回基本字段
    PAGE_PAGESTART: pageIndex,
    PAGE_PAGERECORDNUM: pageSize,
  })
}

// 卷烟计量单位信息同步请求
export const api4G02 = async (cust_uuid: string) => {
  return await requestSoap('4G02', {
    deviceid: deviceid,
    cust_uuid: cust_uuid
  })
}

// 客户非烟商品类目批量上传请求
export const api4G03 = async (cate_infos: FieldsNotbCategory[]) => {
  const { cust_uuid } = useLicence()
  return await requestSoap('4G03', {
    deviceid: deviceid,
    cust_uuid: cust_uuid,
    cate_infos: cate_infos,
  })
}


// 客户非烟商品档案批量上传请求
export const api4G04 = async (goods_infos: FieldsNotbGoods[]) => {
  const { cust_uuid } = useLicence()
  return await requestSoap('4G04', {
    deviceid: deviceid,
    cust_uuid: cust_uuid,
    goods_infos: goods_infos,
  })
}


// 客户供应商批量上传请求
export const api4G05 = async (supplierInfos: FieldsSupplier[]) => {
  const { cust_uuid } = useLicence()
  return await requestSoap('4G05', {
    deviceid: deviceid,
    cust_uuid: cust_uuid,
    supplier_infos: supplierInfos,
  })
}

// 客户信息批量上传请求
export const api4G07 = async (storeInfos: FieldsStore[]) => {
  const { cust_uuid } = useLicence()
  return await requestSoap('4G07', {
    deviceid: deviceid,
    cust_uuid: cust_uuid,
    store_infos: storeInfos,
  })
}

// 消费者会员信息上传请求
export const api4G06 = async (consumer_infos: FieldsMemberInfo[]) => {
  const { cust_uuid } = useLicence()
  return await requestSoap('4G06', {
    deviceid: deviceid,
    cust_uuid: cust_uuid,
    consumer_infos: consumer_infos,
  })
}

// 批量上传销售信息请求
export const api4S00 = async (order_infos: FieldRetailOrder[]) => {
  const { cust_uuid, cust_code } = useLicence()
  return await requestSoap('4S00', {
    deviceid: deviceid,
    cust_uuid: cust_uuid,
    cust_code: cust_code,
    order_infos: order_infos,
  })
}
// 入库记录批量上传请求
export const api4S01 = async (purchcheck_infos: FieldInOrder[]) => {
  const { cust_uuid } = useLicence()
  return await requestSoap('4S01', {
    deviceid: deviceid,
    cust_uuid: cust_uuid,
    purchcheck_infos: purchcheck_infos,
  })
}
// 损溢记录批量上传请求
export const api4S02 = async (records: FieldLossOrder[]) => {
  const { cust_uuid, cust_code } = useLicence()
  return await requestSoap('4S02', {
    deviceid: deviceid,
    cust_uuid: cust_uuid,
    cust_code: cust_code,
    records: records,
  })
}
// 其他出入库记录批量上传请求
export const api4S03 = async (other_purchcheck_infos: FieldOutOrder[]) => {
  const { cust_uuid } = useLicence()
  return await requestSoap('4S03', {
    deviceid: deviceid,
    cust_uuid: cust_uuid,
    other_purchcheck_infos: other_purchcheck_infos
  })
}

// 进销存日报批量上报请求
export const api4S04 = async (records: FieldDayInvoicing[]) => {
  const { cust_uuid, cust_code } = useLicence()
  return await requestSoap('4S04', {
    deviceid: deviceid,
    cust_uuid: cust_uuid,
    cust_code: cust_code,
    records: records
  })
}


// 报表数据查询
export const api4G08 = async (params: FieldReportingForm) => {
  return await requestSoap('4G08', {
    deviceid: deviceid,
    ...params
  })
}