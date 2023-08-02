<script lang="ts" setup>
import { ref } from 'vue'

const sqlContent = ref('')
</script>

<template>
    <p class="desc">
      请编写查询脚本,编写完成后可通过
      <el-button type="primary" plain size="small">预览视图</el-button>
      测试脚本会否可用！
    </p>
    <el-input
      v-model="sqlContent"
      :rows="22"
      type="textarea"
      placeholder="Please input"
    />
</template>

<style lang="scss" scoped>
  
</style>