<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps(['data', 'pagination', 'shopName'])
const emit = defineEmits(['pageChange'])

const data = computed(() => props.data)
const pagination = computed(() => props.pagination)
const shopName = computed(() => props.shopName)

const pageChange = (index: number) => {
  emit('pageChange', index)
}
</script>

<template>
  <div class="table-reporting">
    <el-table :data="data" class="table" >
      <el-table-column prop="upload_date" label="操作日期" ></el-table-column>
      <el-table-column prop="shopName" label="店面名称" >
        <template #default="{}">
          {{ shopName }}
        </template>
      </el-table-column>
      <el-table-column prop="license_code" label="许可证号" ></el-table-column>
      <el-table-column prop="totalNum" label="总笔数" >
        <template #default="{row}">
          {{ row.batch_success_num + row.batch_fail_num }}
        </template>
      </el-table-column>
      <el-table-column prop="batch_success_num" label="成功笔数" ></el-table-column>
      <el-table-column prop="batch_fail_num" label="失败笔数" ></el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        :page-size="pagination.pageSize"
        layout="prev, pager, next"
        :total="pagination.total"
        @current-change="pageChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: center;
}
.table-reporting {
  .table {
    width: 100%; height: 500px; overflow: auto;
  }
}
</style>