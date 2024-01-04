import { request } from './axios'
import md5 from 'blueimp-md5'
import { getConfig } from '@/utils'

// 封装请求方法
export const requestSoap = async (code: string, params: any) => {
  const { server } = getConfig()

  const baseUrl = server.url
  // 系统编码
  const syscode = server.syscode
  // 厂商编码
  const factorycode = server.factorycode
  // 设备编码
  const devicetypecode = server.devicetypecode
  // 密钥
  const secret = server.secret
  // 签名内容 `系统编码 + 厂商编码 + 设备编码 + 交易码`
  const sign = `${syscode}${factorycode}${devicetypecode}${code}`
  // 签名md5加密
  const signMd5 = md5(sign+JSON.stringify(params)+ secret)

  return  request({
    url: baseUrl,
    method: 'POST',
    data: {
      head: sign,
      businessmsg: JSON.stringify(params),
      sign: signMd5
    },
  }) as any
}