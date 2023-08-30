import { useNow, useDateFormat } from '@vueuse/core'
import { extrTypeDatas } from "../../../config/data.config";
import type { TypeData, ExtrMappType, StoreParams, delDataParams } from "../../../types";
import { useData } from "./hooks";

const { 
  dbInsertData,
  dbUpdateData,
  dbSaveData,
  dbGetData,
  dbBatchInsertOrUpdate,
  dbDeleteData
} = useData();

/************************** 抽取类型 **************************/
// 插入数据抽取类型
export const insertTypeData = (params: TypeData) => {
  const nowDate = useDateFormat(useNow(), 'YYYY-MM-DD HH:mm:ss').value;
  params.createdAt = nowDate;
  params.updatedAt = nowDate;
  const { createdAt, updatedAt, typeName, englishFlag, sql } = params;
  const queryParams = {
    created_at: createdAt,
    updated_at: updatedAt,
    type_name: typeName,
    english_flag: englishFlag,
    sql: sql,
  }
  const otherSql = `ON CONFLICT(english_flag) DO NOTHING`;
  return dbInsertData('ds_extraction_list', queryParams, otherSql);
};

// 初始化数据抽取类型数据
export const initExtrTypeData = async () => {
  extrTypeDatas.forEach(async (data) => {
    await insertTypeData({
      typeName: data.name,
      englishFlag: data.key,
      sql: data.sql || "",
      updatedAt: "",
      createdAt: "",
    });
  });
};

// 更新抽取类型sql语句
const updateExtrSqlData = (params: TypeData) => {
  params.updatedAt = useDateFormat(useNow(), 'YYYY-MM-DD HH:mm:ss').value;
  const { englishFlag, sql, updatedAt } = params;
  const queryParams = {
    sql: sql,
    updated_at: updatedAt,
  }
  const where = `english_flag = '${englishFlag}'`
  return dbUpdateData('ds_extraction_list', queryParams, where);
};

// 保存数据抽取sql语句
export const saveExtrSqlData = (params: TypeData) => {
  const { englishFlag } = params;
  const where = `english_flag = '${englishFlag}'`;
  return dbSaveData({
    tableName: 'ds_extraction_list',
    where,
    update: () =>
      new Promise((resolve, reject) => {
        updateExtrSqlData(params)
          .then(() => {
            resolve(null);
          })
          .catch((err) => {
            reject(err);
          });
      }),
  });
};

// 查询数据抽取sql
export const getExtrSqlData = (englishFlag: string) => {
  return dbGetData('ds_extraction_list', `english_flag='${englishFlag}'`);
};

// 插入数据抽取对照数据
const insertExtrMappData = (params: ExtrMappType) => {
  params.createdAt = useDateFormat(useNow(), 'YYYY-MM-DD HH:mm:ss').value;
  params.updatedAt = useDateFormat(useNow(), 'YYYY-MM-DD HH:mm:ss').value;
  const {
    createdAt,
    updatedAt,
    filed,
    name,
    filedValue,
    defaultValue,
    description,
    englishFlag,
    englishName,
  } = params;
  const queryParams = {
    created_at: createdAt,
    updated_at: updatedAt,
    filed: filed,
    name: name,
    filed_value: filedValue,
    default_value: defaultValue,
    description: description,
    english_flag: englishFlag,
    english_name: englishName
  }
  return dbInsertData('ds_extraction', queryParams);
};

// 更新数据对照数据
const updateExtrMappData = (params: ExtrMappType) => {
  params.updatedAt = useDateFormat(useNow(), 'YYYY-MM-DD HH:mm:ss').value;
  const {
    updatedAt,
    filedValue,
    defaultValue,
    description,
    filed,
    englishFlag,
  } = params;

  const updateParams = {
    updated_at: updatedAt,
    filed_value: filedValue,
    default_value: defaultValue,
    description: description,
  }
  const where = `filed = '${filed}' AND english_flag = '${englishFlag}'`
  return dbUpdateData('ds_extraction', updateParams, where);
};

