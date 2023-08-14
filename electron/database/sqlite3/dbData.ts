import { extrTypeDatas } from "../../config/data.config";
import type { TypeData, extrMappType } from "../../types";
import { useData } from "./hooks";

const { dbInsertData, dbUpdateData, dbSaveData, dbGetData } = useData();

/************************** 抽取类型 **************************/
// 插入数据抽取类型
export const insertTypeData = (params: TypeData) => {
  const nowDate = new Date().toISOString();
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
  params.updatedAt = new Date().toISOString();
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
  const query = `SELECT * FROM ds_extraction_list WHERE english_flag='${englishFlag}' LIMIT 1`;
  return dbGetData(query);
};
// getExtrSqlData()
/************************** 数据对照 **************************/
// 插入数据抽取对照数据
const insertExtrMappData = (params: extrMappType) => {
  params.createdAt = new Date().toISOString();
  params.updatedAt = new Date().toISOString();
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
const updateExtrMappData = (params: extrMappType) => {
  params.updatedAt = new Date().toISOString();
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
export const saveExtrMappData = (params: extrMappType) => {
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
  const query = `SELECT * FROM ds_extraction WHERE english_flag='${englishFlag}'`;
  return dbGetData(query, 'all');
};
