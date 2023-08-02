import { initSqlite  } from './sqlite3/index'
export const initDatabase = () => {
  // 连接sqlite
  initSqlite()
}