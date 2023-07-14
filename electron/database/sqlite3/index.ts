const sqlite3 = require('sqlite3');
const path = require('path')
const { app } = require('electron')

let DB_PATH = path.join(app.getPath('userData'), '/database.db');
let db = new sqlite3.Database(DB_PATH);

export function initSqlite3 () {
    if(!db) {
        db = new sqlite3.Database(DB_PATH);
    }
}
