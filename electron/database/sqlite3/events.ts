import { getDB } from "./index";
import { saveExtrMappData, saveExtrSqlData, getExtrSqlData, getExtrMappData } from './dbData'

export default {
  getUserOne: (name: string) => {
    return new Promise((resolve, reject) => {
      getDB().all(
        `SELECT * FROM user WHERE name='${name}'`,
        function (err: any, rows: any) {
          if (!err) {
            resolve(rows);
          } else {
            console.log("SQL ERROR:", err);
            reject(err);
          }
        }
      );
    });
  },
  saveExtrMappData: (params: any) => saveExtrMappData(params),
  saveExtrSqlData: (params: any) => saveExtrSqlData(params),
  getExtrSqlData: (englishFlag: string) => getExtrSqlData(englishFlag),
  getExtrMappData: (englishFlag: string) => getExtrMappData(englishFlag),
};
