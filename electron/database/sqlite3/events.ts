import { 
  saveExtrMappData, 
  saveExtrSqlData, 
  getExtrSqlData, 
  getExtrMappData, 
  saveStoreData,
  getStoreData,
  delStoreData
} from './dbData'
import type { TypeData, ExtrMappType, delDataParams } from "../../types";

export default {
  saveExtrMappData: (params: ExtrMappType) => saveExtrMappData(params),
  saveExtrSqlData: (params: TypeData) => saveExtrSqlData(params),
  getExtrSqlData: (englishFlag: string) => getExtrSqlData(englishFlag),
  getExtrMappData: (englishFlag: string) => getExtrMappData(englishFlag),
  saveStoreData: (params: any, columns: any) => saveStoreData(params, columns),
  getStoreData: (uploadDate: string) => getStoreData(uploadDate),
  delStoreData: (params: delDataParams) => delStoreData(params),
};
