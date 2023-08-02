import { initMysql, query } from './index'

export default {
  connectDatabase: (config: any) => {
    console.log(config);
    return new Promise((resolve, reject) => {
      initMysql().then(() => {
        resolve(true)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getShopInfos: () => {
    return query('SELECT * FROM shop_infos')
  }
}