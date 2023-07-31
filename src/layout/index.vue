<script setup lang="ts">
import LayoutBarMenu from '@/components/LayoutBarMenu/LayoutBarMenu.vue'
import LayoutHeader from '@/components/LayoutHeader/LayoutHeader.vue'
import LayoutMain from '@/components/LayoutMain/LayoutMain.vue'
</script>

<template>
  <!-- 头部 -->
  <header class="layout-header">
    <LayoutHeader />
  </header>
  <el-scrollbar class="layout-scrollbar">
    <LayoutBarMenu />
  </el-scrollbar>
  <div class="layout-main">
    <div class="page-container">
      <LayoutMain />
    </div>
  </div>
</template>

<style scoped lang="scss">
$layout-left-width: 230px;
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
    height: calc(100vh - 55px);
  }
}
</style>
