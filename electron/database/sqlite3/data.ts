import type { TypeData, apiFiledType, extrMappType } from "@main/types";

export const extrTypeDatas = [
  { typeName: "店铺数据抽取", englishFlag: "shop" },
  { typeName: "供应商数据抽取", englishFlag: "supplier" },
  { typeName: "非烟商品类别抽取", englishFlag: "notbCategory" },
  { typeName: "非烟商品信息抽取", englishFlag: "notbGoods" },
  { typeName: "会员信息抽取", englishFlag: "memberInfo" },
  { typeName: "零售订单信息抽取", englishFlag: "retailOrder" },
  { typeName: "入库单信息抽取", englishFlag: "inOrder" },
  { typeName: "损溢单信息抽取", englishFlag: "lossOrder" },
  { typeName: "其他出入库单信息抽取", englishFlag: "outOrder" },
  { typeName: "日结进销存信息抽取", englishFlag: "dayInvoicing" },
];

export const extrMappData = [
  // 店铺数据抽取
  {
    filed: "store_id", // 接口字段key
    name: "门店id", // 接口字段名称
    englishFlag: "store", // 抽取类型key
    englishName: "门店信息抽取", // 抽取类型名称
  },
  {
    apiField: "license_code",
    apiFieldName: "许可证号",
    required: 1,
    englishFlag: "store",
    englishName: "门店信息抽取",
  },
  {
    apiField: "cust_name",
    apiFieldName: "门店名称",
    required: 1,
    englishFlag: "store",
    englishName: "门店信息抽取",
  },
  {
    apiField: "is_active",
    apiFieldName: "是否启用",
    required: 1,
    englishFlag: "store",
    englishName: "门店信息抽取",
    defaultValue: "1",
  },
  // 供应商信息抽取
  {
    apiFieldName: "供应商名称",
    apiField: "supplier_name",
    required: 1,
    englishFlag: "supplier",
    englishName: "供应商信息抽取",
  },
  {
    apiFieldName: "供应商编码",
    apiField: "supplier_code",
    required: 1,
    englishFlag: "supplier",
    englishName: "供应商信息抽取",
  },
  {
    apiFieldName: "联系人",
    apiField: "contact_person",
    required: 0,
    englishFlag: "supplier",
    englishName: "供应商信息抽取",
  },
  {
    apiFieldName: "联系电话",
    apiField: "contact_tel",
    required: 0,
    englishFlag: "supplier",
    englishName: "供应商信息抽取",
  },
  {
    apiFieldName: "地址",
    apiField: "address",
    required: 0,
    englishFlag: "supplier",
    englishName: "供应商信息抽取",
  },
];
