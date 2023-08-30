<script lang="ts" setup>
import { computed } from 'vue'

// 定义字段类型接口
interface columnsType {
  "key": string,
  "dataKey": string,
  "title": string,
  "width"?: number
}
// 定义dataTable类型接口
export interface dataTableType {
  columns: columnsType[],
  data: any[]
}
// 定义Props
const props = defineProps<{
  dataTable: dataTableType
}>()

const columns = computed(() => props.dataTable.columns)
const data = computed(() => props.dataTable.data)

console.log('columns', columns);
console.log('data', data);

</script>

<template>
  <el-auto-resizer>
    <template #default="{ width }">
      <el-table-v2
        header-class="table-header"
        :columns="columns"
        :data="data"
        :width="width"
        :height="580"
        fixed
      />
    </template>
  </el-auto-resizer>

</template>

<style lang="scss" scoped>
:deep(.el-table-v2__header-cell) {
  font-weight: bold;
  color: $color-black;
}
:deep(.el-tabs__header is-top) {
  margin-bottom: 5px;
}
.table-header {
  background: $color-primary;
 
}
</style>