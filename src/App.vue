<script setup lang="ts">
// 测试
// fetch('http://localhost:5354/user').then(response => response.json()).then(res => {
//   console.log('收到结果了',res);
// })
</script>

<template>
  <router-view></router-view>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
