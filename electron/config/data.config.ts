interface iExtrType {
  name: string,  // 抽取类型名称
  key: string,   // 抽取类型key
  sql?: string,  // 抽取sql
  apiFilds: {
    filed: string,   // 接口字段key
    name: string,    // 接口字段名称
    description: string,  // 描述
    filedValue?: string,  // 对应字段key
    defalutValue?: string  // 默认值
  }[]
}

export const extrTypeDatas: iExtrType[] = [
  {
    name: "门店信息抽取",
    key: "store",
    apiFilds: [
      { filed: "store_id", name: "门店ID", description: "必须,唯一" },
      { filed: "license_code", name: "许可证号", description: "必须" },
      { filed: "cust_name", name: "门店名称", description: "必须" },
      { filed: "is_active", name: "是否启用", description: "必须" },
    ],
  },
  {
    name: "供应商信息抽取",
    key: "supplier",
    apiFilds: [
      { name: "供应商名称", filed: "supplier_name", description: "必须" },
      { name: "供应商编码", filed: "supplier_code", description: "" },
      { name: "联系人", filed: "contact_person", description: "必须,唯一" },
      { name: "联系电话", filed: "contact_tel", description: "" },
      { name: "地址", filed: "address", description: "" },
      { name: "是否启用", filed: "is_active", description: "必须" },
    ],
  },
  {
    name: "非烟商品类别抽取",
    key: "notbCategory",
    apiFilds: [
      { name: "类目编码", filed: "category_code", description: "必须,唯一" },
      { name: "类目名称", filed: "category_name", description: "必须" },
      { name: "上级类目", filed: "parent_category", description: "" },
      { name: "排序码", filed: "order_index", description: "" },
      { name: "是否启用", filed: "is_active", description: "0/1" },
    ],
  },
  {
    name: "非烟商品信息抽取",
    key: "notbGoods",
    apiFilds: [
      { name: "商品标识", filed: "goods_isn", description: "必须,唯一" },
      { name: "商品编码", filed: "goods_code", description: "同商品唯一" },
      { name: "商品名称", filed: "goods_name", description: "必须" },
      { name: "拼音助记码", filed: "shortalpha", description: "必须" },
      { name: "条形码", filed: "bitcode", description: "必须" },
      { name: "计量单位", filed: "unitname", description: "" },
      {
        name: "所属大类编码",
        filed: "first_cust_category_code",
        description: "",
      },
      {
        name: "所属小类编码",
        filed: "second_cust_category_code",
        description: "",
      },
      { name: "品牌", filed: "brand", description: "" },
      { name: "厂家", filed: "factory", description: "" },
      { name: "规格", filed: "spec", description: "" },
      { name: "产地", filed: "address", description: "" },
      { name: "等级", filed: "glass", description: "" },
      { name: "是否散货", filed: "is_sh", description: "" },
      { name: "购进价", filed: "buy_price", description: "必须" },
      { name: "零售价", filed: "retail_price", description: "必须" },
      { name: "备注", filed: "memo", description: "" },
      { name: "是否多包装商品", filed: "is_pack", description: "大包装必须" },
      {
        name: "主商品内码",
        filed: "base_goods_isn",
        description: "大包装必须",
      },
      { name: "包装率", filed: "pack_rate", description: "大包装必须" },
      { name: "是否启用", filed: "is_active", description: "" },
    ],
  },
  {
    name: "会员信息抽取",
    key: "memberInfo",
    apiFilds: [
      { name: "手机号码", filed: "mobile", description: "必须" },
      { name: "昵称", filed: "nickName", description: "必须" },
      { name: "城市编码", filed: "cityCode", description: "必须" },
      { name: "城市名称", filed: "cityName", description: "必须" },
      {
        name: "许可证号",
        filed: "tobaccoLicense",
        description: "如果是门店会员传门店许可证号",
      },
      {
        name: "渠道id",
        filed: "channelId",
        description: "必须，固定值1569964995684937730",
      },
      { name: "出生生日", filed: "dateOfBirth", description: "YYYY-mm-dd" },
      { name: "性别", filed: "sex", description: "性别 0未知 1男 2女" },
    ],
  },
  {
    name: "零售订单信息抽取",
    key: "retailOrder",
    apiFilds: [
      { name: "销售单ID", filed: "clientorderid", description: "必须" },
      {
        name: "销售时间",
        filed: "inputtime",
        description: "必须，销售单发生的实际时间yyyyMMddHHmmss",
      },
      { name: "业务日期", filed: "bizdate", description: "yyyyMMdd" },
      {
        name: "消费者标识",
        filed: "consumersid",
        description: "销售单对应的消费者",
      },
      {
        name: "消费者手机",
        filed: "mobilephone",
        description: "当“消费者标识”和“消费者手机”都传时“消费者手机”优先",
      },
      { name: "商品记录数", filed: "dtlcount", description: "必须" },
      {
        name: "商品标识",
        filed: "dtl_goodsisn",
        description: "必须，1G05返回卷烟代码和非烟档案上传商品标识",
      },
      {
        name: "是否卷烟商品",
        filed: "dtl_istobacco",
        description: "必须，1-卷烟0-非卷烟",
      },
      { name: "销售单位", filed: "dtl_unitid", description: "" },
      { name: "条形码", filed: "dtl_barcode", description: "必须" },
      { name: "零售价", filed: "dtl_saleprice", description: "必须" },
      { name: "购入价", filed: "dtl_buyprice", description: "" },
      { name: "销售数量", filed: "dtl_quantity", description: "必须" },
      { name: "支付明细数", filed: "paydtlcount", description: "" },
      {
        name: "支付渠道",
        filed: "paydtl_fund_channel",
        description:
          "CASH-现金 ALIPAY-支付宝 WEIXIN-微信 CREDITCADE-信用卡 JFEXCHANGE-积分抵扣",
      },
      { name: "支付金额", filed: "paydtl_amount", description: "" },
      { name: "支付说明", filed: "paydtl_remark", description: "" },
      { name: "支付宝交易号", filed: "trade_no", description: "" },
      {
        name: "买家支付宝用户号",
        filed: "buyer_user_id",
        description: "买家在支付宝的用户id",
      },
      {
        name: "买家支付宝账号",
        filed: "buyer_logon_id",
        description: "如：159****5620",
      },
      { name: "交易金额", filed: "total_amount", description: "" },
      { name: "实收金额", filed: "receipt_amount", description: "" },
      {
        name: "付款时间",
        filed: "gmt_payment",
        description: "如：2014-11-27 15:45:57",
      },
    ],
  },
  {
    name: "入库单信息抽取",
    key: "inOrder",
    apiFilds: [
      { name: "入库记录标识", filed: "bill_code", description: "必填,唯一" },
      { name: "供应商编码", filed: "supplier_code", description: "必填" },
      { name: "业务类型", filed: "biz_type", description: "01入库、02退货" },
      { name: "业务日期", filed: "biz_date", description: "YYYY-mm-dd" },
      {
        name: "是否卷烟商品",
        filed: "dtl_is_tobacco",
        description: "1-卷烟、0-非烟",
      },
      { name: "商品代码", filed: "dtl_goodsisn", description: "必须" },
      { name: "条形码", filed: "dtl_barcode", description: "必须" },
      { name: "数量", filed: "dtl_quantity", description: "必须" },
      { name: "单价", filed: "dtl_price", description: "必须" },
    ],
  },
  {
    name: "损溢单信息抽取",
    key: "lossOrder",
    apiFilds: [
      { name: "损益记录标识", filed: "storchecksid", description: "必填" },
      { name: "业务日期", filed: "bizdate", description: "YYYY-MM-dd" },
      { name: "明细记录数", filed: "dtlcount", description: "" },
      {
        name: "是否卷烟商品",
        filed: "dtl_is_tobacco",
        description: "必须, 1-卷烟、0-非烟",
      },
      { name: "商品ID", filed: "dtl_productid", description: "必须" },
      { name: "条形码", filed: "dtl_barcode", description: "必须" },
      {
        name: "损溢数量",
        filed: "dtl_stockqty",
        description: "必须,以包为单位，正数为报溢，负数为报损",
      },
    ],
  },
  {
    name: "其他出入库单信息抽取",
    key: "outOrder",
    apiFilds: [
      { name: "入库记录标识", filed: "bill_code", description: "必填,唯一" },
      { name: "供应商编码", filed: "supplier_code", description: "必填" },
      {
        name: "业务类型",
        filed: "biz_type",
        description: "必须,01入库、02出库",
      },
      { name: "业务类型名称", filed: "biz_type_name", description: "" },
      { name: "业务日期", filed: "biz_date", description: "YYYY-MM-dd" },
      {
        name: "是否卷烟商品",
        filed: "dtl_is_tobacco",
        description: "必须,1-卷烟、0-非烟",
      },
      { name: "条形码", filed: "dtl_barcode", description: "必须" },
      { name: "数量", filed: "dtl_quantity", description: "必须" },
      { name: "商品代码", filed: "dtl_goodsisn", description: "必须" },
      { name: "单价", filed: "dtl_price", description: "必须" },
    ],
  },
  {
    name: "日结进销存信息抽取",
    key: "dayInvoicing",
    apiFilds: [
      { name: "业务日期", filed: "reqdate", description: "YYYY-MM-dd" },
      { name: "商品记录数", filed: "dtlcount", description: "" },
      { name: "商品ID", filed: "dtl_productid", description: "必须" },
      {
        name: "是否卷烟商品",
        filed: "dtl_is_tobacco",
        description: "1-卷烟、0-非烟",
      },
      { name: "期初数量", filed: "dtl_lastqty", description: "必须" },
      { name: "购入数量", filed: "dtl_buyqty", description: "必须" },
      { name: "销售数量", filed: "dtl_saleqty", description: "必须" },
      { name: "损益数量", filed: "dtl_correctqty", description: "必须" },
      { name: "其他出入库数量", filed: "dtl_otherqty", description: "必须" },
      { name: "剩余数量", filed: "dtl_restqty", description: "必须" },
    ],
  },
];
