import mysql, { RowDataPacket } from 'mysql2'

export function initMysql() {
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'yq123456',
    port: 3306,
    database: 'mysql', // 填写你自己的数据库名称
  });

  connection.connect();

  connection.query('SELECT * FROM user', function (error, results:RowDataPacket[], fields) {
    if (error) {
      console.log('error', error);
    }
    if(results.length) {
      console.log('results: ', results.length);
    }
  });
}

