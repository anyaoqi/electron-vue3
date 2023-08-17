import type { ComputedRef, Ref } from "vue";
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
} from "@/types";
import { useData } from "@/hooks/dataExtraction";
import * as apis from "@/apis";
import { extrTypeDatas } from "@main/config/data.config";


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
    timing = 1000 * 10; // 每30秒触发一次
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
 * 数据上传相关操作
 */
export const useUpload = () => {
  const store = useStore();
  const { isOpenTimer } = storeToRefs(store);
  const { openTimer, closeTimeout } = useTimer(isOpenTimer);
  const { getSql, getTableData, viewData } = useData();

  let updateDateTime: ComputedRef<string> | null = null;

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
      // console.log("queryData", queryData);

      // 拼装接口字段数据
      const storeInfos = findFiledValues<T>(queryData, columnsData);
      // console.log("storeInfos", storeInfos);

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
      const uploadDataList: T[] = await window.sqliteAPI.getStoreData(
        updateDateTime?.value
      );
      // console.log("uploadDataList", uploadDataList);

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
        // 接口上传数据
        // console.log("apiData", apiData);
        // const res = await apiFunc(apiData);
        // console.log(res);
        // 更新上传时间
        updateDateTime = useDateFormat(useNow(), "YYYY-MM-DD HH:mm:ss");
        const ids = uploadDataList.map((item: any) => item.id);
        window.sqliteAPI.delStoreData({
          tableName: tableName,
          ids: ids,
        });
        return apiData;
      }
    } catch (error: any) {
      console.log(`${extrTypeName}数据抽取失败：`, error);
    }
  };

  // 开始定时上传
  const startUpload = () => {
    console.log('开始上传');
    
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
  // 停止定时上传
  const stopUpload = () => {
    closeTimeout()
  }
  return {
    startUpload,
    stopUpload,
    isOpenTimer
  };
};
