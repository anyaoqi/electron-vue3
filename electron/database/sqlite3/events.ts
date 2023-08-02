import { getDB } from './index'

export default  {
  createTables: () => {
    
  },
  getUserOne: (name: string) => {
    return new Promise((resolve, reject) => {
      getDB().all(`SELECT * FROM user WHERE name='${name}'`, function (err: any, rows: any) {
        if(!err) {
          resolve(rows)
        } else {
          console.log("SQL ERROR:", err);
          reject(err)
        }
      });
    })
  },
}

