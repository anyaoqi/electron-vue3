import mysql, { Connection } from 'mysql2/promise'

let connection:Connection|null = null;

/**
 * 初始化数据库连接方法
 * @returns connection
 */
export async function initMysql(): Promise<Connection> {
  if(connection) return connection

  connection = await mysql.createConnection({
    host     : '172.50.80.188',
    user     : 'root',
    password : 'Hsrc@20230612',
    port: 3306,
    database: 'tobacco', // 填写你自己的数据库名称
  });
  return connection
}


/**
 * query方法Promise封装
 * @param sql
 * @returns
 */
export const query = (sql: string) => {
  return new Promise((resolve, reject) => {
    initMysql().then(async db => {
      const [results] = await db.query(sql)
      resolve(results)
    }).catch(err => {
      reject(err)
    })
  })
}