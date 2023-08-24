import { getDB } from "./index";

// 定义数据类型
interface InsertData {
  [key: string]: any;
}

/**
 * 操作数据
 * @returns { dbInsertData, dbUpdateData }
 */
export const useData = () => {
  // 批量插入方法
  const dbBatchInsert = <T extends InsertData>(
    table: string,
    data: T[]
  ): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      // 开始事务
      getDB().serialize(() => {
        getDB().run("BEGIN TRANSACTION");

        // 创建预备语句对象
        const fields = Object.keys(data[0]);
        const fieldPlaceholders = fields.map(() => "?").join(", ");
        const insertQuery = `INSERT INTO ${table} (${fields.join(
          ", "
        )}) VALUES (${fieldPlaceholders})`;
        const stmt = getDB().prepare(insertQuery);

        // 执行批量插入操作
        data.forEach((item) => {
          const values = fields.map((field) => item[field]);
          stmt.run(...values);
        });

        // 完成后销毁预备语句对象
        stmt.finalize();

        // 提交事务
        getDB().run("COMMIT", (err: any) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  };
  // 插入数据方法封装
  const dbInsertData = (tableName: string, columns: any, sql: string='') => {
    const fields = Object.keys(columns);
    const values = fields.map((field) => `'${columns[field]}'`).join(", ");
    const insertQuery = `INSERT INTO ${tableName} (${fields.join(
      ", "
    )}) VALUES (${values}) ${sql}`;
    return new Promise((resolve, reject) => {
      getDB().run(insertQuery, (error: any) => {
        if (error) {
          console.log("Insert data failed：" + error);
          console.log("sql:", insertQuery);
          reject(error);
        } else {
          resolve(null);
        }
      });
    });
  };
  // 更新数据
  const dbUpdateData = (tableName: string, params: any, where?: string) => {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(params)
      const values = fields.map((field) => `${field} = '${params[field]}'`).join(", ");
      where = where ? `WHERE ${where}` : ''
      const updateQuery = `
        UPDATE ${tableName} SET ${values}
        ${where}
      `;
      getDB().run(updateQuery, (updateErr: any) => {
        if (updateErr) {
          console.log(updateQuery);
          console.error("Error updating data:", updateErr);
          reject(updateErr);
        } else {
          resolve(null);
        }
      });
    });
  };

  const dbDeleteData = (tableName: string, ids: string[], key:string='id') => {
    return  new Promise((resolve, reject) => {
      const deleteQuery = `DELETE FROM ${tableName} WHERE ${key} IN (${ids.join(',')})`;

      getDB().run(deleteQuery, (error: any) => {
        if(error) {
          console.log(deleteQuery);
          console.log('delete error:'+error);
          reject(error)
        } else {
          resolve(null)
        }
      })
    })
  }
  /**
   * 保存数据方法参数类型
   */
  interface dbSaveDataType {
    tableName: string // 表名
    where: string // 表名
    update: () => Promise<unknown> // 更新方法
    insert?: () => Promise<unknown> // 插入方法
  }

  /**
   * 保存数据
   * 先查询数据是否存在，若存在执行更新，若不存在则执行添加
   * @param querySql sql查询语句
   * @param querytParams sql查询参数
   * @param update 更新方法
   * @param insert  插入方法
   */
  const dbSaveData = (params: dbSaveDataType) => {
    const { tableName, where, update, insert } = params;
    const querySql = `SELECT * FROM ${tableName} WHERE ${where}`;
    return new Promise((resolve, reject) => {
      // 查询当前数据是否已存在
      getDB().get(querySql, (err: any, row: any) => {
        if (err) {
          console.log(querySql);
          console.log(err);
          reject(err);
          return;
        }

        if (row) {
          // 已存在数据，更新操作
          update && update()
        } else {
          //不存在数据，执行插入操作
          insert && insert()
        }
        resolve(null)
      });
    });
  };

  /**
   * 获取数据
   * @param query 查询sql
   * @param fn 查询方法 默认是get查询单个，可以给为all查询多个
   * @returns Promise
   */
  const dbGetData = (tableName: string, where?: string, fn: 'get'|'all'='get') => {
    return new Promise((resolve, reject) => {
      where = where ? `WHERE ${where}` : '';
      const query = `SELECT * FROM ${tableName} ${where}`;
      getDB()[fn](query, (err: any, row: any) => {
        !err ? resolve(row) : reject(err);
      });
    });
  };

  return {
    dbInsertData,
    dbUpdateData,
    dbSaveData,
    dbGetData,
    dbBatchInsert,
    dbDeleteData
  };
};

/**
 * 操作表
 */
export const useTable = () => {
  // 创建表方法封装
  const createTable = (tableName: string, tableColumns: string) => {
    const createQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${tableColumns})`;
    return new Promise((resolve, reject) => {
      getDB().run(createQuery, (error: any) => {
        if(error){
          console.log(createQuery);
          console.log('create table error', error);
          reject(error)
        } else {
          resolve(null)
        }
      });
    });
  };

  return {
    createTable
  }
}
