<script lang='ts' setup>
import { reactive, toRaw } from 'vue'
import { useNow, useDateFormat } from "@vueuse/core";
import { useLoading } from '@/hooks'
import { useOrderSync } from '@/hooks/uploadTimer'
import type { iOrderItem } from "@type/index";
import { getConfig } from '@/utils'

const config = getConfig()
const { 
  isOrderTimer, 
  syncTimerOpen, 
  syncTimerStop, 
  getOrderDetail, 
  getOrderList, 
  syncOrderData 
} = useOrderSync()
const { loading, setLoading } = useLoading()
const nowDate = useDateFormat(useNow(), "YYYYMMDD").value
// 表单
const form = reactive({
  begindate: '19700101',
  enddate: '21240101',
  orderdate: nowDate,
  customersid: ''
})
// 数据
const table = reactive({
  data: []
})

async function getData() {
  if(!form.begindate) {
    ElMessage({
      message: '请输入开始时间',
      type: 'warning'
    })
    return
  }
  if(!form.enddate) {
    ElMessage({
      message: '请输入结束时间',
      type: 'warning'
    })
    return
  }
  if(!form.customersid) {
    ElMessage({
      message: '请选择客户ID',
      type: 'warning'
    })
    return
  }
  if(!form.orderdate){
    form.orderdate = ""
  }
  setLoading(true, '数据查询中')
  try {
    const dataList = await getOrderList(toRaw(form))
    setLoading(false)
    if(dataList && dataList.length) {
      table.data = dataList
    } else {
      table.data = []
    }
  } catch (err) {
    setLoading(false)
  }
}

// 查询按钮点击
function searchData() {
  console.log('form', form);
  getData()
}

// 上传数据
async function uploadData(row: iOrderItem) {
  setLoading(true)
  loading.value.setText('正在查询详情...')
  const res = await getOrderDetail(row)
  if(res && res.ALInfoError.Sucess==1) {
    await syncOrderData(row, res)
    let sql1 = config.uploadDataSql1
    let sql2 = config.uploadDataSql2
    console.log('第一个sql', sql1);
    console.log('第二个sql', sql2);
    sql1 && window.serverAPI.uploadDataSql1(sql1).then((res: any) => {
      console.log('sql1执行结果', res);
      setLoading(false)
    }).catch((err: any) => {
      console.log('sql1执行报错', err);
      setLoading(false)
    })
    sql2 && window.serverAPI.uploadDataSql2(sql2).then((res: any) => {
      setLoading(false)
      console.log('sql2执行结果', res);
    }).catch((err: any) => {
      setLoading(false)
      console.log('sql2执行报错', err);
    })
  } else {
    setLoading(false)
  }
}

interface license {
  license: string
}

const store = reactive({
  list: [] as license[]
})

const dateChange = (v: string) => {
  localStorage.setItem('orderdate', v||'')
}

window.serverAPI.queryTableDatas(config.queryStoreSql).then((res: any) => {
  if(res.results && res.results.length) {
    store.list = res.results.filter((item:license) => item.license && item.license!=='0')
  } else {
    store.list = []
  }
})
</script>

<template>
  <div class="form-wrapper">
    <div class="button-wrapper">
      <el-button class="button-search" v-if="isOrderTimer" type="warning"   @click="syncTimerStop">取消定时上传全部门店</el-button>
      <el-button class="button-search" v-else type="primary" @click="syncTimerOpen">开始定时上传全部门店</el-button>
    </div>
    <el-form :inline="true" :model="form" class="form-inline">
      <el-form-item label="开始日期">
        <el-date-picker 
          v-model="form.begindate"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYYMMDD"
          placeholder="请选择开始时间"
        />
      </el-form-item>
      <el-form-item label="结束日期">
        <el-date-picker
          v-model="form.enddate"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYYMMDD"
          placeholder="请选择结束时间"
        />
      </el-form-item>
      <el-form-item label="订货日期">
        <el-date-picker
          v-model="form.orderdate"
          type="date"
          :clearable="false"
          format="YYYY-MM-DD"
          value-format="YYYYMMDD"
          placeholder="请选择订货日期"
          @change="dateChange"
        />
      </el-form-item>
      <el-form-item label="客户ID">
        <el-select v-model="form.customersid" class="m-2" placeholder="请选择门店" size="large">
          <el-option
            v-for="item in store.list"
            :key="item.license"
            :label="item.license"
            :value="item.license"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="button-search" type="primary" @click="searchData">查找</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="table-wrapper">
    <el-table :data="table.data" class="table" height="600">
      <el-table-column prop="ordersid" label="订单标识" ></el-table-column>
      <el-table-column prop="customersid" label="客户标识" ></el-table-column>
      <el-table-column prop="reqtotalqty" label="要货数量" ></el-table-column>
      <el-table-column prop="totaldefqty" label="销售总数" ></el-table-column>
      <el-table-column prop="totalamt" label="含税总金额" ></el-table-column>
      <el-table-column prop="inputtim" label="录入时间" ></el-table-column>
      <el-table-column prop="bizdate" label="业务日期" ></el-table-column>
      <el-table-column prop="ordersid" label="操作" >
        <template #default="{row}">
          <el-button type="primary" @click="uploadData(row)">上传</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang='scss' scoped>
.form-wrapper{
  margin-top: 20px;
  padding:20px 15px;
  .button-wrapper {
    display: flex;
    flex-direction: row-reverse;
    margin-bottom: 10px;
  }
}
.table-wrapper {

}
</style>