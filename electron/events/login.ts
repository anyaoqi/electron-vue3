import logger from "../logger"
const mac = require('getmac').default
const crypto = require('crypto')
const soapRequest = require('easy-soap-request')
const encodingConvert = require('encoding')
const parseString = require('xml2js').parseString

const url = "http://test-yxglpt.siluqing.com.cn/proxy/cis/process"


export function md5(str: string) {
  const hash = crypto.createHash('md5')
  hash.update(str)
  return hash.digest('hex')
}

export function getMac() {
  return mac()
}

function encodeBase64(str: string) {
  return Buffer.from(str).toString('base64')
}

// 中文转unicode
function chineseToUnicode(str: string) {
  let unicodeStr = "";
  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i);
    if (char.match(/[\u4e00-\u9fa5]/)) {
      // 如果字符是中文字符，则转换为Unicode表示
      unicodeStr += "\\u" + char.charCodeAt(0).toString(16);
    } else {
      // 如果字符不是中文字符，则保持原样
      unicodeStr += char;
    }
  }
  return unicodeStr;
}

// 数据转换
function vonvertData(array_data: any) {
  const dataType = Object.prototype.toString.call(array_data)
  if(array_data && dataType==='[object Object]') {
    for (const dataKey in array_data) {
      if(Array.isArray(array_data[dataKey])) {
        array_data[dataKey].map((obj: any) => {
          for (const key in obj) {
            let valType = Object.prototype.toString.call(obj[key])
            if(valType==='[object String]'){
              // 将中文转为unicode
              obj[key] = chineseToUnicode(obj[key])
            } else if (valType==='[object Array]') {
              obj[key] = obj[key].map((vStr: string) => {
                if(typeof vStr === 'string') {
                  return chineseToUnicode(vStr)
                } else {
                  return vStr
                }
              })
            }
          }
        })
      }
    }
  }
  return array_data
}

/**
 * 拼接请求体
 */
function getBody(code: string, array_data: any) {

  array_data = vonvertData(array_data)
  const p2 = encodingConvert.convert(JSON.stringify(array_data), 'GBK', 'UTF-8').toString()

  // 系统编码
  const syscode = '0002'
  // 厂商编码
  const factorycode = 'M031'
  // 设备编码
  const devicetypecode = 'M004'
  // 交易码
  const transid = code
  // 业务报文
  const businessmsg = p2
  // 密钥
  const secret = '17fd22a2cf1c645ae98d20f906b4cce8'
  // 签名内容 `系统编码 + 厂商编码 + 设备编码 + 交易码 + 业务报文`
  const sign = `${syscode}${factorycode}${devicetypecode}${transid}${businessmsg}`
  // 签名md5加密
  const signMd5 = md5(sign + secret)
  // 将加密后的签名通过base64转义
  const signBase64 = encodeBase64(sign + signMd5)
  console.log('sign', sign);

  let res = `
            <soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.services.crea.com">
              <soapenv:Header />
              <soapenv:Body>
                  <ws:process soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
                      <reqpkg xsi:type="xsd:base64Binary">${signBase64}</reqpkg>
                  </ws:process>
              </soapenv:Body>
              </soapenv:Envelope>
            `
  return {
    res,
    sign: sign + secret
  }
}

// xml => json
function xml2arr(xml: any) {
  return new Promise((resolve) => {
    parseString(xml, function (_err:any, result:any) {
      console.error(_err);
      resolve(
        result['soapenv:Envelope']['soapenv:Body'][0]['ns1:processResponse'][0][
          'ns1:processReturn'
        ][0]['_']
      )
    })
  })
}

/**
 * 解析返回的body
 */
async function parseBody(body: any) {
  try {
    let r:any = await xml2arr(body)
    let str = Buffer.from(r, 'base64')
    let res = encodingConvert.convert(str, 'UTF8', 'GBK').toString()
    res = res.substring(res.indexOf('{'))
    return JSON.parse(res)
  } catch (err) {
    logger.error(`
      parseBody解析错误：${err}\n
      body: ${body}
    `)
    throw Error('parseBody解析错误：'+err+'  body:'+body)
  }
}

export async function requestSoap(code: any, data: any) {
  const { res, sign }  = getBody(code, data)
  // try {
    const { response } = await soapRequest({
      url: url,
      headers: {
        'Content-Type': 'text/xml; charset=GBK',
        SOAPAction: '',
      },
      xml: res,
      timeout: 1000 * 60,
    })
    const { body, statusCode } = response
    console.log('statusCode',statusCode);
    
    console.log('body', JSON.stringify(body));
    
    if (statusCode == 200) {
      if(body && body?.ALInfoError?.Sucess != '1') {
        const desc = body.ALInfoError.Description
        logger.error(`
          ${code} 接口触发失败: ${desc} \n
          接口：${code} \n
          参数:${JSON.stringify(data)} \n
          签名: ${sign}
        `)
        return desc
      }

      return await parseBody(body)
    } else {
      return response
    }
  // } catch (err) {
  //   logger.error(`
  //     ${code} 接口触发失败:${err} \n
  //     接口：${code} \n
  //     参数:${JSON.stringify(data)} \n
  //     签名: ${sign}
  //   `)
  //   return err
  // }
}