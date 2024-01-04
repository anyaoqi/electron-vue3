import type { InjectionKey } from 'vue'

export interface configType {
  "title": string,
  "server": {
    "url": string,
    "syscode": string,
    "factorycode": string,
    "devicetypecode": string,
    "secret": string,
    "deviceid": string
  },
  "queryStoreSql": string,
  "uploadDataSql1": string,
  "uploadDataSql2": string
}

export const configKey = Symbol() as InjectionKey<configType>