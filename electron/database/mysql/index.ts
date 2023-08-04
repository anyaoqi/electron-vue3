import mysql, { Connection } from 'mysql2/promise'

let connection:Connection|null = null;

// 数据库配置项
// 数据库配置项
export interface dbConfigType {
  host: string
  user: string
  password: string
  port: number
  database: string
}

/**
 * 初始化数据库连接方法
 * @returns connection
 */
export async function initMysql(config?: dbConfigType): Promise<Connection> {
  console.log('config', config);
  if(connection) return connection
  if(!config) {
    // 默认参数
    config = {
      host     : '172.50.80.188',
      user     : 'root',
      password : 'Hsrc@20230612',
      port: 3306,
      database: 'tobacco', // 填写你自己的数据库名称
    }
  }
  
  connection = await mysql.createConnection({
    ...config,
    dateStrings: true,
  });
  connection.connect().then((err: any) => {
    if(!err){
      console.log('mysql connect success');
    } else {
      console.log('mysql connect error:', err);
    }
  })
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
      const [results, columns] = await db.query(sql)
      console.log('columns', columns);
      
      resolve({ results, columns })
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 关闭数据库连接
 */
export const close = () => {
  if(connection) {
    connection.end()
    connection = null
  }
}