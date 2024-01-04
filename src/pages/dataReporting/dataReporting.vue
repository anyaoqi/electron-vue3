<script lang="ts" setup>
import { reactive, ref, toRefs } from 'vue'
import type { TabsPaneContext } from 'element-plus'
// import { extrTypeDatas } from '../../../config/data.config'
import TableReporting from '@/components/TableReporting/TableReporting.vue';
import { api4G08 } from '@/apis'
import { 
  FieldReportingForm,
  LicenseOptionType,
  FieldsStore,
  StoreCompType
} from '@type/index'
import { useLicence } from '@/hooks/user'
import { useNow, useDateFormat } from "@vueuse/core";
import { useData } from "@/hooks/dataExtraction";
import { findFiledValues } from "@/utils";

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

// 分页
const pagination = reactive({
  pageSize: 20, // 每页条数
  total: 1000,  // 总条数
})

// 表单
const form = reactive<FieldReportingForm>({
  begin_date: nowDate,
  end_date: nowDate,
  cust_uuid: '',
  page: 1,
  size: pagination.pageSize,
  biz_type: '4G07'
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

const { getSql, getTableData, viewData } = useData();

const { tableData, treeData } = toRefs(data)
const shopName = ref('')
// 门店点击查询
const handleNodeClick = (data: TreeType) => {
  console.log(data)
  if(data.cust_uuid) {
    form.cust_uuid = data.cust_uuid
    shopName.value = data.label

    getData()
  } else {
    ElMessage.warning('请先在【数据对照配置】中对照该门店数据')
  }
}

// 抽取类型查询
const handleTabClick = (_tab: TabsPaneContext, _event: Event) => {
  form.biz_type = _tab.paneName as string
  getData()
}

// 查询报表数据
function getData(){
  if(!form.cust_uuid) {
    ElMessage.info('请选择门店')
    return
  }
  console.log('form', form);
  data.tableData = []
  api4G08(form).then((res) => {
    console.log('api4G08', res);
    if(res && res?.ALInfoError?.Sucess === '1') {
      const { rows, total } = res.result
      pagination.total = Number(total)
      data.tableData = rows
    } else {
      pagination.total = 0
      data.tableData = []
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
  // 获取抽取sql语句
  const sql:string = await getSql('store')
  if(!sql){
    ElMessage.warning('请先配置门店抽取信息')
    return
  }
  // 获取商超门店抽取数据
  const { tableData: queryData }:any = await viewData(sql)
  if(!queryData) return

  // 拼装接口字段数据
  const columnsData = await getTableData('store');
  const storeInfos = findFiledValues<FieldsStore>(queryData, columnsData);

  // 获取烟草门店数据
  const storeList: LicenseOptionType[] = await window.sqliteAPI.getStoreList()

  console.log('商超抽取的门店数据', storeInfos);
  console.log('烟草的门店数据', storeList);

  // 获取对照关系
  const storeComplist:Array<StoreCompType> = await window.sqliteAPI.getStoreComp()
  console.log('对照关系的门店数据', storeComplist);
  // 保留商超和烟草许可证号相同的门店
  const storesFilter = storeInfos.reduce((prev: any[], curr: FieldsStore) => {
    // 从烟草门店中匹配
    let findStore = storeList.find(item => item.license_code == curr.license_code)
    // 从门店对照关系中匹配
    let findStoreComp = storeComplist.find(item => item.store_id == curr.store_id)
    // cust_uuid-如果从烟草门店中匹配到了就取烟草门店的cust_uuid
    let cust_uuid: string = findStore ? findStore.customer_id : ''
    let license_code: string = findStore ? findStore.license_code : ''
    // 如果烟草门店中没有匹配到就使用门店对照关系匹配到的cust_uuid
    if(!cust_uuid && findStoreComp) {
      cust_uuid = findStoreComp.cust_uuid
      license_code = findStoreComp.license_code
    }
    prev.push({
      label: curr.cust_name,
      cust_uuid: cust_uuid,
      tobaccoNo: license_code,
    })

    // if(curr.tobaccoNo) {
    //   prev.push({
    //     label: curr.shopName,
    //     cust_uuid: curr.tobaccoNo,
    //     tobaccoNo: curr.tobaccoNo,
    //   })
    // }
    return prev
  }, [])

  data.treeData[0].children = storesFilter
}

// 获取数据
getStoreTree()

</script>

<template>
 <div class="page-reporting">
    <div class="tree-wrapper">
      <el-tree 
        class="tree" 
        :data="treeData" 
        :default-expand-all="true" 
        :highlight-current="true"
        :props="treeProps" 
        @node-click="handleNodeClick"
       />
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
  .tree {
    height: 700px;
    overflow: auto;
  }
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