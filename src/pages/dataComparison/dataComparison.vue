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

<style lang="scss" scoped>
  
</style>