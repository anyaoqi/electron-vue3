// 登录表单
export interface iLoginForm  {
  username: string,
  password: string,
}

// 数据库配置项
export interface iDatabase {
  type: string
  user: string
  password: string
  host: string
  port: number,
  database: string
}

// 许可证信息
export interface iLicence {
  "sys_code": string,
  "corp_uuid": string,
  "county_uuid": string,
  "address": string,
  "status_code": string,
  "is_active": string,
  "manage_person_mobile": string,
  "cust_type_name": string,
  "corp_name": string,
  "county_name": string,
  "order_type_code": string,
  "cust_code": string,
  "state_cust_code": string,
  "is_nonsmoke": string,
  "cust_uuid": string,
  "cust_name": string,
  "manage_unit_uuid": string,
  "cust_manager_person_uuid": string,
  "license_code": string,
  "cust_manager_name": string,
  "cust_type_uuid": string,
  "cust_manager_mobile": string,
  "bank_code": string
}

// 数据抽取抽取-数据对照数据类型
export interface columnType {
  filed: string  // 接口字段key
  name: string  // 接口字段名称
  filedValue: string  // 对应字段
  defaultValue: string  // 默认值
  description: string    // 描述/说明
}


// 店铺信息抽取-参数接口类型
export interface FieldsStore {
  store_id: string  // 门店id
  license_code: string  // 许可证号
  cust_name: string // 门店名称
  is_active: string  // 是否启用
}
// 供应商抽取-参数接口类型
export interface FieldsSupplier {
  supplier_name: string // 供应商名称
  supplier_code: string // 供应商编码
  contact_person: string // 联系人
  contact_tel: string // 联系电话
  address: string // 地址
  is_active: string  // 是否启用
}

// 非烟商品类别抽取-参数接口类型
export interface FieldsNotbCategory {
  category_code: string // 类目编码
  category_name: string // 类目名称
  parent_category: string // 上级类目
  order_index: string // 排序码
  is_active: string // 是否启用
}

// 非烟商品信息抽取-参数接口类型
export interface FieldsNotbGoods {
  goods_isn: string // 商品标识
  goods_code: string // 商品编码
  goods_name: string // 商品名称
  shortalpha: string // 拼音助记码
  bitcode: string // 条形码
  unitname: string // 计量单位
  first_cust_category_code: string // 所属大类编码
  second_cust_category_code: string // 所属小类编码
  brand: string // 品牌
  factory: string // 厂家
  spec: string // 规格
  address: string // 产地
  glass: string // 等级
  is_sh: string // 是否散货
  buy_price: string // 购进价
  retail_price: string // 零售价
  memo: string // 备注
  is_pack: string // 是否多包装商品
  base_goods_isn: string // 主商品内码
  pack_rate: string // 包装率
  isactive: string // 是否启用
}

// 会员信息抽取-参数接口类型
export interface FieldsMemberInfo {
  mobile: string // 手机号码
  nickName: string // 昵称
  cityCode: string // 城市编码
  cityName: string // 城市名称
  tobaccoLicense: string // 许可证号
  channelId: string // 渠道id
  dateOfBirth: string // 出生生日
  sex: string // 性别
}

// 零售订单信息抽取-参数接口类型
export interface FieldRetailOrder {
  clientorderid: string // 销售单ID
  inputtime: string // 销售时间
  bizdate: string // 业务日期
  consumersid: string // 消费者标识
  mobilephone: string // 消费者手机
  dtlcount: string // 商品记录数
  dtl_goodsisn: string // 商品标识
  dtl_istobacco: string // 是否卷烟商品
  dtl_unitid: string // 销售单位
  dtl_barcode: string // 条形码
  dtl_saleprice: string // 零售价
  dtl_buyprice: string // 购入价
  dtl_quantity: string // 销售数量
  paydtlcount: string // 支付明细数
  paydtl_fund_channel: string // 支付渠道
  paydtl_amount: string // 支付金额
  paydtl_remark: string // 支付说明
  trade_no: string // 支付宝交易号
  buyer_user_id: string // 买家支付宝用户号
  buyer_logon_id: string // 买家支付宝账号
  total_amount: string // 交易金额
  receipt_amount: string // 实收金额
  gmt_payment: string // 付款时间
}

