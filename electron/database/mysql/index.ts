import mysql, { Connection } from 'mysql2/promise'
import logger from '../../logger';

let connection:Connection|null = null;

// 数据库配置项
export interface dbConfigType {
  host: string
  user: string
  password: string
  port: number
  database: string
}

export interface iInsertType {
  table: string, dataArray: Record<string, any>[], primaryKey:string
}

// 连接数据库
export const connect = async (config?: dbConfigType): Promise<Connection>  =>  {
  return new Promise(async (resolve, reject) => {
    if(!config) {
      // 默认参数
      config = {
        host     : '',
        user     : '',
        password : '',
        port: 3306,
        database: '', // 填写你自己的数据库名称
      }
    }
    try {
      connection = await mysql.createConnection({
        ...config,
        dateStrings: true,
      });
      resolve(connection)
    } catch (err) {
      close()
      reject(err)
    }
  })
}

/**
 * 初始化数据库连接
 * @returns connection
 */
export async function initMysql(config?: dbConfigType): Promise<Connection> {
  if(connection) return connection

  connection = await connect(config)
  return connection
}

/**
 * query方法Promise封装
 * @param sql
 * @returns
 */
export const query = (sql: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initMysql()
      const [results, columns] = await db.query(sql)
      resolve({ results, columns })
    } catch (error) {
      logger.error(`[mysql]query语句执行失败：${error} \n sql语句：${sql}`)
      reject(error)
    }
  })
}


/**
 * 数据库当前是否连接
 * @returns 
 */
export const isConnection = async ()=> {
  return new Promise((resolve, reject) => {
    if(!connection) {
      resolve(false)
      return
    }
    connection.connect().then((conn: any) => {
      if(conn) {
        resolve(true)
      } else {
        resolve(false)
      }
    }).catch((error) => {
      logger.error('测试数据库连接失败：'+error)
      reject(error)
    })
  })
}

/**
 * 关闭数据库连接
 */
export function close(){
  if(connection) {
    connection.end()
    connection = null
    logger.error(`mysql关闭数据库连接`)
  }
}