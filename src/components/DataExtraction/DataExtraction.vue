<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElLoading } from 'element-plus'
import type { TabsPaneContext } from 'element-plus'
import DataSource from '@/components/DataSource/DataSource.vue'
import DataPreview, { dataTableType } from '@/components/DataPreview/DataPreview.vue'
import DataColumn from '@/components/DataColumn/DataColumn.vue'
import { FieldPacket } from 'mysql2'
import { columnType } from '@/types'



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


onMounted(() => {
  console.log('加载完成', props);
})

// 当前tab标签页
const activeTab = ref('dataSource')

// 接口对照数据
const columnsInfo = reactive({
  columns: [],
  // 接口中传过来的字段
  apiFilds: props.apiFilds,
  tableData: [] as columnType[]
})

// Tab切换点击事件
const handleTabClick = (_tab: TabsPaneContext, _event: Event) => {
  console.log(_tab.paneName);
  if(columnsInfo.columns.length <= 0 && _tab.paneName==='dataColumn') {
    
  }
}

// 数据预览
const dataTable = reactive<dataTableType>({
  columns: [],
  data: []
})

// 预览视图
const previewData = (sql: string) => {
  const loading = ElLoading.service({
    lock: true,
    text: '数据查询中,请稍候...',
    background: 'rgba(255,255,255,0.8)',
  })
  window.serverAPI.getShopInfos(sql).then(({results, columns}: any) => {
    console.log(results, columns);
    dataTable.data = results
    dataTable.columns = columns.map((column: FieldPacket) => {
      return {
          "key": column.name,
          "dataKey": column.name,
          "title": column.name,
          "width": column.name.length * 20
      }
    })
    columnsInfo.columns = columns.map((column:FieldPacket) => ({ Field: column.name }))
    ElMessage.success('查询成功')
    activeTab.value = 'dataPriview'
    loading.close()
  }).catch((err: any) => {
    ElMessage.warning(err.message)
    dataTable.columns = []
    dataTable.data = []
    loading.close()
  })
}

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

const currentExtr = computed(() => props.currentExtr)
// 获取之前配置的数据
window.sqliteAPI.getExtrMappData(currentExtr.value.key).then((rows: any) => {
  if(rows && rows.length) {
    columnsInfo.tableData = rows.map((row: any) => {
      return {
        filed: row.filed,
        name: row.name,
        filedValue: row.filed_value,
        defaultValue: row.default_value,
        description: row.description,
      }
    })
  }
})

const sqlContent = ref('SELECT * FROM shop_infos')
window.sqliteAPI.getExtrSqlData(currentExtr.value.key).then((data: any) => {
  sqlContent.value = data.sql
})

// 保存配置
const saveExtraction = () => {
  const englishFlag:string = currentExtr.value.key
  const englishName:string = currentExtr.value.name
  let isError:boolean = false
  // 保存sql
  window.sqliteAPI.saveExtrSqlData({
    englishFlag: englishFlag,
    sql: sqlContent.value,
  }).catch((err: any) => {
    isError = true
    ElMessage({
      type: 'error',
      message: err
    })
  })
  // 循环保存接口对照
  for (const row of columnsInfo.tableData) {
    window.sqliteAPI.saveExtrMappData({
      filed: row.filed,  // 接口字段key
      name: row.name,  // 接口字段名称
      filedValue: row.filedValue,    // 对应字段key
      defaultValue: row.defaultValue, // 默认值
      description: row.description, // 描述
      englishFlag: englishFlag,  // 抽取类型key
      englishName: englishName   // 抽取类型名称
    }).catch((err: any) => {
      isError = true
      ElMessage({
        type: 'error',
        message: err
      })
    })
  }

  !isError && ElMessage.success('保存成功！')
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
        <DataSource @previewData="previewData" v-model="sqlContent"  />
      </el-tab-pane>
      <el-tab-pane label="数据预览" name="dataPriview">
        <DataPreview :dataTable="dataTable"/>
      </el-tab-pane>
      <el-tab-pane label="接口对照" name="dataColumn">
        <DataColumn :columns="columnsInfo.columns" v-model="columnsInfo.tableData"  />
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

}
</style>