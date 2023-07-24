import mysql, { Connection } from 'mysql2'

let connection:null|Connection = null;

export function initMysql():Connection {
  if(!connection) {
    connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'yq123456',
      port: 3306,
      database: 'mysql', // 填写你自己的数据库名称
    });
  }
  return connection
}