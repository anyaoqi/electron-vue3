<script lang="ts" setup>
const tableData = [
  {
    storeId: '1',
    storeName: '门店1',
    licenseCode: '',
  },
  {
    storeId: '2',
    storeName: '门店2',
    licenseCode: '',
  },
  {
    storeId: '3',
    storeName: '门店3',
    licenseCode: '',
  },
]

const licenseOptions = [
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
  <el-table :data="tableData" style="width: 500px">
    <el-table-column label="抽取商超的信息" >
      <el-table-column prop="storeId" label="门店ID" width="120"/>
      <el-table-column prop="storeName" label="门店名称" />
    </el-table-column>
    <el-table-column label="烟草下载的信息" >
      <el-table-column prop="licenseCode" label="烟草许可证号">
        <template #default="{row}">
          <el-select v-model="row.licenseCode">
            <el-option 
              v-for="item in licenseOptions"
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