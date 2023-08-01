<script lang="ts" setup>
import { reactive, toRefs } from 'vue'

const dataTable = reactive({
  columns: [
      {
          "key": "name",
          "dataKey": "name",
          "title": "名称",
          "width": 150
      },
      {
          "key": "age",
          "dataKey": "age",
          "title": "年龄",
          "width": 150
      },
  ],
  data: [
    {
        "id": "row-0",
        "parentId": null,
        "name": "高启强",
        "age": "32",
    }
  ]
})
const { columns, data } = toRefs(dataTable)
</script>

<template>
  <el-table-v2
    :columns="columns"
    :data="data"
    :width="1300"
    :height="500"
    fixed
  />
</template>

<style lang="scss" scoped>
  
</style>