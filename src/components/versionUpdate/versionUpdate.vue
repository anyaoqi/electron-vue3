<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { checkUpdate,onUpdateMessage,reUpdateMessage, downloadUpdate } from '@/utils/autoUpdater'

const dialogVisible = ref(true)
const closeOnPressEscape = ref(false)
const showClose = ref(false)
const closeOnClickModal = ref(false)
const percentage = ref(0)
const strokeWidth = ref(200)

const handleUpdate = (arg: any) => {
  console.log('消息监听', arg);
  if (arg.cmd === 'checking-for-update') {
    // 开始检测更新
    console.log('开始检测更新');
  } else if (arg.cmd === 'update-available') {
    // 发现新版本
    ElMessageBox.confirm('发现新版本,请确认是否升级？','info', {
      confirmButtonText: '升级',
      cancelButtonText: '取消',
      type: 'info',
    }).then(() => {
      console.log('确认升级')
      downloadUpdate()
      // 显示升级对话框
      dialogVisible.value = true;
    }).catch(() => {
      console.log('取消升级');
    })
  } else if (arg.cmd === 'download-progress') {
    // 下载中
    console.log('下载中', arg);
    
    // const percent = Math.round(parseFloat(arg?.message?.percent));
    // percentage.value = percent;
  } else if (arg.cmd === 'update-downloaded') {
    // 安装最新版本
    dialogVisible.value = false;
  } else if (arg.cmd === 'error') {
    // 错误
    dialogVisible.value = false;
  } else if (arg.cmd === 'update-not-available') {
    // 未发现新版本
   
  }
}

// 移除监听
reUpdateMessage(handleUpdate)
// 绑定监听
onUpdateMessage(handleUpdate)

onMounted(() => {
  checkUpdate()
})
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