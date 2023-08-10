<script lang="ts" setup>
import { computed, reactive } from 'vue'

interface columnType {
  filed: string,  // 接口字段key
  name: string,  // 接口字段名称
  filedValue: string,  // 对应字段
  defaultValue: string,  // 默认值
  description: string    // 描述/说明
}

const props = defineProps<{
  columns: any[],
  apiFilds: any[],
}>()

const columns = computed(() => props.columns)
const apiColumns = computed(() => props.apiFilds)

// 表格中的数据：格式化接口中的字段
const tableColumns:columnType[] = apiColumns.value.map(filed => {
  return {
    filed: filed.filed,
    name: filed.name,
    filedValue: '',
    defaultValue: '',
    description: filed.description,
  }
})

// 接口对照响应式数据
const tableData = reactive<columnType[]>(tableColumns)

const selectColumnChange = (_val: string, _index: number) => {
  const columnInfo = columns.value.find(c => c.Field === _val)
  console.log(columnInfo);
}
</script>

<template>
  <el-button>预览视图</el-button>
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
