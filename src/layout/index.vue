<script setup lang="ts">
// 测试
// fetch('http://localhost:5354/user').then(response => response.json()).then(res => {
//   console.log('收到结果了',res);
// })
</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- 主体内容 -->
      <el-container>
        <!-- 左侧菜单区域 -->
        <el-aside width="200px">
          <el-scrollbar>
            <el-menu :default-openeds="['1', '3']">
              <el-sub-menu index="1">
                <template #title>
                  <el-icon><message /></el-icon>Navigator One
                </template>
                <el-menu-item index="1-1">Option 1-1</el-menu-item>
                <el-menu-item index="1-2">Option 1-2</el-menu-item>
                <el-menu-item index="1-3">Option 1-3</el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="2">
                <template #title>
                  <el-icon><message /></el-icon>Navigator Two
                </template>
                <el-menu-item index="2-1">Option 2-1</el-menu-item>
                <el-menu-item index="2-2">Option 2-2</el-menu-item>
                <el-menu-item index="2-3">Option 2-3</el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="3">
                <template #title>
                  <el-icon><setting /></el-icon>Navigator Three
                </template>
                <el-menu-item index="3-1">Option 3-1</el-menu-item>
                <el-menu-item index="3-2">Option 3-2</el-menu-item>
                <el-menu-item index="3-3">Option 3-3</el-menu-item>
              </el-sub-menu>
            </el-menu>
          </el-scrollbar>
        </el-aside>
        <!-- 右侧页面区域 -->
        <el-main>
            <!-- 头部 -->
            <el-header class="header">
              <div class="header-left">
                header-left
              </div>
              <div class="header-right">
                header-right
              </div>
            </el-header>
          <RouterView></RouterView>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
