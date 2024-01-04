import { requestSoap } from './api'
import type {
  FieldRetailOrder,
  FieldLossOrder,
  FieldDayInvoicing,
  FieldApi1049
} from '@type/shanxi'

const deviceid = 'SXHS'

// 客户信息下载
export const api1G04 = (license_code: string) => {
  return requestSoap('1G04', {
    deviceid: deviceid,
    licensecode: license_code,
  })
}


// 卷烟信息下载
export const api1G05 = async (clientver: string, pageIndex: string, pageSize: string) => {
  console.log(clientver, pageIndex, pageSize);
  return await requestSoap('1G05', {
    deviceid: deviceid,
    clientver: clientver,
    querytype: '1',
    // queryfields: '',
    // querystr: '',
    PAGE_PAGEST: pageIndex,
    PAGE_PAGERECORDNUM: pageSize,
  })
}


// 卷烟计量单位信息下载
export const api1G0B = async () => {
  return await requestSoap('1G0B', {
    deviceid: deviceid,
  })
}

// 订单信息上传接口/ 单笔上传销售信息请求
export const api2S01 = async (params: FieldRetailOrder) => {
  return await requestSoap('2S01', {
    deviceid: deviceid,
    ...params
  })
}

// 损益单上传接口
export const api1S22 = async (params: FieldLossOrder) => {
  return await requestSoap('1S22', {
    deviceid: deviceid,
    ...params
  })
}

// 进销存日报上传接口
export const api1S31 = async (params: FieldDayInvoicing) => {
  return await requestSoap('1S31', {
    deviceid: deviceid,
    ...params
  })
}

// 配货单主表查询请求
export const api1O49 = async (params: FieldApi1049) => {
  return await requestSoap('1O49', {
    deviceid: deviceid,
    ...params
  })
}

// 获取订单信息请求
export const api1O12 = async (ordersid: string) => {
  return await requestSoap('1O12', {
    deviceid: deviceid,
    ordersid: ordersid
  })
}