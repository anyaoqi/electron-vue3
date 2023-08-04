const sqlite3 = require("sqlite3");
const path = require("path");
const { app } = require("electron");

let db: any = null;

export function initSqlite() {
  if(db) return db

  let DB_PATH = path.join(app.getPath("userData"), "/database.db");

  db = new sqlite3.Database(DB_PATH, (err: any) => {
    if (!err) {
      console.log("sqlite connect successfully");
    } else {
       console.log("sqlite connect error", err)
    }
  });
  return db;
}

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
      console.error('Error closing the database:', err.message);
    } else {
      console.log('Database connection closed successfully.');
      db = null
    }
  });
}
