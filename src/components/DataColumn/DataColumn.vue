<script lang="ts" setup>
const tableData = [
  {
    id: '123456',
    apiColumn: '2016-05-03',
    corColumn: 'Tom',
    defaultValue: 'No. 189, Grove St, Los Angeles',
    desc: '5555',
  },
  {
    id: 'bbb',
    apiColumn: '2016-05-03',
    corColumn: 'Tom',
    defaultValue: 'No. 189, Grove St, Los Angeles',
    desc: 'dddd',
  },
  {
    id: 'ccc',
    apiColumn: '2016-05-03',
    corColumn: 'Tom',
    defaultValue: 'No. 189, Grove St, Los Angeles',
    desc: '3333',
  },
  {
    id: 'dddd',
    apiColumn: '2016-05-03',
    corColumn: 'Tom',
    defaultValue: 'No. 189, Grove St, Los Angeles',
    desc: '2222',
  },
 
]
const columnOptions = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]
</script>

<template>
  <el-button>预览视图</el-button>
  <div class="data-reporting">
    <el-table :data="tableData">
      <el-table-column prop="apiColumn" label="接口字段" width="180">
        <template #default="{ row }">
          {{ row.apiColumn }}
        </template>
      </el-table-column>
      <el-table-column prop="corColumn" label="对应字段" width="180">
        <template #default="{ row }">
          <el-select v-model="row.corColumn" class="m-2" placeholder="Select">
            <el-option
              v-for="item in columnOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="defaultValue" label="默认值">
        <template #default="{ row }">
          <el-input v-model="row.defaultValue"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="描述">
        <template #default="{ row }">
          <el-input v-model="row.desc"></el-input>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss" scoped></style>
