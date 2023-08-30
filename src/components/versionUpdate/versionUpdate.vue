<script lang="ts" setup>
import { ref } from 'vue'
import {onUpdateMessage,reUpdateMessage, downloadUpdate } from '@/utils/autoUpdater'
import logger from '@/utils/logger'

const dialogVisible = ref(true)
const closeOnPressEscape = ref(false)
const showClose = ref(false)
const closeOnClickModal = ref(false)
const percentage = ref(0)
const strokeWidth = ref(200)

const handleUpdate = (arg: any) => {
  console.log('版本更新消息监听', arg);
  if (arg.cmd === 'checking-for-update') {
    // 开始检测更新
    logger.info('开始检测更新')
  } else if (arg.cmd === 'update-available') {
    logger.info('发现新版本')
    // 发现新版本
    ElMessageBox.confirm('发现新版本,请确认是否升级？','info', {
      confirmButtonText: '升级',
      cancelButtonText: '取消',
      type: 'info',
    }).then(() => {
      logger.info('确认升级')
      downloadUpdate()
      // 显示升级对话框
      dialogVisible.value = true;
    }).catch(() => {
      logger.info('取消升级')
    })
  } else if (arg.cmd === 'download-progress') {
    // 下载中
    const percent = Math.round(parseFloat(arg?.message?.percent));
    percentage.value = percent;
  } else if (arg.cmd === 'update-downloaded') {
    // 安装最新版本
    logger.info('安装最新版本')
    dialogVisible.value = false;
  } else if (arg.cmd === 'error') {
    // 错误
    logger.error('检测版本更新升级失败: \n '+arg.message)
    dialogVisible.value = false;
  } else if (arg.cmd === 'update-not-available') {
    // 未发现新版本
   
  }
}

// 移除监听
reUpdateMessage()
// 绑定监听
onUpdateMessage(handleUpdate)

// onMounted(() => {
//   checkUpdate()
// })
</script>

<template>
   <el-dialog
      title="正在更新版本,请稍后 ···"
      :visible.sync="dialogVisible" width="60%"
      :close-on-click-modal="closeOnClickModal"
      :close-on-press-escape="closeOnPressEscape"
      :show-close="showClose"
      center
      >
      <div style="width: 100%; height: 5vh; line-height: 5vh; text-align: center">
        <el-progress
          status="success"
          :text-inside="true"
          :stroke-width="20"
          :percentage="percentage"
          :width="strokeWidth"
          :show-text="true">
        </el-progress>
      </div>
    </el-dialog>
</template>

<style lang="scss" scoped>
</style>