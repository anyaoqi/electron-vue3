// import mysql from 'mysql'
const mysql = require('mysql2')

export function initMysql() {
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'yq123456',
    port: 3306,
    database: 'mysql', // 填写你自己的数据库名称
  });

  connection.connect();
  // console.log('mysql', connection.query)
  connection.query('SELECT * FROM user', function (error, results, fields) {
    if (error) {
      console.log('error', error);
    }
    console.log('results: ', results.length);
  });
}

