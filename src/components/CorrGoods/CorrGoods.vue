<script lang="ts" setup>
const tableData = [
  {
    storeCate: '卷烟',
    storeId: '123',
    storeCode: 'D5481244',
    storeUnit: '包',
  },
  {
    storeCate: '电子烟',
    storeId: '456',
    storeCode: 'D5481244',
    storeUnit: '包',
  },
  {
    storeCate: '卷烟',
    storeId: '789',
    storeCode: 'D5481244',
    storeUnit: '包',
  },
]

const sysCodeOptions = [
  {
    value: '10211',
    label:'10211'
  },
  {
    value: '10212',
    label:'10212'
  },
  {
    value: '10213',
    label:'10213'
  },
]
</script>

<template>
  <el-table :data="tableData" style="width: 800px">
    <el-table-column label="抽取商超的信息" >
      <el-table-column prop="storeCate" label="商品类别" width="120"/>
      <el-table-column prop="storeId" label="商品ID" />
      <el-table-column prop="storeCode" label="商品条码" />
      <el-table-column prop="storeUnit" label="商品单位" />
    </el-table-column>
    <el-table-column label="烟草下载的信息" >
      <el-table-column prop="sysCode" label="卷烟编码sys_code">
        <template #default="{row}">
          <el-select v-model="row.sysCode">
            <el-option 
              v-for="item in sysCodeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>

<style lang="scss" scoped>
  
</style>