// 保存数据抽取对照配置
export const saveExtrMappData = (params: ExtrMappType) => {
  const { filed, englishFlag } = params;
  const where = `filed = '${filed}' AND english_flag = '${englishFlag}'`;

  return dbSaveData({
    tableName: 'ds_extraction',
    where,
    update: () => new Promise((resolve, reject) => {
        updateExtrMappData(params)
          .then(() => {
            resolve(null);
          })
          .catch((err) => {
            reject(err);
          });
    }),
    insert: () => new Promise((resolve, reject) => {
        insertExtrMappData(params)
          .then(() => {
            resolve(null);
          })
          .catch((err) => {
            reject(err);
          });
    }),
  });
};

// 查询接口对照数据
export const getExtrMappData = (englishFlag: string) => {
  return dbGetData('ds_extraction', `english_flag='${englishFlag}' `,'all');
};

// 初始化数据抽取类型数据
export const initExtrMappData = async () => {
  extrTypeDatas.forEach(async (data) => {
    data.apiFilds.forEach(async (filed: any) => {
      const where = `filed = '${filed.filed}' AND english_flag = '${data.key}'`;
      return dbSaveData({
        tableName: 'ds_extraction',
        where,
        update: () => new Promise(() => {}),
        insert: () => new Promise((resolve, reject) => {
            const nowDate = useDateFormat(useNow(), 'YYYY-MM-DD HH:mm:ss')
            const params = {
              createdAt: nowDate.value,
              updatedAt: nowDate.value,
              filed: filed.filed,
              name: filed.name,
              filedValue: filed.filedValue||'',
              defaultValue: filed.defalutValue||'',
              description: filed.description,
              englishFlag: data.key,
              englishName: data.name
            }
            insertExtrMappData(params)
              .then(() => resolve(null))
              .catch((err) => {
                console.log('insertExtrMappData', err);
                
                reject(err)
              })
        }),
      });
    })
  });
};
/************************** 数据抽取 **************************/
// 插入店铺数据
const insertStoreData = (tableName: string, params: any) => {
  // if(Array.isArray(params)) {
  //   // 批量插入
  //   return dbBatchInsertOrUpdate<StoreBatchParams>('ds_store', params)
  // }
  // 单个插入
  return dbInsertData(tableName, params);
}

const updateStoreData = (tableName: string, params: any, where: string) => {
  // const fields = Object.keys(params)
  // const values = fields.map((field) => `${field} = '${params[field]}'`).join(", ");
  return dbUpdateData(tableName, params, where);
}

// 查询已经更新的
export const getStoreData = (uploadDate: string) => {
  let where = ''
  if(uploadDate) {
    where = `updated_at > DATETIME('${uploadDate}')`;
  }
  return dbGetData('ds_store', where, 'all');
}

export const delStoreData = ({tableName, ids, key}: delDataParams) => {
  dbDeleteData(tableName, ids, key)
}

interface saveDataParams {
  tableName: string,
  where: string
}

export const saveStoreData = (params:saveDataParams, columns: StoreParams) => {
  const { tableName, where } = params
  return dbSaveData({
    tableName, where,
    update: () => updateStoreData(tableName, columns, where),
    insert: () => insertStoreData(tableName, columns)
  });
}

/************************** 门店对照 **************************/
interface StoreCompType {
  store_id: string
  store_name: string
  license_code: string
}

// 获取门店对照
export const getStoreComp = () => {
  return dbGetData('ds_comparison_store', '', 'all');
}

// 更新门店对照
export const updateStoreComp = (columns: StoreCompType) => {
  const tableName = 'ds_comparison_store'
  const where = `store_id = '${columns.store_id}'`
  return dbUpdateData(tableName, columns, where);
}

// 插入门店对照数据
export const insertStoreComp = (columns: StoreCompType|StoreCompType[]) => {
  if(Array.isArray(columns)) {
    // 批量插入
    return dbBatchInsertOrUpdate<StoreCompType>('ds_comparison_store', columns, 'store_id')
  } else {
    // 单个插入
    return dbInsertData('ds_comparison_store', columns);
  }
}

