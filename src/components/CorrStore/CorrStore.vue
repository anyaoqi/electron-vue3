<script lang="ts" setup>
import { reactive, toRefs } from 'vue'
import { FieldsStore, StoreCompType, LicenseOptionType } from '@/types'
import { useData } from "@/hooks/dataExtraction";
import { findFiledValues } from "@/utils";

const data = reactive({
  tableData: [] as StoreCompType[],
  licenseOptions: [] as LicenseOptionType[]
})
const { tableData, licenseOptions } = toRefs(data)

const { getSql, getTableData, viewData } = useData();
// 获取许可证号列表
window.sqliteAPI.getStoreList().then(async (res: any) => {
  data.licenseOptions = res
})

// 获取抽取sql语句
getSql('store').then(async (sql: string) => {
  if(!sql){
    ElMessage.warning('请先配置门店抽取信息')
    return
  }
  // 获取远程门店抽取数据
  const { tableData: queryData }:any = await viewData(sql)
  if(!queryData) return

  const columnsData = await getTableData('store');
  // 拼装接口字段数据
  const storeInfos = findFiledValues<FieldsStore>(queryData, columnsData);

  // 获取已保存的许可证配置
  const storeComplist:Array<StoreCompType> = await window.sqliteAPI.getStoreComp()
  data.tableData = storeInfos.map((item: any) => {
    const findStore = storeComplist.find(d => d.store_id == item.store_id)
    let rowStore = {} as StoreCompType
    if(findStore) {
      rowStore = findStore
    } else {
      rowStore = {
        store_name: item.cust_name,
        store_id: item.store_id,
        license_code: item.license_code
      }
    }
    return rowStore
  })
})

// 更改许可证号配置
const selectChange = (row: any) => {
  const { license_code, store_id, store_name  } = row
  if(license_code) {
    window.sqliteAPI.saveStoreComp({
      store_id,
      store_name,
      license_code
    }).then((res: any) => {
      console.log(res);
    })
  }
}
</script>

<template>
  <el-table :data="tableData" style="width: 500px">
    <el-table-column label="抽取商超的信息" >
      <el-table-column prop="store_id" label="门店ID" width="120"/>
      <el-table-column prop="store_name" label="门店名称" />
    </el-table-column>
    <el-table-column label="烟草下载的信息" >
      <el-table-column prop="licenseCode" label="烟草许可证号">
        <template #default="{row}">
          <el-select v-model="row.license_code" @change="selectChange(row)">
            <el-option 
              v-for="item in licenseOptions"
              :key="item.license_code"
              :label="item.license_code"
              :value="item.license_code"
            />
          </el-select>
        </template>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>

<style lang="scss" scoped>

</style>