const sqlite3 = require("sqlite3");
const path = require("path");
const { app } = require("electron");

let db: any = null;

// 初始化本地数据库sqlite3
export function initSqlite() {
  if(db) return db
  // 数据库位置：C:\Users\电脑用户名\AppData\Roaming\项目名称\database.db
  let DB_PATH = path.join(app.getPath("userData"), "/database.db");
  // 创建数据库
  db = new sqlite3.Database(DB_PATH, (err: any) => {
    if (!err) {
      console.log("sqlite连接成功, 数据库文件位置："+DB_PATH);
    } else {
      console.log("sqlite连接失败", err)
    }
  });
  return db;
}

// 获取数据库实例
export function getDB() {
  if (!db) {
    db = initSqlite();
  }
  return db;
}

// 关闭数据库连接
export function close() {
  db && db.close((err: any) => {
    if (err) {
      console.error('sqlite数据库关闭失败:', err.message);
    } else {
      console.log('sqlite数据库已关闭');
      db = null
    }
  });
}
