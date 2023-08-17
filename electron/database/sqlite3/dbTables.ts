import { initExtrTypeData, initExtrMappData } from "./dbData";
import { useTable } from './hooks'
import { extrTypeDatas } from '../../config/data.config'
// 创建数据抽取字段表
const createExtraction = () => {
  const tableName = "ds_extraction";
  const tableColumns = `
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
  `;
  const { createTable } = useTable()
  createTable(tableName, tableColumns).then(() => {
    initExtrMappData();
  });
};

// 创建抽取分类表
const createExtractionType = async () => {
  const tableName = "ds_extraction_list";
  const tableColumns = `
        id INTEGER PRIMARY KEY,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        type_name TEXT NOT NULL,
        english_flag TEXT NOT NULL UNIQUE,
        sql TEXT
  `;
  const { createTable } = useTable()
  createTable(tableName, tableColumns).then(() => {
    initExtrTypeData();
  });
};

// 店铺信息上传表
// const createDsStore = () => {
//   const tableName = "ds_store";
//   const tableColumns = `
//       id INTEGER PRIMARY KEY,
//       store_id TEXT NOT NULL,
//       license_code TEXT NOT NULL,
//       cust_name TEXT NOT NULL,
//       is_active INTEGER,
//       created_at DATETIME NOT NULL,
//       updated_at DATETIME NOT NULL,
//       is_update INTEGER DEFAULT 0
//   `;
//   const { createTable } = useTable()
//   createTable(tableName, tableColumns).then(() => {});
// };
// // 供应商信息抽取表
// const createDsSupplier = () => {
//   const tableName = "ds_Supplier";
//   const tableColumns = `
//       id INTEGER PRIMARY KEY,
//       created_at DATETIME NOT NULL,
//       updated_at DATETIME NOT NULL,

//       supplier_name TEXT NOT NULL,
//       supplier_code TEXT NOT NULL UNIQUE,
//       contact_person TEXT,
//       contact_tel TEXT,
//       address TEXT,
//       is_active INTEGER
//   `;
//   const { createTable } = useTable()
//   createTable(tableName, tableColumns).then(() => {});
// }

const createDsTables = () => {
  const { createTable } = useTable()
  extrTypeDatas.forEach(table => {
    const tableName = "ds_"+table.key;
    let tableColumns = `
      id INTEGER PRIMARY KEY,
      created_at DATETIME NOT NULL,
      updated_at DATETIME NOT NULL,
    `
    table.apiFilds.forEach((item, index, array) => {
      if(index!==array.length-1) {
        tableColumns+=`${item.filed} TEXT,`
      } else {
        tableColumns+=`${item.filed} TEXT`
      }
    })
    createTable(tableName, tableColumns)
  })
}

// 创建所有表
export const initTable = async () => {
  await createExtraction();
  await createExtractionType();

  // 创建数据抽取表
  await createDsTables()
};
