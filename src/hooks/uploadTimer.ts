import { ref } from 'vue'
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import { useNow, useDateFormat } from "@vueuse/core";
import { useStore } from "@/pinia/index";
import { findFiledValues } from "@/utils";
import type {
  FieldsStore,
  FieldsSupplier,
  FieldsNotbCategory,
  FieldsNotbGoods,
  FieldsMemberInfo,
  FieldRetailOrder,
  FieldInOrder,
  FieldLossOrder,
  FieldOutOrder,
  FieldDayInvoicing,
  StoreCompType,
  GoodsListType,
  LicenseOptionType,
} from "@type/index";
import { useData } from "@/hooks/dataExtraction";
import { useLoading } from '@/hooks/index'
import * as apis from "@/apis";
import { extrTypeDatas } from "../../config/data.config";
import logger from "@/utils/logger";

/**
 * 定时相关操作
 * @param isOpenTimer 
 */
export const useTimer = (isOpenTimer: Ref<boolean>) => {
  let timer: any = null;
  // 定时间隔时间
  let timing = 1000 * 60 * 30  // 30分钟触发一次

  // 开发环境调试
  if(import.meta.env.DEV) {
    timing = 1000 * 60 * 2; //
  }

  // 创建一个定时器
  const newTimout = (callback: () => void) => {
    // 关闭上一个定时器
    if (timer != null) {
      clearTimeout(timer);
      timer = null;
    }
    // 开启定时器
    timer = setTimeout(() => {
      // 判断定时器开关是否关闭 若关闭了定时器开关需要在这里清除定时器
      if (isOpenTimer.value === false) {
        timer && clearTimeout(timer);
        timer = null;
        return;
      }
      // 执行业务逻辑
      callback && callback();
      // 定时即将结束时，开启一个新的定时器
      newTimout(callback);
    }, timing);
  };

  // 开启定时抽取
  const openTimer = (callback: () => void) => {
    isOpenTimer.value = true;
    newTimout(callback);
  };

  // 关闭定时器
  const closeTimeout = () => {
    isOpenTimer.value = false;
    clearTimeout(timer);
    timer = null;
  };

  return {
    openTimer,
    closeTimeout,
    isOpenTimer,
  };
};

/**
 * 数据抽取相关操作
 */
