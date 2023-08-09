<script lang="ts" setup>
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import DataExtraction from '@/components/DataExtraction/DataExtraction.vue'
import extractionData from '@/pages/dataExtraction/extractionData.ts'

// 当前tab标签页
const activeTab = ref(0)

// Tab切换点击事件
const handleTabClick = (_tab: TabsPaneContext, _event: Event) => {
  console.log(_tab.paneName);
}

</script>

<template>
  <div class="page-title">
    <h2>数据抽取配置</h2>
  </div>
  <el-tabs
    v-model="activeTab"
    type="card"
    class="page-tabs"
    @tab-click="handleTabClick"
    >
    <el-tab-pane
      v-for="(tabItem, index)  in extractionData"
      :label="tabItem.name"
      :name="index">
      <DataExtraction :api-filds="tabItem.apiFilds" />
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="scss" scoped>
.page-title {
  h2 {
    margin: 10px 0;
  }
}
</style>