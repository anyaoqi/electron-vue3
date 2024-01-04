<template>
  <el-menu class="menu-wrapper" default-active="1">
    <router-link to="/dataExtraction">
    <el-menu-item index="1">
      <template #title>
        <el-icon><message /></el-icon>
       数据抽取配置
      </template>
    </el-menu-item>
    </router-link>
    <router-link to="/dataComparison">
    <el-menu-item index="2">
      <template #title>
        <el-icon><message /></el-icon>
          数据对照配置
      </template>
    </el-menu-item>
    </router-link>
    <router-link to="/distributionList">
    <el-menu-item index="3">
      <template #title>
        <el-icon><setting /></el-icon>
        配货主表查询
      </template>
    </el-menu-item>
    </router-link>
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