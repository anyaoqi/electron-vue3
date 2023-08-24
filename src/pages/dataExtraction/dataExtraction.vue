<script lang="ts" setup>
import { reactive } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import DataExtraction from '@/components/DataExtraction/DataExtraction.vue'
import { extrTypeDatas } from '@main/config/data.config'
import { useUpload } from '@/hooks/uploadTimer'

// 上传定时器
const { isOpenTimer, startUpload, stopUpload } = useUpload()

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

const handleStartUpload = () => {
  startUpload()
}

const handleStopTimeout = () => {
  stopUpload()
}
</script>

<template>
  <div class="page-title">
    <h2>数据抽取配置</h2>
    <div class="head-right">
      <el-button type="danger" v-if="isOpenTimer" @click="handleStopTimeout">停止抽取</el-button>
      <el-button type="primary" v-else @click="handleStartUpload" >开始抽取</el-button>
    </div>
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  h2 {
    margin: 10px 0;
  }
}
</style>