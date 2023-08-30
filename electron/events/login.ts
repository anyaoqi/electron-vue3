import logger from "../logger"
const mac = require('getmac').default
const crypto = require('crypto')
const soapRequest = require('easy-soap-request')
const encodingConvert = require('encoding')
const parseString = require('xml2js').parseString

const url = "https://proxyretail.hntobacco.com/services/SimpleWS"


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

/**
 * 拼接请求体
 */
function getBody(code: any, array_data: any) {
  const p2 = encodingConvert.convert(JSON.stringify(array_data), 'GBK', 'UTF-8').toString()

  let str =`0001M000M001${code}${p2}`
  let device_secret = 'E417CCD448B242F591FF92835584A41C'
  let secret = md5(str + device_secret)
  
  let base64 = encodeBase64(str + secret)
  let res = `
            <soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.services.crea.com">
              <soapenv:Header />
              <soapenv:Body>
                  <ws:process soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
                      <reqpkg xsi:type="xsd:base64Binary">${base64}</reqpkg>
                  </ws:process>
              </soapenv:Body>
              </soapenv:Envelope>
            `
  return res
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
  let r:any = await xml2arr(body)
  let str = Buffer.from(r, 'base64')
  let res = encodingConvert.convert(str, 'UTF8', 'GBK').toString()
  res = res.substring(res.indexOf('{'))
  return JSON.parse(res)
}

export async function requestSoap(code: any, data: any) {
  try {
    const { response } = await soapRequest({
      url: url,
      headers: {
        'Content-Type': 'text/xml; charset=GBK',
        SOAPAction: '',
      },
      xml: getBody(code, data),
      timeout: 1000 * 60,
    })
    const { body, statusCode } = response
    if (statusCode == 200) {
      return await parseBody(body)
    }
  } catch (err) {
    logger.error(`接口触发失败:${err} \n ${code},Data:${JSON.stringify(data)}`)
  }
}