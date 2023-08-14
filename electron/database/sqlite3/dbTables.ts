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

// 创建数据抽取字段表
const createExtraction = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ds_extraction (
        id INTEGER PRIMARY KEY,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        filed TEXT NOT NULL,
        name TEXT,
        filed_value TEXT,
        default_value TEXT,
        description TEXT,
        english_flag TEXT,
        english_name TEXT
    )
  `;

  createTable(createTableQuery)
};

// 创建抽取分类表
const createExtractionType = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ds_extraction_list (
        id INTEGER PRIMARY KEY,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        type_name TEXT NOT NULL,
        english_flag TEXT NOT NULL UNIQUE,
        sql TEXT
    )
  `;

  createTable(createTableQuery).then(() => {
    initExtrTypeData()
  })
};

// 创建所有表
export const initTable = async () => {
  await createExtraction();
  await createExtractionType();
};
