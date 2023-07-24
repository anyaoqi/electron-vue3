<script lang="ts" setup>
import { useRouter, Router } from 'vue-router'
import { useStore } from '@/pinia/index.ts'

const stroe = useStore()
const router:Router = useRouter()
const name = 'hello2'
const login = () => {
  stroe.setLogin(true)
  router.push('/')
}
</script>

<template>
  <i class="fa fa-camera-retro"></i> fa-camera-retro
  <div class="text">{{ name }}</div>
  <el-button type="primary" @click="login">登录</el-button>
</template>

<style lang="scss" scoped>
.text {
  color: $theme-color-warning;
}
</style>