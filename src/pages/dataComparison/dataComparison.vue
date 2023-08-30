<script lang="ts" setup>
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import CorrStore from '@/components/CorrStore/CorrStore.vue'
import CorrGoods from '@/components/CorrGoods/CorrGoods.vue'

const activeName = ref('first')

const handleClick = (_tab: TabsPaneContext, _event: Event) => {
}

</script>

<template>
   <el-tabs v-model="activeName" class="page-tabs" @tab-click="handleClick">
    <el-tab-pane :lazy="true" label="门店对照配置" name="first">
      <CorrStore />
    </el-tab-pane>
    <el-tab-pane :lazy="true" label="商品对照配置" name="second">
      <CorrGoods />
    </el-tab-pane>
  </el-tabs>
</template>

<style >
  .el-el-table-v2__header-row .custom-header-cell {
  border-right: 1px solid var(--el-border-color);
}

.el-el-table-v2__header-row .custom-header-cell:last-child {
  border-right: none;
}

.el-primary-color {
  background-color: var(--el-color-primary);
  color: var(--el-color-white);
  font-size: 14px;
  font-weight: bold;
}

.el-primary-color .custom-header-cell {
  padding: 0 4px;
}
</style>