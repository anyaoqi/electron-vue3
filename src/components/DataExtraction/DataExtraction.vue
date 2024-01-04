<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import DataSource from '@/components/DataSource/DataSource.vue'
import DataPreview, { dataTableType } from '@/components/DataPreview/DataPreview.vue'
import DataColumn from '@/components/DataColumn/DataColumn.vue'
import { columnType } from '@type/index'
import { useData } from '@/hooks/dataExtraction'
import { useDateFormat } from "@vueuse/core";

const { getSql, saveData, getTableData, viewData, getExtrSqlData } = useData()

const props = defineProps<{
  apiFilds: {
    filed: string,
    name: string,
    description: string,
  }[],
  currentExtr: {
    name: string,
    key: string
  }
}>()

// 当前tab标签页
const activeTab = ref('dataSource')

const currentExtr = computed(() => props.currentExtr)

// 获取当前日期
const today = new Date();
// 获取昨天的日期
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const yesterdayFormat = useDateFormat(yesterday, "YYYY-MM-DD").value
const _startDate = localStorage.getItem('startDate')||yesterdayFormat
const _endDate = localStorage.getItem('endDate')||yesterdayFormat
const _license =localStorage.getItem('license')||''
// 数据源
const sqlContent = ref('')
const createTimeField = ref('')
const updateTimeField = ref('')
const startDate = ref(_startDate)
const endDate = ref(_endDate)
const license = ref(_license)
// 数据预览
const dataTable = reactive<dataTableType>({
  columns: [],
  data: []
})

// 接口对照数据
const columnsInfo = reactive({
  columns: [] as any,
  // 接口中传过来的字段
  apiFilds: props.apiFilds,
  tableData: [] as columnType[]
})

// 表格中的数据：格式化接口中的字段
const tableColumns = props.apiFilds.map(filed => {
  return {
    filed: filed.filed,
    name: filed.name,
    filedValue: '',
    defaultValue: '',
    description: filed.description,
  }
})

// 默认数据
columnsInfo.tableData = reactive<columnType[]>(tableColumns)


// Tab切换点击事件
const handleTabClick = (_tab: TabsPaneContext, _event: Event) => {
  console.log(_tab.paneName);
}

const toPrviewData = () => {
  activeTab.value = 'dataPriview'
}

// 预览视图
const previewData = async (sql: string) => {
  if(!sql) {
    ElMessage.warning('请输入查询条件脚本！')
    return
  }
  await saveData({
    englishFlag: currentExtr.value.key,
    englishName: currentExtr.value.name,
    sqlContent: sql,
    tableData: columnsInfo.tableData,
    createTimeField: createTimeField.value,
    updateTimeField: updateTimeField.value,
  })
  let sqlFormat = await getSql(currentExtr.value.key)
  console.log('sqlFormat', sqlFormat);
  viewData(sqlFormat).then(({ tableData, tableColumns, filedList }: any) => {
    dataTable.data = tableData
    dataTable.columns = tableColumns
    columnsInfo.columns  = filedList
    columnsInfo.columns.unshift({
      Filed: ''
    })
    ElMessage.success('查询成功')
    toPrviewData()
  }).catch((err: any) => {
    console.log(err);
    dataTable.columns = []
    dataTable.data = []
  })
}


// 获取之前配置的数据
getTableData(currentExtr.value.key).then(tableData => {
  columnsInfo.tableData = tableData
})

getExtrSqlData(currentExtr.value.key).then((data) => {
  sqlContent.value = data.sql
  createTimeField.value = data.createTimeField
  updateTimeField.value = data.updateTimeField
})

// 保存配置
const saveExtraction = () => {
  saveData({
    englishFlag: currentExtr.value.key,
    englishName: currentExtr.value.name,
    sqlContent: sqlContent.value,
    tableData: columnsInfo.tableData,
    createTimeField: createTimeField.value,
    updateTimeField: updateTimeField.value,
  })
}

const dateChange = () => {
  if(!startDate.value) {
    startDate.value = ""
  }
  if(!endDate.value) {
    endDate.value = ""
  }
  localStorage.setItem('startDate', startDate.value)
  localStorage.setItem('endDate', endDate.value)
}
const licenseChange = () => {
  localStorage.setItem('license', license.value)
}
</script>

<template>
  <div class="page-buttons">
    <el-button type="success" @click="saveExtraction">保存</el-button>
    <el-button type="info">取消</el-button>
  </div>
  <div class="page-content">
    <el-tabs v-model="activeTab" class="demo-tabs" @tab-click="handleTabClick">
      <el-tab-pane label="数据源设定" name="dataSource">
        <div class="filed-wrapper">
          <span class="filed-item">
            开始时间：
            <el-date-picker
              v-model="startDate"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              @change="dateChange"
            />
          </span>
          <span class="filed-item">
            结束时间:
            <el-date-picker
              v-model="endDate"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              @change="dateChange"
            />
          </span>
         
        </div>
        <div class="filed-wrapper">
          <spna class="filed-item">
            <span>许可证</span>
            <el-input v-model="license"   @change="licenseChange" />
          </spna>
          <span class="filed-item">
            创建时间字段名称：
            <el-input v-model="createTimeField"  />
          </span>
          <span class="filed-item">
            更新时间字段名称：
            <el-input v-model="updateTimeField"  />
          </span>
        </div>
        <DataSource @previewData="previewData" v-model="sqlContent" />
      </el-tab-pane>
      <el-tab-pane label="数据预览" name="dataPriview">
        <DataPreview :dataTable="dataTable" />
      </el-tab-pane>
      <el-tab-pane label="接口对照" name="dataColumn">
        <DataColumn
          :columns="columnsInfo.columns"
          v-model="columnsInfo.tableData"
          @prviewData="toPrviewData"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.page-title {
  h2 {
    margin: 10px 0;
  }
}
.page-nav {
}
.page-buttons {
  position: absolute;
  right: 10px;
  top: 0px;
  z-index: 10;
}
.page-content {
.filed-wrapper {
  display: flex;
  margin-bottom: 10px;
  flex-wrap: wrap;
  align-items: center;
  .filed-item {
    margin-right: 20px;
    min-width: 300px;
  }
}
}
</style>
