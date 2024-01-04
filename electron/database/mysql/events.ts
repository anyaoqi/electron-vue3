import { connect, query, close, isConnection } from './index'
import type { dbConfigType, iInsertType } from './index'

export default {
  connectDatabase: ({host, user, password, port, database}: dbConfigType) => {
    return new Promise((resolve, reject) => {
      connect({
        host,
        user,
        password,
        port,
        database
      }).then(() => {
        resolve(true)
      }).catch(err => {
        reject(err)
      })
    })
  },
  queryTableDatas: (sql: string) => {
    return query(sql)
  },
  getShopColums: () => {
    return query('SHOW FULL COLUMNS FROM shop_infos;')
  },
  close: ()=> close(),
  isConnection: () => isConnection(),
  /**
   * insertData方法Promise封装，如果数据已存在则替换
   * @param table 表名
   * @param dataArray 要插入的数据数组，每个元素是一个键值对表示一条数据
   * @param primaryKey 主键字段名
   * @returns
   */
  insertData: ({ table, dataArray, primaryKey }: iInsertType) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (dataArray.length === 0) {
          resolve([]); // 如果数据数组为空，直接返回空数组
          return;
        }
        const result = []
        const errRes = []
        // 循环处理每条数据
        for (const data of dataArray) {
          const columns = Object.keys(data).join(', ');
          const values = Object.values(data).map(value => {
            return (typeof value === 'string' ? `'${value}'` : (value||`''`))
          }).join(', ');

          const updateValues = Object.entries(data)
            .filter(([key]) => key !== primaryKey)
            .map(([key, value]) => `${key} = ${typeof value === 'string' ? `'${value}'` : (value||`''`)}`)
            .join(', ');

          const primaryValue = `${primaryKey} = '${data[primaryKey]}'`
          const sql = `INSERT INTO ${table} (${columns}) VALUES (${values})
                       ON DUPLICATE KEY UPDATE ${updateValues ? updateValues : primaryValue}`;
          try {
            await query(sql);
            result.push(data)
          } catch (err) {
            errRes.push({
              err: err,
              data: data
            })
          }
        }
        // 返回执行结果，包含执行成功和执行失败
        resolve({
          success: result,
          error: errRes
        })
      } catch (error) {
        reject(error)
      }
    });
  },
  uploadDataSql1: (sql: string) => {
    return query(sql)
  },
  uploadDataSql2: (sql: string) => {
    return query(sql)
  }
}