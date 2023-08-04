<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElLoading } from 'element-plus'
import type { TabsPaneContext } from 'element-plus'
import DataSource from '@/components/DataSource/DataSource.vue'
import DataPreview, { dataTableType } from '@/components/DataPreview/DataPreview.vue'
import DataColumn from '@/components/DataColumn/DataColumn.vue'
import { FieldPacket } from 'mysql2'
import extractionData from './extractionData'

// 默认显示抽取内容
const defaultType = 'store'
// 当前抽取内容
const currExtraction = ref(defaultType)
// 当前tab标签页
const activeTab = ref('dataSource')

// 接口对照数据
const columnsInfo = reactive({
  columns: [],
  // 接口中传过来的字段
  apiFilds: extractionData[0].apiFilds
})

// Tab切换点击事件
const handleTabClick = (_tab: TabsPaneContext, _event: Event) => {
  console.log(_tab.paneName);
  if(columnsInfo.columns.length <= 0 && _tab.paneName==='dataColumn') {
    window.serverAPI.getShopColums().then(({results}: any) => {
      console.log('resultsColums', results);
      columnsInfo.columns = results
    })
  }
}

// 根据当前抽取内容获取按钮type状态
const getBtnType = (name:string) => {
  return currExtraction.value === name ? 'primary' : ''
}

// 切换抽取内容
const handleBtnClick = (name: string) => {
  currExtraction.value = name
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
    ElMessage.success('查询成功')
    activeTab.value = 'dataPriview'
    loading.close()
  }).catch((err: any) => {
    console.log(err);
    dataTable.columns = []
    dataTable.data = []
    loading.close()
  })
}

</script>

<template>
  <div class="page-title">
    <h2>数据抽取配置</h2>
  </div>
  <nav class="page-nav">
    <el-button-group>
      <el-button 
        v-for="(val) in extractionData"
        plain 
        :type="getBtnType(val.key)"
        @click="handleBtnClick(val.key)"
        >
        {{ val.name }}
      </el-button>
      
      <!-- <el-button plain :type="getBtnType('btn2')" @click="handleBtnClick('btn2')">商品信息抽取</el-button>
      <el-button plain :type="getBtnType('btn3')" @click="handleBtnClick('btn3')">会员信息抽取</el-button>
      <el-button plain :type="getBtnType('btn4')" @click="handleBtnClick('btn4')">零售订单抽取</el-button>
      <el-button plain :type="getBtnType('btn5')" @click="handleBtnClick('btn5')">入库单据抽取</el-button>
      <el-button plain :type="getBtnType('btn6')" @click="handleBtnClick('btn6')">报损单据抽取</el-button>
      <el-button plain :type="getBtnType('btn7')" @click="handleBtnClick('btn7')">其他出入库单据抽取</el-button>
      <el-button plain :type="getBtnType('btn8')" @click="handleBtnClick('btn8')">日结进销存抽取</el-button> -->
    </el-button-group>
  </nav>
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
  margin-top: 10px;
}
.page-content {

}
</style>
./extractionData