export const useUpload = () => {
  const store = useStore();
  const { isOpenTimer } = storeToRefs(store);
  const { openTimer, closeTimeout } = useTimer(isOpenTimer);
  const { getSql, getTableData, viewData } = useData();

  let upTime = localStorage.getItem('updateDateTime')
  let updateDateTime: Ref<string> = ref(upTime||'');

  const uploadData = async <T>(
    type: string,
    apiFunc: (FieldsStore: T[]) => Promise<any>,
    whereKey: string
  ) => {
    const o = extrTypeDatas.find((item) => item.key === type);
    const extrTypeName = o?.name
    try {
      // 数据库表名
      const tableName:string = 'ds_'+type
      // 先抽取数据
      const querySql = await getSql(type);
      if(!querySql) {
        console.log(`${extrTypeName}: sql查询条件不存在`);
        return
      }
      const { tableData: queryData }: any = await viewData(querySql);
      const columnsData = await getTableData(type);
      console.log("查询抽取的数据：", querySql, queryData);

      // 拼装接口字段数据
      const storeInfos = findFiledValues<T>(queryData, columnsData);
      console.log("拼接数据保存本地", storeInfos);
      // 循环插入保存到本地
      for (const item of storeInfos) {
        const whereValue = (item as any)[whereKey]
        if(!whereValue) {
          continue
        }
        const params = {
          tableName: tableName,
          where: `${whereKey} = '${whereValue}'`
        }
        await window.sqliteAPI.saveStoreData(params, item);
      }
      // 后上传数据
      // 获取需要更新的数据
      updateDateTime.value = localStorage.getItem('updateDateTime')||useDateFormat(useNow(), "YYYY-MM-DD HH:mm:ss").value
      console.log('updateDateTime', updateDateTime.value);
      const uploadDataList: T[] = await window.sqliteAPI.getStoreData(
        updateDateTime.value
      );
      console.log('上传数据', uploadDataList);
      if (uploadDataList && uploadDataList.length) {
        const apiData: T[] = uploadDataList.map((data) => {
          const obj: Record<any, any> = {};
          for (const key in storeInfos[0]) {
            if (key !== "created_at" && key !== "updated_at") {
              obj[key] = data[key];
            }
          }

          return obj;
        });
        // 门店对照配置
        if(type == 'store'){
          const storeComplist:Array<StoreCompType> = await window.sqliteAPI.getStoreComp()
          apiData.map((item: any) => {
            const findStore = storeComplist.find(o => o.store_id == item.store_id)
            findStore && findStore.license_code ? item['license_code'] = findStore.license_code : ''
          })
        }
        // 最终接口上传数据
        console.log("接口上传数据", apiData);
        const updateRes = await apiFunc(apiData);
        console.log('上传结果：',updateRes);
        if(updateRes?.ALInfoError?.Sucess === '1'){
          // 更新上传时间
          localStorage.setItem('updateDateTime', useDateFormat(useNow(), "YYYY-MM-DD HH:mm:ss").value)
          const ids = uploadDataList.map((item: any) => item.id);
          // 删除已上传成功的数据
          window.sqliteAPI.delStoreData({
            tableName: tableName,
            ids: ids,
          });
          return apiData;
        } else if(updateRes?.ALInfoError?.Sucess === '0') {  // 上传失败
          let errMes = `${extrTypeName}数据抽取失败：${updateRes.ALInfoError?.Description}`
          logger.warn(errMes)
          ElMessage.warning(errMes)
          return updateRes
        } else {
          let errRes = updateRes ? JSON.stringify(updateRes) : updateRes
          let errMes = `${extrTypeName}数据抽取失败：${errRes}`
          logger.warn(errMes)
          ElMessage.warning(errMes)
          return updateRes
        }
      }
    } catch (error: any) {
      console.log(`${extrTypeName}数据抽取失败：`, error);
    }
  };

  // 开始数据抽取
  const startUpload = () => {
    logger.info('开始数据抽取')
    openTimer(() => {
      // 抽取门店信息
      uploadData<FieldsStore>("store", apis.api4G07, 'store_id');
      // 抽取供应商信息
      uploadData<FieldsSupplier>("supplier", apis.api4G05, 'supplier_code').then(async () => {
        // 非烟商品类别抽取
        await uploadData<FieldsNotbCategory>("notb_category", apis.api4G03, 'category_code');
        // 非烟商品信息抽取
        await uploadData<FieldsNotbGoods>("notb_goods", apis.api4G04, 'goods_code');
      });
      // 会员信息抽取
      uploadData<FieldsMemberInfo>("member_info", apis.api4G06, 'mobile');
      // 零售订单信息抽取
      uploadData<FieldRetailOrder>("retail_order", apis.api4S00, 'clientorderid');
      // 入库单信息抽取
      uploadData<FieldInOrder>("in_order", apis.api4S01, 'bill_code');
      // 损溢单信息抽取
      uploadData<FieldLossOrder>("loss_order", apis.api4S02, 'storchecksid');
      // 其他出入库单信息抽取
      uploadData<FieldOutOrder>("out_order", apis.api4S03, 'bill_code');
      // 日结进销存信息抽取
      uploadData<FieldDayInvoicing>("day_invoicing", apis.api4S04, 'dtl_productid');
    });
  };
  // 停止数据抽取
  const stopUpload = () => {
    logger.info('停止数据抽取')
    closeTimeout()
  }
  return {
    startUpload,
    stopUpload,
    isOpenTimer
  };
};

/**
 * 数据同步相关操作
 */
