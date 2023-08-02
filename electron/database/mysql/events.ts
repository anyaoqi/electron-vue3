import { initMysql, query } from './index'
import type { dbConfigType } from './index'
export default {
  connectDatabase: ({host, user, password, port, database}: dbConfigType) => {
    return new Promise((resolve, reject) => {
      initMysql({
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
  getShopInfos: (sql: string) => {
    // return query('SELECT * FROM shop_infos')
    return query(sql)
  }
}