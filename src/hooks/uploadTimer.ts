import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import { useNow, useDateFormat } from "@vueuse/core";
import { useStore } from "@/pinia/index";
import { findFiledValues, getConfig } from "@/utils";
import type {
  FieldLossOrder,
  FieldDayInvoicing,
  StoreCompType,
  GoodsListType,
  LicenseOptionType,
  GoodsUnitType,
  iOrderRes,
  iOrderItem,
} from "@type/index";
import { FieldRetailOrder } from "@type/shanxi"
import { useData } from "@/hooks/dataExtraction";
import { useLoading } from '@/hooks/index'
import * as apis from "@/apis/shanxi";
import { extrDatas_shanxi as extrTypeDatas } from "../../config/data.config";
import logger from "@/utils/logger";

/**
 * 定时相关操作
 * @param isOpenTimer
 * @param timing 间隔时间  默认30分钟触发一次
 */
export const useTimer = (isOpenTimer: Ref<boolean>, timing = 1000 * 60 * 30) => {
  let timer: any = null;
  // 定时间隔时间
  // let timing = 1000 * 60 * 30  // 30分钟触发一次

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
    callback && callback()
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
  // 30分钟定时器
  const { openTimer, closeTimeout } = useTimer(isOpenTimer, 1000 * 60 * 30);
  // 24小时定时器
  const { openTimer:openTimer24, closeTimeout: closeTimeout24} = useTimer(isOpenTimer, (1000 * 60 * 60) * 24);

  const { getSql, getTableData, viewData } = useData();

  let upTime:any = localStorage.getItem('updateDateTime')
  try {
    upTime = upTime ? JSON.parse(upTime) : {}
  } catch (error) {
    upTime = {}
  }
  let updateDateTime = upTime;

  // 递归触发上传数据接口
  // 因为接口限制每次最多上传2000条数据，所以需要递归触发接口
  async function handleApiFunc<T>(
    updateData: T[],
    apiFunc: (FieldsStore: T) => Promise<any>,
    callback: (r: any) => void) {
      return new Promise(async (resolve) => {
        let _datas = updateData.splice(0, 2000)
        // 最终接口上传数据
        console.log(apiFunc.name+"接口上传数据：", _datas.length, _datas);
        let updateRes = []
        // 因为提供的接口只能传单条数据，所以需要循环触发接口上传
        // 我知道这样做不好，但是没有提供可以上传多条的接口，我也没办法 ┭┮﹏┭┮
        for (let i=0; i< _datas.length; i++) {
          const apiRes = await apiFunc(_datas[i]);
          updateRes.push(apiRes)
        }
        console.log(apiFunc.name+'接口上传结果：', _datas.length, updateRes);
        if(updateData.length > 0) {
          handleApiFunc(updateData, apiFunc, callback)
        } else {
          resolve(true)
        }
        updateRes.forEach(res => {
          callback && callback(res)
        });
      })
  }

  const uploadData = async <T>(
    type: string,
    apiFunc: (FieldsStore: T) => Promise<any>,
    whereKey: string,
    params?: any
  ) => {
    const o = extrTypeDatas.find((item) => item.key === type);
    const extrTypeName = o?.name
    try {
      // 数据库表名
      const tableName:string = 'ds_'+type
      // 获取上次抽取成功时间
      let UDT = localStorage.getItem('updateDateTime')
      try {
        updateDateTime[type] = UDT ? JSON.parse(UDT)[type] : ''
      } catch (err) {
        updateDateTime[type] = ''
      }
      // 先抽取数据
      let querySql = await getSql(type, updateDateTime[type], params);
      if(!querySql) {
        console.log(`${extrTypeName}: sql查询条件不存在`);
        return
      }
      console.log(`${extrTypeName}: ${querySql}`);

      // const extrData = await getExtrSqlData(type)

      const { tableData: queryData }: any = await viewData(querySql);
      const columnsData = await getTableData(type);
      console.log(type+"1.从商超查询抽取的数据=>", queryData);

      // 拼装接口字段数据
      const storeInfos = findFiledValues<T>(
        queryData,
        columnsData,
      );
      console.log(type+"2.将拼接好的数据循环保存到本地数据库=>", storeInfos);
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
      console.log(type+'3.根据上次同步时间从本地查询数据=>', updateDateTime[type]);
      // 获取需要更新的数据
      const uploadDataList: T[] = await window.sqliteAPI.getStoreData({
        // uploadDate: updateDateTime[type],
        tableName: tableName
      });
      const apiFilds = o?.apiFilds||[]
      console.log(type+'4.从本地数据库取出来的数据，开始对数据进行过滤=>', uploadDataList);
      if (uploadDataList && uploadDataList.length) {
        const apiData: T[] = uploadDataList.map((data) => {
          const obj: Record<any, any> = {};
          for (const key in storeInfos[0]) {
            let val:string[]|string = ''
            if (key !== "created_at" && key !== "updated_at") {
              val = data[key] as string;
            }
            // 数据类型转换
            const filed = apiFilds.find(item => item.filed === key)
            if(filed && filed.type) {
              // 数组类型-将字符串转为数组
              if(filed.type === 'Array') {
                if(val && typeof val === 'string') {
                  val = val.split(',')
                } else {
                  val = ['']
                }
                // // 销售单位单独处理 传空字符串数组
                if(filed.filed== 'dtl_unitid') {
                  const istobacco = (data as any).dtl_istobacco
                  const istobaArr = istobacco.split(',')
                  val = val.map((v, i) => {
                    return istobaArr  && istobaArr[i] == 1 ? '' : v
                  })
                }
              }
            }

            obj[key] = val
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
        // 零售订单信息抽取 数据过滤
        if(type == 'retail_order' || type == 'loss_order' || type == 'day_invoicing') {
          // 获取同步商品列表
          const goodsData = await window.sqliteAPI.getGoodsList()

          apiData.map((item: any, itemIndex:number) => {
            let barcodeArr = item.dtl_barcode
            let istobacco = item.dtl_istobacco // 是否卷烟 1卷烟 0非烟
            if(Array.isArray(barcodeArr) && istobacco==1) {
              let isDelete = true
              let idName  = type == 'retail_order'  ? 'dtl_goodsisn' : 'dtl_productid'
              barcodeArr.forEach((code:string, index: number) => {
                // 获取到条码相同的商品
                let findGoods = goodsData.find((gItem: any) => {
                  // 条 条形码 或者 包 条形码
                  return gItem.bar_code == code || gItem.packet_bar_code == code
                })
                if(findGoods) {
                  // dtl_goodsisn赋值为卷烟代码goods_code
                  item[idName][index] = findGoods.product_id
                  isDelete = false
                } else {
                  // 所有字段中删掉这条数据
                  for (const key in item) {
                    if(Array.isArray(item[key])) {
                      item[key].splice(index, 1)
                    }
                  }
                  item.dtlcount = item[idName].length
                }
              });
              if(!item[idName].length || isDelete) {
                apiData.splice(itemIndex, 1)
              }
            }
            // 处理时间格式
            if(item.bizdate) {
              item.bizdate = useDateFormat(item.bizdate, "YYYYMMDD").value
            }
            if(item.inputtime) {
              item.inputtime = useDateFormat(item.inputtime, "YYYYMMDDHHmmss").value
            }
          })
        }
        console.log(type+"5.过滤好的最终数据,开始递归上传", apiData);
        await  handleApiFunc<T>(apiData, apiFunc, (updateRes) => {
          const ids = uploadDataList.map((item: any) => item.id);
          // 删除上传数据
          window.sqliteAPI.delStoreData({
            tableName: tableName,
            ids: ids,
          });
          if(updateRes?.ALInfoError?.Sucess === '1'){
            // 更新上传时间
            updateDateTime[type] = useDateFormat(useNow(), "YYYY-MM-DD HH:mm:ss").value
            localStorage.setItem('updateDateTime', JSON.stringify(updateDateTime))
          } else if(updateRes?.ALInfoError?.Sucess === '0') {  // 上传失败
            let errMes = `${extrTypeName}数据抽取失败：${updateRes.ALInfoError?.Description}`
            logger.warn(errMes)
            ElMessage.warning(errMes)
          } else {
            let errRes = updateRes ? JSON.stringify(updateRes) : updateRes
            let errMes = `${extrTypeName}数据抽取失败：${errRes}`
            logger.warn(errMes)
            ElMessage.warning(errMes)
          }
        })
      }
    } catch (error: any) {
      console.log(`${extrTypeName}数据抽取失败：`, error);
    }
  };

  // 开始数据抽取
  const startUpload = () => {
    logger.info('开始数据抽取')
    const config = getConfig()
    openTimer(async () => {
      // 零售订单信息抽取
      await uploadData<FieldRetailOrder>("retail_order", apis.api2S01, 'clientorderid');
      // 损溢单信息抽取
      await uploadData<FieldLossOrder>("loss_order", apis.api1S22, 'storchecksid');
    });
    openTimer24(async () => {
      // 获取当前日期
      const today = new Date();
      // 获取昨天的日期
      let yesterday: any = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      yesterday = useDateFormat(yesterday, "YYYY-MM-DD").value
      // 两个日期字符串
      const date1String = localStorage.getItem('startDate')||yesterday
      const date2String = localStorage.getItem('endDate')||yesterday
      console.log('开始时间:', date1String);
      console.log('结束时间', date2String);

      // 将日期字符串转换为 Date 对象
      const date1 = new Date(date1String);
      const date2 = new Date(date2String);

      // 复制 date1 以防修改原始日期
      let currentDate = new Date(date1);

      let storeList = []
      const license = localStorage.getItem('license')
      if(license) {
        storeList = [{ license }]
      } else {
        const { results } = await window.serverAPI.queryTableDatas(config.queryStoreSql)
        storeList = results||[]
      }
      if(storeList && storeList.length) {
        for (const item of storeList) {
            // 循环遍历日期
            while (currentDate <= date2) {
              // 打印当前日期
              const bizdate = useDateFormat(currentDate, "YYYYMMDD").value
              const license = item.license
              // 将日期增加一天
              currentDate.setDate(currentDate.getDate() + 1);
              console.log('日期：'+bizdate, '许可证号：'+license);
              // 日结进销存信息抽取
              await uploadData<FieldDayInvoicing>(
                "day_invoicing", 
                apis.api1S31, 
                'dtl_productid', 
                {
                  bizdate,
                  license
                }
              );
            }
            currentDate = new Date(date1);
        }
      }
    })
  };
  // 停止数据抽取
  const stopUpload = () => {
    logger.info('停止数据抽取')
    closeTimeout()
    closeTimeout24()
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
export const useDataSync = (callback?: (index:number, total:number) => void) => {
  const store = useStore();
  const { isSyncTimer } = storeToRefs(store);
  const { closeTimeout, openTimer } = useTimer(isSyncTimer, 1000*60*60*24);

  // 同步店铺数据
  const syncStoreData =  (license_code: string, fn?: (index:number, total:number) => void) => {
    return new Promise(async (resolve, reject) => {
      try {
        const storeRes = await apis.api1G04(license_code) as any
        console.log('开始同步门店数据', storeRes);
        if(storeRes?.ALInfoError?.Sucess == '1') {
          let storeListRow: any[] = storeRes?.ior[0]?.SubRs[0]?.Row||[]
          // 存储到本地的数据
          let storeList: LicenseOptionType[] = storeListRow.map(item => {
            return {
              customer_id: storeRes.customersid,
              cust_code: item.a,
              cust_name: item.b,
              license_code: item.c,
              mobile_number: item.d,
              order_number: item.e,
              legal_person: item.f,
              address: item.g,
              reason_class_name: item.h,
              settle_method_name: item.i,
              order_frequency: item.j,
              account_manager_id: item.k,
              account_manager_name: item.l,
              delivery_id: item.m,
              delivery_name: item.n,
              inspector_id: item.o,
              inspector_name: item.p,
              tbc_company_name: item.q,
            }
          })
          let index = 0
          let storeTotal = storeList.length
          // 递归存储本地，每次存200条
          async function recuSaveStore() {
            index = index > storeTotal ? storeTotal : index
            let tmpArr = storeList.slice(index, index+200)
            if(tmpArr.length) {
              // await window.sqliteAPI.saveStoreList(tmpArr)
              await window.serverAPI.insertData({
                table: 'sync_customer',
                dataArray: tmpArr,
                primaryKey: 'customer_id'
              })
            }

            fn && fn(index, storeTotal)
            callback && callback(index, storeTotal)

            if(storeTotal > index) {
              index+=200
              recuSaveStore()
            } else {
              console.log(`门店数据同步结束 ${index}/${storeTotal}`);
              resolve(true)
            }
          }
          recuSaveStore()
        } else {
          reject(storeRes?.ALInfoError?.Description)
        }
      } catch (err) {
        reject(err)
      }
    })
  }
  // 同步商品数据
  const syncGoodsData = async (fn?: (index:number, total:number) => void) => {
    return new Promise(async (resolve, reject) => {
      try {
        const clientverStora =  localStorage.getItem('clientver')
        const clientver = clientverStora && clientverStora!=='undefined' ? clientverStora : ''
        const pageIndex = '0'
        const pageSize = '500'
        const goodsResult = await apis.api1G05(clientver, pageIndex, pageSize)
        localStorage.setItem('clientver', goodsResult.serverver)
        console.log('开始同步商品数据', goodsResult);
        if(goodsResult?.ALInfoError?.Sucess == '1') {
          let goodsListRow: any[] = goodsResult?.ior[0]?.SubRs[0]?.Row||[]
          // 存储到本地sqlite
          let goodsList:GoodsListType[] = goodsListRow.map((item) => {
            const newObj = {
              product_id: item.a,
              product_code: item.b,
              product_name: item.c,
              bar_code: item.d,
              packet_bar_code: item.e,
              wholesale_price: item.f,
              suggested_retail_price: item.g,
              strip_conversion_ratio: item.h,
              brand_name: item.i,
              manufacturer_name: item.j,
              is_new: item.k,
              is_backbone_brand: item.l,
              cigarette_picture: item.m,
              pinyin_mnemonic_code: item.n,
              family_e_use_status: item.o,
              digital_mnemonic_code: item.p,
              is_online_order: item.q,
              retail_price: item.r,
              short_message_code: item.s,
              brand_id: item.t,
              manufacturer_id: item.u,
              is_abnormal: item.v,
              is_province: item.w,
              default_unit_id: item.x,
              brand_code: item.y,
              manufacturer_code: item.z,
              is_import: item.a1,
              price_classification_code: item.b1,
              price_classification_name: item.c1,
              is_active: item.d1,
              tar_content: item.e1,
              pack_type: item.f1,
              // sort_index: '0'
            }
            return newObj
          })
          let index = 0
          let goodsTotal = goodsList.length
          // 递归存储本地，每次存200条
          async function recuSaveGoods() {
            index = index > goodsTotal ? goodsTotal : index

            let tmpArr = goodsList.slice(index, index+200)
            if(tmpArr.length) {
              await window.sqliteAPI.saveGoodsList(tmpArr)
              console.log('sync_tbc_product', tmpArr);

              await window.serverAPI.insertData({
                table: 'sync_tbc_product',
                dataArray: tmpArr,
                primaryKey: 'product_id'
              })
            }
            fn && fn(index, goodsTotal)
            callback && callback(index, goodsTotal)

            if(goodsTotal > index) {
              index+=200
              recuSaveGoods()
            } else {
              console.log(`商品数据同步结束 ${index}/${goodsTotal}`);
              resolve(true)
            }
          }
          recuSaveGoods()
        } else {
          reject(goodsResult)
        }
      } catch (err) {
        console.log('同步商品数据失败：'+err);
        reject(err)
      }
    })
  }
  const syncGoodsUnit = (fn?: (index:number, total:number) => void) => {
    return new Promise(async (resolve, reject) => {
      try {
        const unitRes = await apis.api1G0B() as any
        console.log('开始同步卷烟单位', unitRes);
        if(unitRes?.ALInfoError?.Sucess == '1') {
          let UnitListRow: any[] = unitRes?.ior[0]?.SubRs[0]?.Row||[]
          // 存储到本地sqlite数据库
          let UnitList:GoodsUnitType[] = UnitListRow.map(item => {
            return {
              unit_id: item.a,
              unit_name: item.b,
              serial_code: item.c,
              series: item.d,
              piece_num: item.e,
              is_default: item.f,
            }
          })
          let index = 0
          let storeTotal = UnitList.length
          // 递归存储本地，每次存200条
          async function recuSaveStore() {
            index = index > storeTotal ? storeTotal : index
            let tmpArr = UnitList.slice(index, index+200)
            if(tmpArr.length) {
              await window.sqliteAPI.saveGoodsUnit(tmpArr)
              await window.serverAPI.insertData({
                table: 'sync_tbc_unit',
                dataArray: tmpArr,
                primaryKey: 'unit_id'
              })
            }

            fn && fn(index, storeTotal)
            callback && callback(index, storeTotal)

            if(storeTotal > index) {
              index+=200
              recuSaveStore()
            } else {
              console.log(`卷烟单位同步结束 ${index}/${storeTotal}`);
              resolve(true)
            }
          }
          recuSaveStore()
        } else {
          reject(unitRes)
        }
      } catch (err) {
        console.log('同步店铺数据失败：'+err);
        reject(err)
      }
    })
  }
  // 开始同步数据
  const syncTimerOpen = async () => {
    const { loading, setLoading } = useLoading()
    const config = getConfig()
    // 去掉定时，初始化只执行一次
    openTimer(async () => {
      setLoading(true,'开始同步数据')
      try {
        const { results } = await window.serverAPI.queryTableDatas(config.queryStoreSql)
        console.log('results', results);
        if(results && results.length) {
          loading.value.setText('客户数据同步中...')
          for (const item of results) {
            const license = item.license
            if(license && license!=='0'){
              try {
                await syncStoreData(license)
              } catch (err) {
                let errMsg = typeof err == 'string' ? err : ''
                if(typeof err == 'object') {
                  errMsg = JSON.stringify(err)
                }
                errMsg = `[${license}]${errMsg}`
                ElMessage({
                  message: errMsg,
                  type: 'warning'
                })
              }
            }
          }
        }
        loading.value.setText('商品数据同步中...')
        await syncGoodsData()
        loading.value.setText('卷烟计量单位数据同步中...')
        await syncGoodsUnit()
        setLoading(false)
      } catch (error) {
        console.error('同步数据发生错误',error);
        setLoading(false)
      }
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
    syncGoodsData,
    syncGoodsUnit
  }
}


/**
 * 订单数据同步相关操作
 */
export const useOrderSync = () => {
  const store = useStore();
  const { isOrderTimer } = storeToRefs(store);
  const timer = (1000 * 60 * 60) * 6
  const { closeTimeout, openTimer } = useTimer(isOrderTimer, timer);
  const { setLoading } = useLoading()
  const config = getConfig()
  // 上传订单/插入到数据库
  const syncOrderData = async (order: iOrderItem, detail: any) => {
    // 获取同步商品列表
    const goodsList: any[] = await window.sqliteAPI.getGoodsList()
    // 订单
    const orderData = {
      order_id: detail.ordersid,
      customer_id: detail.customersid,
      status: detail.status,
      status_code: detail.statuscode,
      paymode: detail.paymode,
      reqtotal_qty: order.reqtotalqty,
      tax_total_amt: order.totalamt,
      detail_count: detail.detailcount,
      totaldef_qty: detail.totaldefqty,
      total_amt: detail.totalamt,
      invmode: detail.invmode,
      inputtime: detail.inputtime,
      bizdate: order.bizdate,
      auditdate: detail.auditdate,
      is_payed: detail.is_payed,
      saletype: detail.saletype,
    }
    
    // 订单详情
    const orderDetail = detail.ior[0].SubRs[0].Row.map((item: iOrderRes) => {
      let findData = goodsList.find(goods => goods.product_id === item.a)
      let brandId = findData ? findData.brand_id : ''
      return {
        order_id: detail.ordersid,
        customer_id: detail.customersid,
        brand_id: brandId,
        product_id: item.a,
        req_qty: item.b,
        sale_qty: item.c,
        wholesale_price: item.d
      }
    })
    try {
      // 上传订单
      await window.serverAPI.insertData({
        table: 'sync_tbc_order',
        dataArray: [orderData],
        primaryKey: 'order_id'
      })
      // 上传订单详情
      await window.serverAPI.insertData({
        table: 'sync_tbc_orderdtl',
        dataArray: orderDetail,
        primaryKey: 'product_id'
      })
      setLoading(false)
      ElMessage({
        message: '上传成功',
        type: 'success'
      })
    } catch (error) {
      setLoading(false)
      ElMessage({
        message: '上传失败,请查看日志',
        type: 'error'
      })
    }
  }
  // 获取订单详情
  const getOrderDetail = async (order: iOrderItem) => {
    const res = await apis.api1O12(order.ordersid)
    if(res.ALInfoError.Sucess==1) { 
      return res
    } else {
      ElMessage({
        message: res.ALInfoError.Description,
        type: 'error'
      })
      return
    }
  }
  // 获取订单列表
  const getOrderList = async (form: any) => {
    const res = await apis.api1O49(form)
    if(res.ALInfoError.Sucess==1){
      return res.ior[0].SubRs[0].Row
    } else {
      ElMessage({
        message: res.ALInfoError.Description,
        type: 'error'
      })
      return
    }
  }

  // 同步所有门店订单
  const syncStoreOrder = async () => {
    const res = await window.serverAPI.queryTableDatas(config.queryStoreSql)
    if(res && res.results && res.results.length) {
      // 获取时间
      const _date = new Date()
      // _date.setMonth(_date.getMonth() - 1)
      // _date.setDate(_date.getDate() -1)
      // 开始时间  昨天
      // const begindate = useDateFormat(_date, "YYYYMMDD").value
      // 结束日期 今天
      // const enddate = useDateFormat(new Date(), "YYYYMMDD").value
      const orderdate = useDateFormat(_date, "YYYYMMDD").value
      for (const item of res.results) {
        const form = {
          begindate: '19700101',
          enddate: '21240101',
          orderdate: localStorage.getItem('orderdate')||orderdate,
          customersid: item.license
        }
        // 查询订单列表
        const orderList = await getOrderList(form)
        if(orderList && orderList.length) {
          // 循环订单列表
          for (const order of orderList) {
            // 查询订单详情
            const detail = await apis.api1O12(order.ordersid)
            if(detail.ALInfoError.Sucess==1) {
              // 上传订单
              await syncOrderData(order, detail)
            }
          }
        }
      }
      let sql1 = config.uploadDataSql1
      let sql2 = config.uploadDataSql2
      console.log('第一个sql', sql1);
      console.log('第二个sql', sql2);
      sql1 && window.serverAPI.uploadDataSql1(sql1).then((res: any) => {
        console.log('sql1执行结果', res);
      }).catch((err: any) => {
        console.log('sql1执行报错', err);
      })
      sql2 &&  window.serverAPI.uploadDataSql2(sql2).then((res: any) => {
        console.log('sql2执行结果', res);
      }).catch((err: any) => {
        console.log('sql2执行报错', err);
      })
    }
  }

  // 开始同步数据
  const syncTimerOpen = async () => {
    const { loading, setLoading } = useLoading()
    openTimer(async () => {
      try {
        setLoading(true,'开始同步数据')
        loading.value.setText('配货主表数据同步中...')
        await syncStoreOrder()
        setLoading(false)
      } catch (error) {
        console.error('同步数据发生错误',error);
        setLoading(false)
      }
    })
  }

   // 停止数据抽取
  const syncTimerStop = () => {
    // logger.info('停止数据抽取')
    closeTimeout()
  }

  return {
    isOrderTimer,
    syncTimerOpen,
    syncTimerStop,
    syncOrderData,
    getOrderDetail,
    getOrderList
  }
}


/**
 * 连接数据库后定时查询数据库，防止数据库断开
 */
export const useDbonnection = () => {
  const store = useStore();
  const { isDbSelectTimer } = storeToRefs(store);
  const { closeTimeout, openTimer }  = useTimer(isDbSelectTimer, 1000*60*60 * 5)

  // 连接数据库后定时查询数据库，防止数据库断开
  const timerSelectStart = () => {
    openTimer(async () => {
      const isConn = await window.serverAPI.isConnection()
      if(isConn) {
        console.log('数据库连接定时查询', 'select 1');
        await window.serverAPI.queryTableDatas(`select 1`)
      }
    })
  }

  // 关闭定时查询定时器
  const timerSelectClose = () => {
    closeTimeout()
  }

  return {
    timerSelectStart,
    timerSelectClose
  }
}
