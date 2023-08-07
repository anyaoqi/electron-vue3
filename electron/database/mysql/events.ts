import { connect, query, close, isConnection } from './index'
import type { dbConfigType } from './index'

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
  getShopInfos: (sql: string) => {
    // return query('SELECT * FROM shop_infos')
    return query(sql)
  },
  getShopColums: () => {
    return query('SHOW FULL COLUMNS FROM shop_infos;')
  },
  close: ()=> close(),
  isConnection: () => isConnection()
}