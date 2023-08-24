// 抽取类型对应的key类型
export type ExtrNameType =
  'store'|'supplier'|'notb_category'|'notb_goods'
  |'member_info'|'retail_order'|'in_order'
  |'loss_order'|'out_order'|'day_invoicing'


// 抽取类型数据接口类型
export interface ExtrDataType {
  name: string,  // 抽取类型名称
  key: ExtrNameType,   // 抽取类型key
  sql?: string,  // 抽取sql
  apiFilds: {
    filed: string,   // 接口字段key
    name: string,    // 接口字段名称
    description: string,  // 描述
    filedValue?: string,  // 对应字段key
    defalutValue?: string  // 默认值
  }[]
}

export interface TypeData {
  createdAt: string, // 创建时间
  updatedAt: string, // 更新时间
  typeName: string,
  englishFlag: string,
  sql: string,
}

export interface ExtrMappType {
  createdAt: string, // 创建时间
  updatedAt: string, // 更新时间
  filed: string,  // 接口字段key
  name: string,  // 接口字段名称
  filedValue: string,    // 对应字段key
  defaultValue: string, // 默认值
  description: string, // 描述
  englishFlag: string,  // 抽取类型key
  englishName: string   // 抽取类型名称
}

// 店铺信息上传参数
export interface StoreParams {
  created_at: string,
  updated_at: string,
  is_update: string,
  store_id: string,
  license_code: string,
  cust_name: string,
  is_active: string
}

export interface StoreBatchParams {
  created_at: string
  updated_at: string
  is_update: string
  store_id: string
  license_code: string
  cust_name: string
  is_active: string
}

export interface delDataParams{
  tableName: string
  ids:string[]
  key:string
}

// electron-log等级
export type LoggerLevel  = 'info'|'warn'|'error'|'debug'|'verbose'|'silly'
