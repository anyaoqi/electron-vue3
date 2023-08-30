<script lang="ts" setup>
import { useNow, useDateFormat, useNetwork } from '@vueuse/core'
import { useLogout } from '@/hooks/login'
import { useUpload } from '@/hooks/uploadTimer'
import logger from '@/utils/logger'

// 数据抽取
const { isOpenTimer, startUpload, stopUpload } = useUpload()

// 当前时间
const formatted = useDateFormat(useNow(), 'YYYY-MM-DD HH:mm:ss')
// 网络情况
const { isOnline } = useNetwork()
// 当前版本号
const version = APP_VERSION

const { handleLogout } = useLogout()

// 退出登录
const logout = () => {
  ElMessageBox.confirm(
    `是否确认退出登录？`,
    '提示',
    {
      confirmButtonText: '退出',
      cancelButtonText: '取消',
      type: 'info',
    },
  ).then(() => {
    logger.info('退出登录')
    handleLogout()
  })
}

// 切换数据抽取状态
const toggleUpload = () => {
  if(isOpenTimer.value) {
    stopUpload()
  } else {
    startUpload()
  }
}
</script>

<template>
  <div class="header-wrapper">
    <div class="header-left">
      <img class="logo" src="../../assets/images/logo.png" alt="Element Plus Logo" data-v-0baf1018="">
    </div>
    <div class="header-right">
      <span class="header-item app-version">
        <el-tag size="large">版本号：{{ version }}</el-tag>
      </span>
      <span class="header-item upload-timer"
        :class="{ disabled: !isOpenTimer }"
        :title="isOpenTimer ? '正在进行数据抽取' : '数据抽取已停止'"
        @click="toggleUpload"
        >
        <i class="fa fa-cloud-upload"></i>
      </span>
      <span class="header-item net-state">
        <i class="fa fa-wifi"></i>
        <span class="">{{ isOnline ? '已连接' : '未连接'}}</span>
      </span>
      <span class="header-item now-date">{{ formatted }}</span>
      <span class="header-item btn-logout" @click="logout" title="退出登录">
        <i class="fa fa-sign-out"></i>
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header-wrapper {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0 32px;
  position: relative;
  border-bottom: 1px solid #dcdfe6;
  height: 55px;
  padding: 0 12px 0 24px;
  background-color: $color-primary;
  background-size: 4px 4px;
  backdrop-filter: saturate(50%) blur(4px);
  -webkit-backdrop-filter: saturate(50%) blur(4px);
  top: 0;
  .header-left {
    display: flex;
    align-items: center;
    height: 55px;
    .logo {
      width: 128px;
    }
  }
  .header-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-grow: 1;
    .header-item {
      position: relative;
      margin-right: 10px;
      padding-right: 10px;
      height: 24px;
      line-height: 24px;
      color: $color-white;
      &::after {
        content: "";
        display: block;
        width: 1px;
        height: 18px;
        background-color: #fff;
        position: absolute;
        bottom: 0;
        right: 0;
        top: 2px;
      }
      &.upload-timer {
        cursor: pointer;
        &.disabled {
          color: #666;
        }
      }
      &.net-state {
        i {
          margin-right: 5px;
        }
      }
      &.btn-logout {
        cursor: pointer;
      }
    }
    .header-item:last-child {
      &::after {
        display: none;
      }
    }
  }
}
</style>