<script setup lang="ts">
import { onMounted, ref } from 'vue'
import LayoutBarMenu from '@/components/LayoutBarMenu/LayoutBarMenu.vue'
import LayoutHeader from '@/components/LayoutHeader/LayoutHeader.vue'
import LayoutMain from '@/components/LayoutMain/LayoutMain.vue'
import DialogDbConfig from '@/components/DialogDbConfig/DialogDbConfig.vue';
import { useHookDialog, useLoading} from '@/hooks'
import { configType } from '@config/type.config'
import { useConfig } from '@/pinia/config'
import { useDataSync } from '@/hooks/uploadTimer'

const config = useConfig()
const { setLoading } = useLoading()
const { setDialogVisable } = useHookDialog()

const percentage = ref<number>(0)

const { syncTimerOpen } = useDataSync()

window.electronAPI.getConfig().then((res: configType) => {
  config.setConfig(res)
})

// 同步数据
const syncData = () => {
  syncTimerOpen()
}

onMounted(async () => {
  setLoading(false)
  // const boo = await window.serverAPI.isConnection()
  // 开启定时数据抽取
  // boo && startUpload()
  setDialogVisable(true)
})

</script>

<template>
  <!-- 数据同步进度条 -->
  <div class="progress-wrapper">
    <el-progress  v-show="percentage!=0" :percentage="50" status="success" :show-text="false" />
  </div>
  <!-- 头部 -->
  <header class="layout-header">
    <LayoutHeader />
  </header>
  <el-scrollbar class="layout-scrollbar">
    <LayoutBarMenu />
    <div class="fixed-bottom">
      <el-button type="primary" plain @click="setDialogVisable(true)">数据库连接</el-button>
      <el-button type="success" plain @click="syncData()">数据同步</el-button>
    </div>
  </el-scrollbar>
  <div class="layout-main">
    <div class="page-container">
      <LayoutMain />
    </div>
  </div>
  <DialogDbConfig ref="dbConfigRef" />
</template>

<style scoped lang="scss">
$layout-left-width: 230px;

.progress-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
}
.layout-header {
  position: sticky;
  width: 100%;
}
.layout-scrollbar {
  position: fixed;
  top: 56px;
  bottom: 0;
  left: 0;
  z-index: 10;
  box-sizing: border-box;
  width: $layout-left-width;
  height: calc(100% - 55px);
  background-color: #fff;
  overflow-y: auto;
  transform: translate(0);
  transition: background-color 0.2s,opacity .25s,transform .5s cubic-bezier(.19,1,.22,1);
  border-right: solid 1px #dcdfe6;
}
.layout-main {
  padding-left: $layout-left-width;
  .page-container {
    padding: 0px 18px;
    overflow: auto;
    max-height: calc(100vh - 56px);
  }
}
.fixed-bottom {
  position: absolute;
  bottom: 0;
  padding: 20px 0;
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
}
</style>