export const useDataSync = () => {
  const store = useStore();
  const { isSyncTimer } = storeToRefs(store);
  const { openTimer, closeTimeout } = useTimer(isSyncTimer);
  
  // 同步店铺数据
  const syncStoreData =  () => {
    const { loading, setLoading } = useLoading()  // loading
    return new Promise(async (resolve, reject) => {
      try {
        console.log('请求门店数据');

        setLoading(true, '请求门店数据')
        const storeRes = await apis.api4G00()
        console.log('开始同步门店数据', storeRes);
        if(storeRes?.ALInfoError?.Sucess == '1') {
          let storeListRow: any[] = storeRes?.ior[0]?.SubRs[0]?.Row||[]
          let storeList: LicenseOptionType[] = storeListRow.map(item => {
            return {
              cust_uuid: item.a,
              cust_code: item.b,
              cust_name: item.c,
              license_code: item.d
            }
          })
          let index = 0
          let storeTotal = storeList.length
          // 递归存储本地，每次存200条
          async function recuSaveStore() {
            index = index > storeTotal ? storeTotal : index
            console.log(`门店数据同步中 ${index}/${storeTotal}`);
  
            if(!loading.value) {
              setLoading(true, `门店数据同步中 ${index}/${storeTotal}`)
            } else {
              loading.value.setText(`门店数据同步中 ${index}/${storeTotal}`)
            }

            let tmpArr = storeList.slice(index, index+200)

            if(tmpArr.length) {
              await window.sqliteAPI.saveStoreList(tmpArr)
            }

            if(storeTotal > index) {
              index+=200
              recuSaveStore()
            } else {
              console.log(`门店数据同步结束 ${index}/${storeTotal}`);
              
              setLoading(false)
              resolve(true)
            }
          }
          recuSaveStore()
        } else {
          setLoading(false)
          reject(storeRes)
        }
      } catch (err) {
        console.log('同步店铺数据失败：'+err);

        setLoading(false)
        reject(err)
      }
    })
  }
  // 同步商品数据
  const syncGoodsData = async () => {
    const { loading, setLoading } = useLoading()  // loading
    return new Promise(async (resolve, reject) => {
      try {
        setLoading(true, '请求商品数据')
        const clientverStora =  localStorage.getItem('clientver')
        const clientver = clientverStora && clientverStora!=='undefined' ? clientverStora : '99999999999999'
        const pageIndex = '1'
        const pageSize = '500'
        const goodsResult = await apis.api4G01(clientver, pageIndex, pageSize)
        localStorage.setItem('clientver', goodsResult.serverver)
        console.log('开始同步商品数据', goodsResult);
        if(goodsResult?.ALInfoError?.Sucess == '1') {
          let goodsListRow: any[] = goodsResult?.ior[0]?.SubRs[0]?.Row||[]
          let goodsList:GoodsListType[] = goodsListRow.map(item => {
            return {
              goods_id: item.a,
              goods_code: item.b,
              goods_name: item.c,
              barcode: item.d,
              pack_barcode: item.e,
              wholesale_price: item.f,
              msrp: item.g,
              conversion_ratio: item.h,
              brand: item.i,
              manufacturer_name: item.j,
              is_new: item.k,
              backbone_brand: item.l,
              goods_image: item.m,
              mnemonic_code_pinyin: item.n,
              home_e: item.o,
              mnemonic_code_number: item.p,
              online_ordering: item.q,
              retail_price: item.r,
              message_code: item.s,
              brand_identity: item.t,
              manufacturer_identity: item.u,
              smoke_abnormal: item.v,
              smoke_province: item.w,
              default_unit: item.x,
              brand_code: item.y,
              manufacturer_code: item.z,
              is_import: item.a1,
              price_class_code: item.b1,
              price_class_name: item.c1,
              disabled: item.d1,
              tar_content: item.e1,
              packaging_type: item.f1,
              total_records: item.page_totalrecordnum,
            }
          })
          let index = 0
          let goodsTotal = goodsList.length
          // 递归存储本地，每次存200条
          async function recuSaveGoods() {
            index = index > goodsTotal ? goodsTotal : index
            if(!loading.value) {
              setLoading(true, `商品数据同步中 ${index}/${goodsTotal}`)
            } else {
              loading.value.setText(`商品数据同步中 ${index}/${goodsTotal}`)
            }
            let tmpArr = goodsList.slice(index, index+200)

            if(tmpArr.length) {
              await window.sqliteAPI.saveGoodsList(tmpArr)
            }

            if(goodsTotal > index) {
              index+=200
              recuSaveGoods()
            } else {
              setLoading(false)
              resolve(true)
            }
          }
          recuSaveGoods()
        } else {
          setLoading(false)
          reject(goodsResult)
        }
      } catch (err) {
        console.log('同步商品数据失败：'+err);
        setLoading(false)
        reject(err)
      }
    })
  }

  // 开始同步数据
  const syncTimerOpen = () => {
    openTimer(() => {
      syncStoreData()
      syncGoodsData()
    })
  }

   // 停止数据抽取
  const syncTimerStop = () => {
    // logger.info('停止数据抽取')
    closeTimeout()
  }

  return {
    isSyncTimer,
    syncTimerOpen,
    syncTimerStop,
    syncStoreData,
    syncGoodsData
  }
}
