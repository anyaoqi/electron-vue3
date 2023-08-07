<script setup lang="ts">
import VersionUpdate from '@/components/versionUpdate/versionUpdate.vue'
</script>

<template>
  <router-view></router-view>
  <!-- 版本更新 -->
  <VersionUpdate />
</template>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
