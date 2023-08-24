<script lang="ts" setup>
import { reactive, toRefs } from 'vue'
import { FieldsNotbGoods, GoodsCompType, GoodsListType } from '@/types'
import { useData } from "@/hooks/dataExtraction";
import { findFiledValues } from "@/utils";

const data = reactive({
  tableData: [] as GoodsCompType[],
  sysCodeOptions: [] as GoodsListType[]
})
const { tableData, sysCodeOptions } = toRefs(data)

const { getSql, getTableData, viewData } = useData();
// 获取同步商品列表
window.sqliteAPI.getGoodsList().then(async (res: any) => {
  console.log('getGoodsList',res);
  data.sysCodeOptions = res
})


getSql('notb_goods').then(async (sql: string) => {
  if(!sql){
    ElMessage.warning('请先配置非烟商品抽取信息')
    return
  }
  // 获取远程商品抽取数据
  const { tableData: queryData }:any = await viewData(sql)
  if(!queryData) return

  const columnsData = await getTableData('notb_goods');
  console.log(columnsData);
  
  // 拼装接口字段数据
  const storeInfos = findFiledValues<FieldsNotbGoods>(queryData, columnsData);
  console.log('storeInfos', storeInfos);
  
  // 获取已保存的商品对照配置
  const goodsComplist:Array<GoodsCompType> = await window.sqliteAPI.getGoodsComp()
  // console.log('goodsComplist', goodsComplist);
  
  data.tableData = storeInfos.map((item: any) => {
    
    const findData = goodsComplist.find(d => d.goods_id == item.goods_isn)
    let newRow = {} as GoodsCompType
    if(findData) {
      newRow = findData
    } else {
      const goods_category = item.second_cust_category_code||item.first_cust_category_code
      newRow = {
        goods_id: item.goods_isn,
        goods_category: goods_category,
        goods_code: item.bitcode,
        goods_unit: item.unitname,
        code_value: item.goods_code
      }
    }
    return newRow
  })
})

// 更改卷烟编码 保存配置
const selectChange = (row: any) => {
  const { goods_id, goods_category, goods_code, goods_unit, code_value  } = row
  if(code_value) {
    window.sqliteAPI.saveGoodsComp({
      goods_id,
      goods_category,
      goods_code,
      goods_unit,
      code_value,
    }).then((res: any) => {
      console.log(res);
    })
  }
}
</script>

<template>
  <el-table :data="tableData" style="width: 800px">
    <el-table-column label="抽取商超的信息" >
      <el-table-column prop="goods_category" label="商品类别" />
      <el-table-column prop="goods_id" label="商品ID" />
      <el-table-column prop="goods_code" label="商品条码" />
      <el-table-column prop="goods_unit" label="商品单位" />
    </el-table-column>
    <el-table-column label="烟草下载的信息" >
      <el-table-column prop="sysCode" label="卷烟编码sys_code">
        <template #default="{row}">
          <el-select v-model="row.code_value" @change="selectChange(row)">
            <el-option 
              v-for="item in sysCodeOptions"
              :key="item.goods_code"
              :label="item.goods_code"
              :value="item.goods_code"
            />
          </el-select>
        </template>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>

<style lang="scss" scoped>
  
</style>