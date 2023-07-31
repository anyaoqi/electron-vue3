<template>
  <el-menu class="menu-wrapper" :default-openeds="['1', '3']">
    <el-menu-item index="4-1">
      <template #title>
        <el-icon><message /></el-icon>
        <router-link to="/dataExtraction">数据抽取配置</router-link>
      </template>
    </el-menu-item>
    <el-menu-item index="4-2">
      <template #title>
        <el-icon><message /></el-icon>
        <router-link to="/dataComparison">数据对照配置</router-link>
      </template>
    </el-menu-item>
    <el-menu-item index="4-3">
      <template #title>
        <el-icon><setting /></el-icon>
        <router-link to="/dataReporting">上报数据查询</router-link>
      </template>
    </el-menu-item>
  </el-menu>
</template>


<style lang="scss" scoped>
.menu-wrapper {
  border-right: solid 0px #000;
  a {
    text-decoration: none;
    color: #000;
  }
}
</style>