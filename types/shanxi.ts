// 零售订单信息抽取-参数接口类型
export interface FieldRetailOrder {
  customersid: string // 客户ID
  clientorderid: string // 销售单ID
  inputtime: string // 销售时间
  bizdate: string // 业务日期
  consumersid: string // 消费者标识
  mobilephone: string // 消费者手机
  dtlcount: string // 商品记录数
  dtl_goodsisn: string[] // 商品标识
  dtl_istobacco: string[] // 是否卷烟商品
  dtl_unitid: string[] // 销售单位
  // dtl_barcode: string[] // 条形码
  dtl_saleprice: string[] // 零售价
  dtl_buyprice: string[] // 购入价
  dtl_quantity: string[] // 销售数量
  paydtlcount: string // 支付明细数
  paydtl_fund_channel: string[] // 支付渠道
  paydtl_amount: string[] // 支付金额
  paydtl_remark: string[] // 支付说明
  trade_no: string // 支付宝交易号
  buyer_user_id: string // 买家支付宝用户号
  buyer_logon_id: string // 买家支付宝账号
  total_amount: string // 交易金额
  receipt_amount: string // 实收金额
  gmt_payment: string // 付款时间
}

// 损溢单信息抽取-参数接口类型
export interface FieldLossOrder {
  customersid: string // 客户ID
  storchecksid: string // 损益记录标识
  bizdate: string // 业务日期
  dtlcount: string // 明细记录数
  dtl_productid: string[] // 商品ID
  dtl_stockqty: string[] // 损溢数量
}

// 日结进销存信息抽取
export interface FieldDayInvoicing {
  customersid: string // 客户ID
  reqdate: string // 业务日期
  dtlcount: string // 商品记录数
  dtl_productid: string[] // 商品ID
  dtl_lastqty: string[] // 期初数量
  dtl_buyqty: string[] // 购入数量
  dtl_saleqty: string[] // 销售数量
  dtl_correctqty: string[] // 损益数量
  dtl_restqty: string[] // 剩余数量
}

export interface FieldApi1049 {
  begindate: string,
  enddate: string,
  orderdate: string
}