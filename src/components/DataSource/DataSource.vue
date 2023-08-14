<script lang="ts" setup>
import { computed } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { sql } from '@codemirror/lang-sql'
import { oneDark } from '@codemirror/theme-one-dark'

const props = defineProps<{
  modelValue: string
}>()

// 声名组件事件
const emit = defineEmits<{
  // 预览视图
  previewData: [sql: string],
  'update:modelValue': [sql: string]
}>()

// 输入内容
const sqlContent = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
// 预览视图
const previewData = () => {
  emit('previewData', props.modelValue)
}

// 输入框配置
const extensions = [sql(), oneDark]

// 输入框失去焦点事件
const handleBlur = () => {
}
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
      @blur="handleBlur()"
    />
</template>

<style lang="scss" scoped>
  
</style>