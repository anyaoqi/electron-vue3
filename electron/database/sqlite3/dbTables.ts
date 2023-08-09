import { getDB } from "./index";
import { initExtrTypeData } from './dbData'

// 创建表方法封装
const createTable = (sql: string) => {
  return new Promise((resolve, reject) => {
    getDB().run(sql, (error: any) => {
      !error ? resolve(null) : reject(error)
    });
  });
};

// 创建接口字段表
const createApiFiled = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ds_api_filed (
        id INTEGER PRIMARY KEY,
        filed_id TEXT NOT NULL,
        filed_name TEXT NOT NULL,
        extraction_key TEXT UNIQUE,
        extraction_name TEXT,
        CONSTRAINT non_empty_name CHECK (filed_name != ''),
        CONSTRAINT non_empty_key CHECK (extraction_key != '')
    )
  `;
  return createTable(createTableQuery);
};

// 创建数据抽取字段表
const createExtraction = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ds_extraction_mappings (
        id INTEGER PRIMARY KEY,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        api_field TEXT NOT NULL,
        db_field TEXT,
        default_value TEXT UNIQUE,
        description TEXT
    )
  `;

  return createTable(createTableQuery);
};

// 创建抽取分类表
const createExtractionType = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ds_extraction_types (
        id INTEGER PRIMARY KEY,
        type_name TEXT NOT NULL,
        english_flag TEXT NOT NULL
    )
  `;

  createTable(createTableQuery).then(() => {
    initExtrTypeData()
  })
};

// 创建所有表
export const initTable = async () => {
  await createApiFiled();
  await createExtraction();
  await createExtractionType();
};
