import { initMysql } from './mysql/index'
import { initSqlite3  } from './sqlite3/index'
export const initDatabase = () => {
  initMysql()

  initSqlite3()
}