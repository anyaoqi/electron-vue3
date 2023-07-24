import { RowDataPacket } from 'mysql2'
import { initMysql } from './index'

export default {
  getUsers: () => {
    return new Promise((resolve, reject) => {
      initMysql().query('SELECT * FROM user', function (error, results:RowDataPacket[]) {
        if(!error) {
          resolve(results)
        } else {
          reject(error)
        }
      });
    })
  }
}