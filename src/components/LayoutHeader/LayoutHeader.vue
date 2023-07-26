<template>
  <div class="header-wrapper">
    <div class="header-left">
      <img class="logo" src="../../assets/images/logo.png" alt="Element Plus Logo" data-v-0baf1018="">
    </div>
    <div class="header-right">
      <span class="header-item app-version">
        <el-tag>v-1.0.0</el-tag>
      </span>
      <span class="header-item net-state">
        <i class="fa fa-wifi"></i>
        <span class="">已连接</span>
      </span>
      <span class="header-item now-date">2023-05-08</span>
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
        background-color: #ada7a7;
        position: absolute;
        bottom: 0;
        right: 0;
        top: 2px;
      }
      &.net-state {
        i {
          margin-right: 5px;
        }
      }
    }
  }
}
</style>