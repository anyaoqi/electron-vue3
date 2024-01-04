<script lang="ts" setup>
import { h } from 'vue'
import type { FunctionalComponent } from 'vue'
import type {
  TableV2CustomizedHeaderSlotParam,
} from 'element-plus'

const columns = [
  {
      "key": "goods-category",
      "dataKey": "goods-category",
      "title": "商品类别",
      "width": 150
  },
  {
      "key": "goods-id",
      "dataKey": "goods-id",
      "title": "商品ID",
      "width": 150
  },
  {
      "key": "goods-barcode",
      "dataKey": "goods-barcode",
      "title": "商品条码",
      "width": 150
  },
  {
      "key": "goods-unit",
      "dataKey": "goods-unit",
      "title": "商品单位",
      "width": 150
  },
  {
      "key": "goods-code",
      "dataKey": "goods-code",
      "title": "卷烟编码",
      "width": 150
  },
]
const data = [
    {
        "id": "row-1",
        "parentId": null,
        "goods-category": "水/饮料",
        "goods-id": "848515",
        "goods-barcode": "748945165165",
        "goods-unit": "瓶",
        "goods-code": "d8454k"
    },
    {
        "id": "row-2",
        "parentId": null,
        "goods-category": "水/汽水",
        "goods-id": "848516",
        "goods-barcode": "748945165166",
        "goods-unit": "瓶",
        "goods-code": "d8454k"
    },
    {
        "id": "row-3",
        "parentId": null,
        "goods-category": "米饭",
        "goods-id": "848518",
        "goods-barcode": "748945165168",
        "goods-unit": "瓶",
        "goods-code": "d845484d"
    },
]

// 自定义组合表头
const CustomizedHeader: FunctionalComponent<
  TableV2CustomizedHeaderSlotParam
> = ({ cells, columns, headerIndex }) => {

  if (headerIndex === 1) return cells

  const groupCells = [] as typeof cells
  let firstColumnWidth = 0
  columns.forEach((_column, columnIndex) => {
    // 计算第一列合计宽度
    if(columnIndex < 4) {
      firstColumnWidth += cells[columnIndex].props!.column.width
    }
  })

  if(headerIndex===0) {
    groupCells.push(
      h(
        'div',
        {
          class: 'custom-header-cell',
          style: {
             width: `${firstColumnWidth}px`,
          },
        },
        ['抽取商超的信息']
      )
    )
    groupCells.push(
      h(
        'div',
        {
          class: 'custom-header-cell',
          style: {
            width: `200px`,
          },
        },
        ['烟草下载的信息']
      )
    )
    return groupCells
  }
}
</script>

<template>
  <el-table-v2
    fixed
    :columns="columns"
    :data="data"
    :header-height="[40, 40]"
    header-class="el-primary-color"
    :width="700"
    :height="400"
  >
    <template #header="props">
      <customized-header v-bind="props" />
    </template>
  </el-table-v2>
</template>

<style lang="scss" scoped>
::v-deep(.el-table-v2__header-row .custom-header-cell) {
  border-right: 1px solid var(--el-border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #eee;
  &:last-child  {
    padding-left: 10px;
    justify-content: start;
  }
}
</style>