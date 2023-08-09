<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElLoading } from 'element-plus'
import type { TabsPaneContext } from 'element-plus'
import DataSource from '@/components/DataSource/DataSource.vue'
import DataPreview, { dataTableType } from '@/components/DataPreview/DataPreview.vue'
import DataColumn from '@/components/DataColumn/DataColumn.vue'
import { FieldPacket } from 'mysql2'

// 当前tab标签页
const activeTab = ref('dataSource')

const props = defineProps<{
  apiFilds: {
    filed: string,
    name: string,
  }[]
}>()

// 接口对照数据
const columnsInfo = reactive({
  columns: [],
  // 接口中传过来的字段
  apiFilds: props.apiFilds
})

// Tab切换点击事件
const handleTabClick = (_tab: TabsPaneContext, _event: Event) => {
  console.log(_tab.paneName);
  if(columnsInfo.columns.length <= 0 && _tab.paneName==='dataColumn') {
    
  }
}

// 数据预览
const dataTable = reactive<dataTableType>({
  columns: [
      {
          "key": "",
          "dataKey": "",
          "title": "",
          "width": 0
      },
      {
          "key": "",
          "dataKey": "",
          "title": "",
          "width": 0
      },
  ],
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

</script>

<template>
  <div class="page-buttons">
    <el-button type="success">保存</el-button>
    <el-button type="info">取消</el-button>
  </div>
  <div class="page-content">
    <el-tabs v-model="activeTab" class="demo-tabs" @tab-click="handleTabClick">
      <el-tab-pane label="数据源设定" name="dataSource">
        <DataSource @previewData="previewData"  />
      </el-tab-pane>
      <el-tab-pane label="数据预览" name="dataPriview">
        <DataPreview :dataTable="dataTable"/>
      </el-tab-pane>
      <el-tab-pane label="接口对照" name="dataColumn">
        <DataColumn :columns="columnsInfo.columns" :api-filds="columnsInfo.apiFilds" />
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