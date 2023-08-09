import { getDB } from "./index";

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

interface TypeData {
  typeName: string,
  englishFlag: string,
}

export const insertTypeData = (params: TypeData) => {
  const insertQuery = `
    INSERT INTO ds_extraction_types (type_name, english_flag)
    VALUES ($typeName, $englishFlag)
  `
  return dbInsertData(insertQuery, {
    $typeName: params.typeName,
    $englishFlag: params.englishFlag
  })
};

export const initExtrTypeData = async () => {
  await insertTypeData({ typeName: '店铺数据抽取', englishFlag: 'shop' })
  await insertTypeData({ typeName: '供应商数据抽取', englishFlag: 'supplier' })
}