// 入库单信息抽取-参数接口类型
export interface FieldInOrder {
  bill_code: string // 入库记录标识
  supplier_code: string // 供应商编码
  biz_type: string // 业务类型
  biz_date: string // 业务日期
  dtl_is_tobacco: string // 是否卷烟商品
  dtl_goodsisn: string // 商品代码
  dtl_barcode: string // 条形码
  dtl_quantity: string // 数量
  dtl_price: string // 单价
}

// 损溢单信息抽取-参数接口类型
export interface FieldLossOrder {
  storchecksid: string // 损益记录标识
  bizdate: string // 业务日期
  dtlcount: string // 明细记录数
  dtl_is_tobacco: string // 是否卷烟商品
  dtl_productid: string // 商品ID
  dtl_barcode: string // 条形码
  dtl_stockqty: string // 损溢数量
}

// 其他出入库单信息抽取-参数接口类型
export interface FieldOutOrder {
  bill_code: string // 入库记录标识
  supplier_code: string // 供应商编码
  biz_type: string // 业务类型
  biz_type_name: string // 业务类型名称
  biz_date: string // 业务日期
  dtl_is_tobacco: string // 是否卷烟商品
  dtl_barcode: string // 条形码
  dtl_quantity: string // 数量
  dtl_goodsisn: string // 商品代码
  dtl_price: string // 单价
}

// 日结进销存信息抽取
export interface FieldDayInvoicing {
  reqdate: string // 业务日期
  dtlcount: string // 商品记录数
  dtl_productid: string // 商品ID
  dtl_is_tobacco: string // 是否卷烟商品
  dtl_lastqty: string // 期初数量
  dtl_buyqty: string // 购入数量
  dtl_saleqty: string // 销售数量
  dtl_correctqty: string // 损益数量
  dtl_otherqty: string // 其他出入库数量
  dtl_restqty: string // 剩余数量
}

// 门店对照关系数据类型
export interface StoreCompType {
  store_name: string,
  store_id: string,
  license_code: string
}

// 同步门店数据接口类型
export interface LicenseOptionType{
  cust_code: string
  cust_name: string
  cust_uuid: string
  license_code: string
}

// 商品对照关系数据类型
export interface GoodsCompType {
  goods_id: string
  goods_category: string
  goods_code: string
  goods_unit: string
  code_value: string
}

// 同步商品数据类型
export interface GoodsListType {
  goods_id: string
  goods_code: string
  goods_name: string
  barcode: string
  pack_barcode: string
  wholesale_price: string
  msrp: string
  conversion_ratio: string
  brand: string
  manufacturer_name: string
  is_new: string
  backbone_brand: string
  goods_image: string
  mnemonic_code_pinyin: string
  home_e: string
  mnemonic_code_number: string
  online_ordering: string
  retail_price: string
  message_code: string
  brand_identity: string
  manufacturer_identity: string
  smoke_abnormal: string
  smoke_province: string
  default_unit: string
  brand_code: string
  manufacturer_code: string
  is_import: string
  price_class_code: string
  price_class_name: string
  disabled: string
  tar_content: string
  packaging_type: string
  total_records: string
}

// 抽取类型字面量
export type BizType = '4G07'|'4G05'|'4G03'|'4G04'|'4G06'|'4S00'|'4S01'|'4S02'|'4S03'|'4S04'
// 报表查询表单接口
export interface FieldReportingForm {
  cust_uuid: string
  page: number
  size: number
  begin_date: string
  end_date: string
  biz_type: string
}

// 抽取类型对应的key类型
export type ExtrNameType =
  'store'|
  'supplier'|
  'notb_category'|
  'notb_goods'|
  'tb_goods'|
  'member_info'|
  'retail_order'|
  'in_order'|
  'loss_order'|
  'out_order'|
  'day_invoicing'


// 抽取类型数据接口类型
export interface ExtrDataType {
  name: string,  // 抽取类型名称
  key: ExtrNameType,   // 抽取类型key
  api?: BizType,
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
