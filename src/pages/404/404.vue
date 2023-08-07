<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const returnHome = () => {
  router.replace('/')
}
</script>

<template>
  <div>
    <el-button type="primary" @click="returnHome">返回首页</el-button>
  </div>
</template>

<style lang="scss" scoped>
</style>