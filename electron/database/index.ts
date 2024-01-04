import { initSqlite, close as closeSqlite } from './sqlite3/index'

// 初始化数据库
export const initDatabase = () => {
  // 连接sqlite
  initSqlite()
}

// 关闭数据库
export const closeDatabase = ()=> {
  // 关闭sqlite
  closeSqlite()
}