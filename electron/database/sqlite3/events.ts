import { 
  saveExtrMappData, 
  saveExtrSqlData, 
  getExtrSqlData, 
  getExtrMappData, 
  saveStoreData,
  getStoreData,
  delStoreData,
  saveStoreList,
  getStoreComp,
  updateStoreComp,
  getStoreList,
  saveStoreComp,
  getGoodsComp,
  getGoodsList,
  saveGoodsList,
  saveGoodsComp,
} from './dbData'
import type { TypeData, ExtrMappType, delDataParams } from "../../../types";

export default {
  saveExtrMappData: (params: ExtrMappType) => saveExtrMappData(params),
  saveExtrSqlData: (params: TypeData) => saveExtrSqlData(params),
  getExtrSqlData: (englishFlag: string) => getExtrSqlData(englishFlag),
  getExtrMappData: (englishFlag: string) => getExtrMappData(englishFlag),
  saveStoreData: (params: any, columns: any) => saveStoreData(params, columns),
  getStoreData: (params: any) => getStoreData(params),
  delStoreData: (params: delDataParams) => delStoreData(params),
  saveStoreList: (params: any) => saveStoreList(params),
  updateStoreComp: (params: any) => updateStoreComp(params),
  getStoreList: () => getStoreList(),
  getStoreComp: () => getStoreComp(),
  saveStoreComp: (columns: any) => saveStoreComp(columns),
  getGoodsComp: () => getGoodsComp(),
  getGoodsList: () => getGoodsList(),
  saveGoodsList: (columns:any) => saveGoodsList(columns),
  saveGoodsComp: (columns:any) => saveGoodsComp(columns),
};
