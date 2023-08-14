<script lang="ts" setup>
import { reactive } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import DataExtraction from '@/components/DataExtraction/DataExtraction.vue'
import { extrTypeDatas } from '@main/config/data.config'

// 当前tab标签页
const activeTab = reactive({
  name: extrTypeDatas[0].name,
  key: extrTypeDatas[0].key
})

// Tab切换点击事件
const handleTabClick = (_tab: TabsPaneContext, _event: Event) => {
  const fItem = extrTypeDatas.find(item => item.key === _tab.paneName)
  activeTab.name = fItem?.name||''
}

</script>

<template>
  <div class="page-title">
    <h2>数据抽取配置</h2>
  </div>
  <el-tabs
    v-model="activeTab.key"
    type="card"
    class="page-tabs"
    @tab-click="handleTabClick"
    >
    <el-tab-pane
      v-for="(tabItem)  in extrTypeDatas"
      :lazy="true"
      :label="tabItem.name"
      :name="tabItem.key">
      <DataExtraction :api-filds="tabItem.apiFilds" :currentExtr="activeTab" />
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