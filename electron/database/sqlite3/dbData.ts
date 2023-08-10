import { getDB } from "./index";
import { extrTypeDatas } from './data'
import type { TypeData,apiFiledType,extrMappType  } from '@main/types'
// 插入数据方法封装
const dbInsertData = (sql: string, params: any) => {
  return new Promise((resolve, reject) => {
    getDB().run(sql, params, (error: any) => {
      if(error) {
        console.log('Insert data failed：'+error);
        console.log('sql:', sql)
        console.log('params:', params)
        reject(error)
      } else {
        resolve(null)
      }
    });
  })
}


export const insertTypeData = (params: TypeData) => {
  const insertQuery = `
    INSERT INTO ds_extraction_types (type_name, english_flag)
    VALUES ($type_name, $english_flag) ON CONFLICT(english_flag) DO NOTHING
  `
  return dbInsertData(insertQuery, {
    $type_name: params.typeName,
    $english_flag: params.englishFlag
  })
};



export const insertApiFiled = (params: apiFiledType) => {
  const insertQuery = `
    INSERT INTO ds_api_filed (filed_key, filed_name, extraction_key, extraction_name)
    VALUES ($filed_key, $filed_name, $extraction_key, $extraction_name) ON CONFLICT(filed_key) DO NOTHING
  `
  return dbInsertData(insertQuery, {
    $filed_key: params.filedKey,
    $filed_name: params.filedName,
    $extraction_key: params.extractionKey,
    $extraction_name: params.extractionName,
  })
};




export const initExtrTypeData = async () => {
  console.log('initExtrTypeData');
  
  extrTypeDatas.forEach(async data => {
    await insertTypeData(data)
  });
}

const apiFiledDatas = [
  { filedKey: 'store_id', filedName: '门店ID', extractionKey: 'shop', extractionName: '店铺数据抽取' },
  { filedKey: 'license_code', filedName: '许可证号', extractionKey: 'shop', extractionName: '店铺数据抽取' },
  { filedKey: 'cust_name', filedName: '门店名称', extractionKey: 'shop', extractionName: '店铺数据抽取' },
]

export const initApiFiled = async () => {
  apiFiledDatas.forEach(async data => {
    await insertApiFiled(data)
  });
}

export const insertExtrMappData = (params: extrMappType) => {
  const insertQuery = `
    INSERT INTO ds_extraction_mappings (created_at, updated_at, filed,name, filed_value, default_value, description, english_flag, english_name)
    VALUES ($created_at, $updated_at, $filed, $name, $filed_value, $default_value, $description, $english_flag, $english_name) ON CONFLICT(filed) DO NOTHING
  `
  return dbInsertData(insertQuery, {
    $created_at: params.createdAt,
    $updated_at: params.updatedAt,
    $filed: params.filed,
    $name: params.name, 
    $filed_value: params.filedValue, 
    $default_value: params.defaultValue, 
    $description: params.description, 
    $english_flag: params.englishFlag, 
    $english_name: params.englishName
  })
};


export const initExtrMappData = () => {
}