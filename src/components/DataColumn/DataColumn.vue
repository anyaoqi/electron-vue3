<script lang="ts" setup>
import { computed } from 'vue'
import type { columnType } from '@type/index'

// 组件属性
const props = defineProps<{
  columns: any[],
  modelValue: columnType[]
}>()
// 绑定事件
const emit = defineEmits(['update:modelValue', 'prviewData'])
// 对应字段列表
const columns = computed(() => props.columns)
// 选择对应字段
const selectColumnChange = (_val: string, _index: number) => {
  const columnInfo = columns.value.find(c => c.Field === _val)
  console.log(columnInfo);
}
// 表格字段数据
const tableData = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const prviewData = () => {
  emit('prviewData')
}
</script>

<template>
  <el-button @click="prviewData">预览视图</el-button>
  <div class="data-reporting">
    <el-table :data="tableData">
      <el-table-column prop="filed" label="接口字段" width="180">
        <template #default="{ row }">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column prop="filedValue" label="对应字段" width="180">
        <template #default="{ row, $index }">
          <el-select 
            v-model="row.filedValue" 
            class="m-2" 
            placeholder="Select"  
            @change="selectColumnChange($event, $index)">
            <el-option
              v-for="item in columns"
              :key="item.Field"
              :label="item.Field"
              :value="item.Field"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="defaultValue" label="默认值">
        <template #default="{ row }">
          <el-input v-model="row.defaultValue"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述">
        <template #default="{ row }">
          <el-input v-model="row.description"></el-input>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss" scoped></style>
