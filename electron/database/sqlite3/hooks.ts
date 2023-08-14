
import { getDB } from "./index";

/**
 * 操作数据
 * @returns { dbInsertData, dbUpdateData }
 */
export const useData = () => {
  // 插入数据方法封装
  const dbInsertData = (sql: string) => {
    return new Promise((resolve, reject) => {
      getDB().run(sql, (error: any) => {
        if (error) {
          console.log("Insert data failed：" + error);
          console.log("sql:", sql);
          reject(error);
        } else {
          resolve(null);
        }
      });
    });
  };
  // 更新数据
  const dbUpdateData = (updateQuery: string) => {
    return new Promise((resolve, reject) => {
      getDB().run(updateQuery, (updateErr: any) => {
        if (updateErr) {
            console.error('Error updating data:', updateErr);
            reject(updateErr)
        } else {
            console.log('Data updated successfully');
            resolve(null)
        }
      });
    })
  }
  /**
   * 保存数据方法参数类型
   */
  interface dbSaveDataType {
    querySql: string // sql查询语句
    update: () => Promise<unknown>  // 更新方法
    insert?: () => Promise<unknown>  // 插入方法
  }

  /**
   * 保存数据
   * 先查询数据是否存在，若存在执行更新，若不存在则执行添加
   * @param querySql sql查询语句
   * @param querytParams sql查询参数
   * @param update 更新方法
   * @param insert  插入方法
   */
  const dbSaveData = (params: dbSaveDataType) => {
    const { querySql, update, insert } = params
    return new Promise((resolve, reject) => {
      // 查询当前数据是否已存在
      getDB().get(querySql, (err: any, row: any) => {
        if (err) {
          reject(err)
          return
        }

        if (row) {
          // 已存在数据，更新操作
          update && update().then(() => {
            resolve(null)
          }).catch(err => {
            reject(err)
          })
        } else {
          //不存在数据，执行插入操作
          insert && insert().then(() => {
            resolve(null)
          }).catch(err => {
            reject(err)
          })
        }
      });
    });
  }

  /**
   * 获取数据
   * @param query 查询sql
   * @param fn 查询方法 默认是get查询单个，可以给为all查询多个
   * @returns Promise
   */
  const dbGetData = (query: string, fn:string ='get') => {
    return new Promise((resolve, reject) => {
      getDB()[fn](query, (err: any, row: any) => {
        !err ? resolve(row) : reject(err)
      })
    })
  }

  return {
    dbInsertData,
    dbUpdateData,
    dbSaveData,
    dbGetData
  }
}
