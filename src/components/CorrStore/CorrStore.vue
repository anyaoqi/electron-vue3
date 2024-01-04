<script lang="ts" setup>
import { reactive, toRefs } from 'vue'
import { FieldsStore, StoreCompType, LicenseOptionType } from '@type/index'
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
  console.log('licenseOptions', res);
  if(res && res.length) {
    data.licenseOptions = res
  }
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

 
  const storeComplist:Array<StoreCompType> = await window.sqliteAPI.getStoreComp()
  data.tableData = storeInfos.map((item) => {
     // 获取已保存的许可证配置
    let findStore = storeComplist.find(d => d.store_id == item.store_id)
    let rowStore = {} as StoreCompType
    rowStore.store_name = item.cust_name
    rowStore.store_id = item.store_id
    if(findStore) {
      rowStore = findStore
    }

    // 从烟草数据中进行自动匹配对应数据
    if(data.licenseOptions && data.licenseOptions.length) {
      let ycFindStore = data.licenseOptions.find(d => d.license_code == item.license_code)
      if(ycFindStore) {
        const { customer_id = "",cust_code = "",cust_name = "", license_code = "" } = ycFindStore
        rowStore.cust_uuid = customer_id
        rowStore.cust_code = cust_code
        rowStore.cust_name = cust_name
        rowStore.license_code = license_code
        // 将匹配到的数据自保存到对照关系表中
        window.sqliteAPI.saveStoreComp({
          store_id:item.store_id,
          store_name:item.cust_name,
          cust_uuid:customer_id,
          cust_code:cust_code,
          cust_name:cust_name,
          license_code: license_code,
        }).then((res: any) => {
          console.log(res);
        })
      }
    }
    return rowStore
  })
})

// 更改许可证号配置
const selectChange = (licenseCode: string, row: any) => {
  const findStore = licenseOptions.value.find(item => item.license_code === licenseCode)
  const { license_code, store_id, store_name  } = row

  if(!findStore) return
  const { customer_id, cust_name, cust_code } = findStore

  window.sqliteAPI.saveStoreComp({
    store_id,
    store_name,
    customer_id,
    cust_code,
    cust_name,
    license_code: licenseCode||license_code,
  }).then((res: any) => {
    console.log(res);
  })
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
          <el-select v-model="row.license_code" @change="selectChange($event, row)">
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