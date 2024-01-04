<script lang="tsx" setup>
import { reactive, toRefs } from "vue";
import { FieldsNotbGoods, GoodsCompType, GoodsListType } from "@type/index";
import { useData } from "@/hooks/dataExtraction";
import { findFiledValues } from "@/utils";
import { ElOption, ElSelect } from "element-plus";
import type { FunctionalComponent } from "vue";
import type { Column,TableV2CustomizedHeaderSlotParam } from "element-plus";
import { useLoading } from '@/hooks/index'

const { setLoading } = useLoading()
// 页面主要数据
const data = reactive({
  // 商超卷烟数据
  tableData: [] as GoodsCompType[],
  // 服务器卷烟数据
  sysCodeOptions: [] as GoodsListType[],
});
const { tableData, sysCodeOptions } = toRefs(data);
const { getExtrSqlData, getTableData, viewData } = useData();

// 获取同步商品列表
setLoading(true, '获取商品编码中...')
window.sqliteAPI.getGoodsList().then(async (res: any) => {
  console.log('getGoodsList', res);
  data.sysCodeOptions = res;
  setLoading(false)
}).catch(() => {
  setLoading(false)
});

// 获取商超抽取的卷烟数据
getExtrSqlData("tb_goods").then(async (extrData) => {
  const sql = extrData.sql
  if (!sql) {
    ElMessage.warning("请先配置卷烟商品抽取信息");
    return;
  }
  setLoading(true, '数据获取中...')
  // 获取远程商品抽取数据
  const { tableData: queryData }: any = await viewData(sql);
  if (!queryData) return;
  const columnsData = await getTableData("tb_goods");

  // 拼装接口字段数据
  let storeInfos = findFiledValues<FieldsNotbGoods>(queryData, columnsData);
  // 获取已保存的商品对照配置
  const goodsComplist: Array<GoodsCompType> = await window.sqliteAPI.getGoodsComp();
  // 筛选一品多码卷烟
  const tmpArr = storeInfos;
  const newArr: FieldsNotbGoods[] = [];
  console.log('storeInfos', storeInfos);
  storeInfos.forEach((itme, index) => {
    if(itme.bitcode) {
      const findItem = tmpArr.find((tmp,i) => tmp.bitcode === itme.bitcode && index !== i)
      findItem && newArr.push(findItem);
    }
  });

  data.tableData = newArr.map((item: any) => {
    const findData = goodsComplist.find((d) => d.goods_id == item.goods_isn);
    let newRow = {} as GoodsCompType;
    if (findData) {
      newRow = findData;
    } else {
      newRow = {
        goods_id: item.goods_id,
        goods_category: item.goods_category,
        goods_code: item.bitcode,
        goods_unit: item.unitname,
        code_value: item.goods_code,
      };
    }
    return newRow;
  });
  console.log('data.tableData', data.tableData);
  
  setLoading(false)
}).catch(() => {
  setLoading(false)
});

// 更改卷烟编码 保存配置
const selectChange = (row: any) => {
  const { goods_id, goods_category, goods_code, goods_unit, code_value } = row;
  if (code_value) {
    window.sqliteAPI
      .saveGoodsComp({
        goods_id,
        goods_category,
        goods_code,
        goods_unit,
        code_value,
      })
      .then((res: any) => {
        console.log(res);
      });
  }
};

// 表格列数据
const columns:Column<any>[]  = [
  {
    key: "goods_category",
    dataKey: "goods_category",
    title: "商品类别",
    width: 150,
  },
  {
    key: "goods_id",
    dataKey: "goods_id",
    title: "商品ID",
    width: 150,
  },
  {
    key: "goods_code",
    dataKey: "goods_code",
    title: "商品条码",
    width: 150,
  },
  {
    key: "goods_unit",
    dataKey: "goods_unit",
    title: "商品单位",
    width: 150,
  },
  {
    key: "code_value",
    dataKey: "code_value",
    title: "卷烟编码",
    width: 150,
    cellRenderer: ({ rowData: row }) => (
      <ElSelect model-value={row.code_value} onChange={() => selectChange(row)} >
        {
          sysCodeOptions.value.map((item: any) => (
            <ElOption
                value={item.product_code}
                key={item.product_code}
                label={item.product_code}
            />
          ))
        }
      </ElSelect>
    ),
  },
];

// 自定义表头
const CustomizedHeader: FunctionalComponent<
  TableV2CustomizedHeaderSlotParam
> = ({ cells, columns, headerIndex }) => {
  if (headerIndex === 1) return cells;

  let groupCells = [] as typeof cells;
  let firstColumnWidth = 0;

  columns.forEach((_column, columnIndex) => {
    // 计算第一列合计宽度
    if (columnIndex < 4) {
      firstColumnWidth += cells[columnIndex].props!.column.width;
    }
  });

  if (headerIndex === 0) {
    groupCells = [
      <div class={'custom-header-cell'} style={{width: `${firstColumnWidth}px`}}>
        抽取商超的信息
      </div>,
      <div class={'custom-header-cell'} style={{width: `200px`}}>
        烟草下载的信息
      </div>
    ];
    return groupCells;
  }
};

// 表头Class
const headerClass = (header: any) => header.headerIndex === 0 ? "el-primary-color" : "";
</script>

<template>
  <el-table-v2
    fixed
    :columns="columns"
    :data="tableData"
    :header-height="[40, 40]"
    :header-class="headerClass"
    :width="800"
    :height="600"
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
  &:last-child {
    padding-left: 10px;
    justify-content: start;
  }
}
</style>
