<script lang="ts" setup>
import { ref } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { sql } from '@codemirror/lang-sql'
import { oneDark } from '@codemirror/theme-one-dark'

// 声名组件事件
const emit = defineEmits<{
  // 预览视图
  previewData: [sql: string]
}>()

const sqlContent = ref('')

// 预览视图
const previewData = () => {
  emit('previewData', sqlContent.value)
}

const extensions = [sql(), oneDark]
</script>

<template>
    <p class="desc">
      请编写查询脚本,编写完成后可通过
      <el-button type="primary" plain size="small" @click="previewData">预览视图</el-button>
      测试脚本会否可用！
    </p>
    <codemirror
      v-model="sqlContent"
      placeholder="Code goes here..."
      :style="{ height: '400px' }"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
    />
    <!-- <el-input
      v-model="sqlContent"
      :rows="20"
      type="textarea"
      placeholder="Please input"
    /> -->
</template>

<style lang="scss" scoped>
  
</style>