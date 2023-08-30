<script lang="ts" setup>
import { reactive, ref, toRefs } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import { extrTypeDatas } from '../../../config/data.config'
import TableReporting from '@/components/TableReporting/TableReporting.vue';
import { api4G08 } from '@/apis'
import { FieldReportingForm } from '@type/index'
import { useLicence } from '@/hooks/user'
import { useNow, useDateFormat } from "@vueuse/core";

// tree类型
interface TreeType {
  label: string
  children?: TreeType[]
}

const { cust_uuid } = useLicence()
const nowDate = useDateFormat(useNow(), "YYYY-MM-DD").value

// 节点属性
const treeProps = {
  children: 'children',
  label: 'label',
}
// 门店数据
const treeData: TreeType[] = [
  {
    label: '总部',
    children: [
      {
        label: '厦门',
      },
    ],
  },
]

// 当前抽取类型
const activeTab = ref(extrTypeDatas[0].key)

// 表单
const form = reactive<FieldReportingForm>({
  begin_date: nowDate,
  end_date: nowDate,
  cust_uuid: cust_uuid,
  page: 1,
  size: 100,
  biz_type: '4G07'
})

const data = reactive({
  tableData: [
    {
      setDate: '2023-08-30',
      setTime: '08:32:55',
      shopName: '火星直营店',
      licenCode: '451541547854',
      totalNum: 10,
      successNum: 6,
      errorNum: 4,
    }
  ]
})
const { tableData } = toRefs(data)

// 门店点击查询
const handleNodeClick = (data: TreeType) => {
  console.log(data)
  getData()
}

// 抽取类型查询
const handleTabClick = (_tab: TabsPaneContext, _event: Event) => {
  console.log(activeTab.value)
  getData()
}

// 查询报表数据
function getData(){
  api4G08(form).then((res) => {
    console.log('api4G08', res);
  })
}

// 查询按钮点击
function searchData() {
  getData()
}

// 刷新按钮点击
function refresh() {
  form.begin_date = nowDate
  form.end_date = nowDate
  form.cust_uuid = cust_uuid
  getData()
}

// 初始化
getData()
</script>

<template>
 <div class="page-reporting">
    <div class="tree-wrapper">
      <el-tree :data="treeData" :props="treeProps" @node-click="handleNodeClick" />
    </div>
    <div class="reporting-content">
      <div class="head-bar">
        操作日期
        <el-date-picker 
          v-model="form.begin_date"
          type="date"
          placeholder="请选择开始时间"
        />
        —
        <el-date-picker
          v-model="form.end_date"
          type="date"
          placeholder="请选择开始时间"
        />
        <el-button class="button-search" type="primary" @click="searchData">查找</el-button>
        <el-button class="button-refash" type="success" @click="refresh">刷新</el-button>
      </div>
      <div class="tabs-wrapper">
        <el-tabs v-model="activeTab" type="border-card" class="tabs" @tab-click="handleTabClick">
          <el-tab-pane
            v-for="(tabItem)  in extrTypeDatas"
            :lazy="true"
            :label="tabItem.name"
            :name="tabItem.key">
            <TableReporting :data="tableData" />
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