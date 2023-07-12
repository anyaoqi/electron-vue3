<script setup lang="ts">
// 测试
fetch('http://localhost:5354/user').then(response => response.json()).then(res => {
  console.log('收到结果了',res);
})
</script>

<template>
  <!-- <h1 class="red-text">商超数据转换系统</h1>
  <el-button type="primary">Primary</el-button> -->
  <router-view></router-view>
</template>

<style scoped lang="scss">
</style>
