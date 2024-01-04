import { initExtrTypeData, initExtrMappData } from "./dbData";
import { useTable } from './hooks'
import { extrTypeDatas } from '../../../config/data.config'

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
    table.apiFilds.forEach((item: any, index:number, array: any[]) => {
      if(index!==array.length-1) {
        tableColumns+=`${item.filed} TEXT,`
      } else {
        tableColumns+=`${item.filed} TEXT`
      }
    })
    createTable(tableName, tableColumns)
  })
}

// 创建门店对照表
const createDsComparisonStore  = () => {
  const { createTable } = useTable()
  const tableName = 'ds_comparison_store';
  const tableColumns = `
      store_id TEXT NOT NULL UNIQUE,
      cust_uuid TEXT,
      store_name TEXT,
      cust_code TEXT,
      cust_name TEXT,
      license_code TEXT
  `;
  return createTable(tableName, tableColumns)
}


// 创建商品对照表
const createDsComparisonGoods  = () => {
  const { createTable } = useTable()
  const tableName = 'ds_comparison_goods';
  const tableColumns = `
      goods_id TEXT NOT NULL UNIQUE,
      goods_category TEXT,
      goods_code TEXT,
      goods_unit TEXT,
      code_value TEXT
  `;
  return createTable(tableName, tableColumns)
}


// 创建同步门店列表
const createDsStoreList  = () => {
  const { createTable } = useTable()
  const tableName = 'ds_store_list';
  const tableColumns = `
      cust_uuid TEXT NOT NULL UNIQUE,
      cust_code TEXT,
      cust_name TEXT,
      license_code TEXT
  `;
  return createTable(tableName, tableColumns)
}

// 创建同步商品列表
const createDsGoodsList  = () => {
  const { createTable } = useTable()
  const tableName = 'ds_goods_list';
  const tableColumns = `
      goods_id TEXT NOT NULL UNIQUE,
      goods_code TEXT,
      goods_name TEXT,
      barcode TEXT,
      pack_barcode TEXT,
      wholesale_price TEXT,
      msrp TEXT,
      conversion_ratio TEXT,
      brand TEXT,
      manufacturer_name TEXT,
      is_new TEXT,
      backbone_brand TEXT,
      goods_image TEXT,
      mnemonic_code_pinyin TEXT,
      home_e TEXT,
      mnemonic_code_number TEXT,
      online_ordering TEXT,
      retail_price TEXT,
      message_code TEXT,
      brand_identity TEXT,
      manufacturer_identity TEXT,
      smoke_abnormal TEXT,
      smoke_province TEXT,
      default_unit TEXT,
      brand_code TEXT,
      manufacturer_code TEXT,
      is_import TEXT,
      price_class_code TEXT,
      price_class_name TEXT,
      disabled TEXT,
      tar_content TEXT,
      packaging_type TEXT,
      total_records TEXT
  `;
  return createTable(tableName, tableColumns)
}

// 初始化所有表
export const initTable = async () => {
  await createExtraction();
  await createExtractionType();

  // 创建数据抽取表
  await createDsTables()
  // 创建门店对照表
  await createDsComparisonStore()
  // 创建商品对照表
  await createDsComparisonGoods()
  // 创建门店列表
  await createDsStoreList()
  // 创建同步商品表
  await createDsGoodsList()
};
