<script lang="ts" setup>
import { reactive, ref, toRefs } from 'vue'
import type { TabsPaneContext } from 'element-plus'
// import { extrTypeDatas } from '../../../config/data.config'
import TableReporting from '@/components/TableReporting/TableReporting.vue';
import { api4G08 } from '@/apis'
import { FieldReportingForm, LicenseOptionType } from '@type/index'
import { useLicence } from '@/hooks/user'
import { useNow, useDateFormat } from "@vueuse/core";

// tree类型
interface TreeType {
  label: string,
  cust_uuid?: string,
  children?: TreeType[]
}

// 上报查询数据类型
interface ReportDataType {
  upload_time: string
  license_code: string
  batch_success_num: number
  batch_fail_num: number
}

// data数据类型
interface Data {
  tableData: ReportDataType[],
  treeData: TreeType[]
}

const { cust_uuid } = useLicence()
const nowDate = useDateFormat(useNow(), "YYYY-MM-DD").value

// 节点属性
const treeProps = {
  children: 'children',
  label: 'label',
}

const extrDatas = [
  { label: '门店信息抽取',  name: '4G07' },
  { label: '商品信息抽取',  name: '4G04' },
  { label: '会员信息抽取',  name: '4G06' },
  { label: '零售订单抽取',  name: '4S00' },
  { label: '入库单据抽取',  name: '4S01' },
  { label: '报损单据抽取',  name: '4S02' },
  { label: '其他出入库单据抽取',  name: '4S03' },
  { label: '日结进销存抽取',  name: '4S04' },
]

// 当前抽取类型
const activeTab = ref<string>(extrDatas[0].name)

// 表单
const form = reactive<FieldReportingForm>({
  begin_date: nowDate,
  end_date: nowDate,
  cust_uuid: '',
  page: 1,
  size: 100,
  biz_type: '4G07'
})

// 分页
const pagination = reactive({
  pageSize: 20, // 每页条数
  total: 1000,  // 总条数
})

const data = reactive<Data>({
  tableData: [],
  treeData: [
    {
      label: '总部',
      children: [],
    },
  ]
})

const { tableData, treeData } = toRefs(data)
const shopName = ref('')
// 门店点击查询
const handleNodeClick = (data: TreeType) => {
  console.log(data)
  if(data.cust_uuid) {
    form.cust_uuid = data.cust_uuid
    shopName.value = data.label

    getData()
  }
}

// 抽取类型查询
const handleTabClick = (_tab: TabsPaneContext, _event: Event) => {
  form.biz_type = activeTab.value
  getData()
}

// 查询报表数据
function getData(){
  if(!form.cust_uuid) {
    ElMessage.info('请选择门店')
    return
  }
  console.log('form', form);
  api4G08(form).then((res) => {
    console.log('api4G08', res);
    if(res) {
      pagination.total = res.total
    }
  })
}

// 查询按钮点击
function searchData() {
  console.log('form', form);
  getData()
}

// 刷新按钮点击
function refresh() {
  form.begin_date = nowDate
  form.end_date = nowDate
  form.cust_uuid = cust_uuid
  form.page = 1
  getData()
}

// 分页
function pageChange(index: number) {
  form.page = index
  getData()
}

// 获取门店列表
async function getStoreTree() {
  const storeList: LicenseOptionType[] = await window.sqliteAPI.getStoreList()
  data.treeData[0].children = storeList.map(store => {
    return {
      label: store.cust_name,
      cust_uuid: store.cust_uuid,
    }
  })
}

// 获取数据
getStoreTree()

</script>

<template>
 <div class="page-reporting">
    <div class="tree-wrapper">
      <el-tree :data="treeData" :default-expand-all="true" :props="treeProps" @node-click="handleNodeClick" />
    </div>
    <div class="reporting-content">
      <div class="head-bar">
        操作日期
        <el-date-picker 
          v-model="form.begin_date"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="请选择开始时间"
        />
        —
        <el-date-picker
          v-model="form.end_date"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="请选择开始时间"
        />
        <el-button class="button-search" type="primary" @click="searchData">查找</el-button>
        <el-button class="button-refash" type="success" @click="refresh">刷新</el-button>
      </div>
      <div class="tabs-wrapper">
        <el-tabs v-model="activeTab" type="border-card" class="tabs" @tab-click="handleTabClick">
          <el-tab-pane
            v-for="(tabItem)  in extrDatas"
            :lazy="true"
            :label="tabItem.label"
            :name="tabItem.name">
            <TableReporting :data="tableData" :pagination="pagination" :shopName="shopName" @pageChange="pageChange"/>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
 </div>
</template>

<style lang="scss" scoped>
.page-reporting {
  display: flex;
}
.tree-wrapper {
  width: 200px;
  padding: 10px 0;
  margin-right: 10px;
}
.reporting-content {
  flex: 1;
  overflow: hidden;
  .head-bar {
    padding: 10px 0;
    .button-search {
      margin-left: 10px
    }
  }
  .tabs-wrapper {
    width: 100%;
  }
}
</style>