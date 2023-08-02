<script lang="ts" setup>
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import DataSource from '@/components/DataSource/DataSource.vue'
import DataPreview from '@/components/DataPreview/DataPreview.vue'
import DataColumn from '@/components/DataColumn/DataColumn.vue'

const activeTab = ref('one')
const actionBtn = ref('btn1')

const handleTabClick = (_tab: TabsPaneContext, _event: Event) => {
  console.log(_tab.paneName);
  
}
const getBtnType = (name:string) => {
  return actionBtn.value === name ? 'primary' : ''
}
const handleBtnClick = (name: string) => {
  actionBtn.value = name
}
</script>

<template>
  <div class="page-title">
    <h2>数据抽取配置</h2>
  </div>
  <nav class="page-nav">
    <el-button-group>
      <el-button plain :type="getBtnType('btn1')" @click="handleBtnClick('btn1')">门店信息抽取</el-button>
      <el-button plain :type="getBtnType('btn2')" @click="handleBtnClick('btn2')">商品信息抽取</el-button>
      <el-button plain :type="getBtnType('btn3')" @click="handleBtnClick('btn3')">会员信息抽取</el-button>
      <el-button plain :type="getBtnType('btn4')" @click="handleBtnClick('btn4')">零售订单抽取</el-button>
      <el-button plain :type="getBtnType('btn5')" @click="handleBtnClick('btn5')">入库单据抽取</el-button>
      <el-button plain :type="getBtnType('btn6')" @click="handleBtnClick('btn6')">报损单据抽取</el-button>
      <el-button plain :type="getBtnType('btn7')" @click="handleBtnClick('btn7')">其他出入库单据抽取</el-button>
      <el-button plain :type="getBtnType('btn8')" @click="handleBtnClick('btn8')">日结进销存抽取</el-button>
    </el-button-group>
  </nav>
  <div class="page-buttons">
    <el-button type="success">保存</el-button>
    <el-button type="info">取消</el-button>
  </div>
  <div class="page-content">
    <el-tabs v-model="activeTab" class="demo-tabs" @tab-click="handleTabClick">
      <el-tab-pane label="数据源设定" name="one">
        <DataSource  />
      </el-tab-pane>
      <el-tab-pane label="数据预览" name="two">
        <DataPreview />
      </el-tab-pane>
      <el-tab-pane label="接口对照" name="three">
        <DataColumn />
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
