import { useNow, useDateFormat } from '@vueuse/core'
import { extrTypeDatas } from "../../config/data.config";
import type { TypeData, ExtrMappType, StoreParams, delDataParams } from "../../types";
import { useData } from "./hooks";

const { 
  dbInsertData, 
  dbUpdateData, 
  dbSaveData, 
  dbGetData, 
  dbBatchInsert,
  dbDeleteData
} = useData();

/************************** 抽取类型 **************************/
// 插入数据抽取类型
export const insertTypeData = (params: TypeData) => {
  const nowDate = useDateFormat(useNow(), 'YYYY-MM-DD HH:mm:ss').value;
  params.createdAt = nowDate;
  params.updatedAt = nowDate;
  const { createdAt, updatedAt, typeName, englishFlag, sql } = params;
  const insertQuery = `
    INSERT INTO ds_extraction_list (created_at, updated_at, type_name, english_flag, sql)
    VALUES ('${createdAt}', '${updatedAt}', '${typeName}', '${englishFlag}', '${sql}') ON CONFLICT(english_flag) DO NOTHING
  `;
  return dbInsertData(insertQuery);
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
  const updateQuery = `
    UPDATE ds_extraction_list
    SET sql = '${sql}', updated_at = '${updatedAt}'
    WHERE english_flag = '${englishFlag}';
  `;
  return dbUpdateData(updateQuery);
};

// 保存数据抽取sql语句
export const saveExtrSqlData = (params: TypeData) => {
  const { englishFlag } = params;
  const querySql = `SELECT * FROM ds_extraction_list WHERE english_flag = '${englishFlag}'`;
  return dbSaveData({
    querySql,
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
// getExtrSqlData()
/************************** 数据对照 **************************/
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
  const insertQuery = `
    INSERT INTO ds_extraction (
      created_at,
      updated_at,
      filed,name,
      filed_value,
      default_value,
      description,
      english_flag,
      english_name
    ) VALUES (
      '${createdAt}',
      '${updatedAt}',
      '${filed}',
      '${name}',
      '${filedValue}',
      '${defaultValue}',
      '${description}',
      '${englishFlag}',
      '${englishName}'
    )
  `;
  return dbInsertData(insertQuery);
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

  const updateQuery = `
    UPDATE ds_extraction
    SET updated_at = '${updatedAt}', filed_value = '${filedValue}', default_value = '${defaultValue}', description = '${description}'
    WHERE filed = '${filed}' AND english_flag = '${englishFlag}'
  `;
  return dbUpdateData(updateQuery);
};

// 保存数据抽取对照配置
export const saveExtrMappData = (params: ExtrMappType) => {
  const { filed, englishFlag } = params;
  const querySql = `SELECT * FROM ds_extraction WHERE filed = '${filed}' AND english_flag = '${englishFlag}'`;

  return dbSaveData({
    querySql,
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
    data.apiFilds.forEach(async filed => {
      const querySql = `SELECT * FROM ds_extraction WHERE filed = '${filed.filed}' AND english_flag = '${data.key}'`;
      return dbSaveData({
        querySql,
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
              .catch((err) => reject(err))
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
  //   return dbBatchInsert<StoreBatchParams>('ds_store', params)
  // }
  // 单个插入
  const fields = Object.keys(params);
  const values = fields.map((field) => `'${params[field]}'`).join(", ");
  const insertQuery = `INSERT INTO ${tableName} (${fields.join(
    ", "
  )}) VALUES (${values})`;
  return dbInsertData(insertQuery);
}

const updateStoreData = (tableName: string, params: any, where: string) => {
  const fields = Object.keys(params)
  const values = fields.map((field) => `${field} = '${params[field]}'`).join(", ");
  const updateQuery = `
    UPDATE ${tableName} SET ${values}
    WHERE ${where}
  `;
  return dbUpdateData(updateQuery);
}

// 查询已经更新的
export const getStoreData = (uploadDate: string) => {
  let where = ''
  if(uploadDate) {
    where = `updated_at > DATETIME('${uploadDate}')`;
  }
  return dbGetData('ds_store', where);
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
  const querySql = `SELECT * FROM ${tableName} WHERE ${where}`;
  console.log('querySql', querySql);
  
  return dbSaveData({
    querySql,
    update: () => new Promise((resolve, reject) => {
      // const where = `WHERE store_id = '${store_id}`
      updateStoreData(tableName, columns, where)
          .then(() => {
            resolve(null);
          })
          .catch((err) => {
            reject(err);
          });
    }),
    insert: () => new Promise((resolve, reject) => {
      insertStoreData(tableName, columns)
          .then(() => {
            resolve(null);
          })
          .catch((err) => {
            reject(err);
          });
    }),
  });
}