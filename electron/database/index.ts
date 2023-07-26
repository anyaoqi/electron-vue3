import { initMysql } from './mysql/index'
import { initSqlite  } from './sqlite3/index'
export const initDatabase = () => {
  // 连接mysql
  initMysql()
  // 连接sqlite
  initSqlite()
}