// 保存门店对照
export const saveStoreComp = (columns: StoreCompType) => {
  const where = `store_id = '${columns.store_id}'`
  return dbSaveData({
    tableName: 'ds_comparison_store',
    where: where,
    update: () => updateStoreComp(columns),
    insert: () => insertStoreComp(columns),
  });
}

interface StoreListType {
  cust_uuid: string
  cust_code: string
  cust_name: string
  license_code: string
}

// 获取门店列表
export const getStoreList = ()=> {
  return dbGetData('ds_store_list', '', 'all');
}

// 插入门店数据
export const insertStoreList = (columns: StoreListType|StoreListType[]) => {
  // 单个插入
  return dbInsertData('ds_store_list', columns);
}

// 更新门店数据
export const updateStoreList = (columns: StoreListType) => {
  const tableName = 'ds_store_list'
  const where = `cust_uuid = '${columns.cust_uuid}'`
  return dbUpdateData(tableName, columns, where);
}

// 保存门店列表
export const saveStoreList = (columns: StoreListType|StoreListType[]) => {
  // 批量保存
  if(Array.isArray(columns)) { 
    return dbBatchInsertOrUpdate<StoreListType>('ds_store_list', columns, 'cust_uuid')
  }
  // 单个保存
  const where = `cust_uuid = '${columns.cust_uuid}'`
  return dbSaveData({
    tableName: 'ds_store_list',
    where: where,
    update: () => updateStoreList(columns),
    insert: () => insertStoreList(columns),
  });
}

/************************** 商品对照 **************************/
interface GoodsCompType {
  goods_id: string
  goods_category: string
  goods_code: string
  goods_unit: string
  code_value: string
}

// 获取门店对照
export const getGoodsComp = () => {
  return dbGetData('ds_comparison_goods', '', 'all');
}

// 更新门店对照
export const updateGoodsComp = (columns: GoodsCompType) => {
  const tableName = 'ds_comparison_goods'
  const where = `goods_id = '${columns.goods_id}'`
  return dbUpdateData(tableName, columns, where);
}

// 插入门店对照数据
export const insertGoodsComp = (columns: GoodsCompType|GoodsCompType[]) => {
  if(Array.isArray(columns)) {
    // 批量插入
    return dbBatchInsertOrUpdate<GoodsCompType>('ds_comparison_goods', columns, 'goods_id')
  } else {
    // 单个插入
    return dbInsertData('ds_comparison_goods', columns);
  }
}

// 保存门店对照
export const saveGoodsComp = (columns: GoodsCompType) => {
  const where = `goods_id = '${columns.goods_id}'`
  return dbSaveData({
    tableName: 'ds_comparison_goods',
    where: where,
    update: () => updateGoodsComp(columns),
    insert: () => insertGoodsComp(columns),
  });
}

interface GoodsListType {
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

// 获取门店列表
export const getGoodsList = ()=> {
  return dbGetData('ds_goods_list', '', 'all');
}

// 插入同步商品数据
export const insertGoodsList = (columns: GoodsListType|GoodsListType[]) => {
  if(Array.isArray(columns)) {
    // 批量插入
    return dbBatchInsertOrUpdate<GoodsListType>('ds_goods_list', columns, 'goods_id')
  } else {
    // 单个插入
    return dbInsertData('ds_goods_list', columns);
  }
}

// 更新同步商品数据
export const updateGoodsList = (columns: GoodsListType) => {
  const tableName = 'ds_goods_list'
  const where = `goods_id = '${columns.goods_id}'`
  return dbUpdateData(tableName, columns, where);
}

// 保存商品列表
export const saveGoodsList = (columns: GoodsListType|GoodsListType[]) => {
  // 批量保存
  if(Array.isArray(columns)) { 
    return dbBatchInsertOrUpdate<GoodsListType>('ds_goods_list', columns, 'goods_id')
  }
  const where = `goods_id = '${columns.goods_id}'`
  return dbSaveData({
    tableName: 'ds_goods_list',
    where: where,
    update: () => updateGoodsList(columns),
    insert: () => insertGoodsList(columns),
  });
}