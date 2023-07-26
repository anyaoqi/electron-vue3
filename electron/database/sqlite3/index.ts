const sqlite3 = require("sqlite3");
const path = require("path");
const { app } = require("electron");

let db: any = null;

export function initSqlite() {
  let DB_PATH = path.join(app.getPath("userData"), "/database.db");

  db = new sqlite3.Database(DB_PATH, (err: any) => {
    if (!err) {
      console.log("sqlite connect success");
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
