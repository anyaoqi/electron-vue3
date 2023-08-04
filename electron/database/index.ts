import { initSqlite, close as closeSqlite } from './sqlite3/index'
import serverDb from './eventServer'

export const initDatabase = () => {
  // 连接sqlite
  initSqlite()
}

export const closeDatabase = ()=> {
  // 关闭sqlite
  closeSqlite()
  // 关闭远程数据库
  serverDb.close && serverDb.close()
}