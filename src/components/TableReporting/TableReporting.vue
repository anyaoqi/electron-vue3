<script lang="ts" setup>
const props = defineProps(['data'])
const { data } = props
</script>

<template>
  <div class="table-reporting">
    <el-table :data="data" style="width: 100%;">
      <el-table-column prop="setDate" label="操作日期" ></el-table-column>
      <el-table-column prop="setTime" label="操作时间" ></el-table-column>
      <el-table-column prop="shopName" label="店面名称" ></el-table-column>
      <el-table-column prop="licenCode" label="许可证号" ></el-table-column>
      <el-table-column prop="totalNum" label="总笔数" ></el-table-column>
      <el-table-column prop="successNum" label="成功笔数" ></el-table-column>
      <el-table-column prop="errorNum" label="失败笔数" ></el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
  
</style>