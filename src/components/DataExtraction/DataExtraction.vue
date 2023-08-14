<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import DataSource from '@/components/DataSource/DataSource.vue'
import DataPreview, { dataTableType } from '@/components/DataPreview/DataPreview.vue'
import DataColumn from '@/components/DataColumn/DataColumn.vue'
import { columnType } from '@/types'
import { useData } from '@/hooks/dataExtraction'
import { StoreInfos } from '@/apis'
const { saveData, getSql, getTableData, viewData } = useData()

const props = defineProps<{
  apiFilds: {
    filed: string,
    name: string,
    description: string,
  }[],
  currentExtr: {
    name: string,
    key: string
  }
}>()

// 当前tab标签页
const activeTab = ref('dataSource')

const currentExtr = computed(() => props.currentExtr)
// 数据源
const sqlContent = ref('')
// 数据预览
const dataTable = reactive<dataTableType>({
  columns: [],
  data: []
})

// 接口对照数据
const columnsInfo = reactive({
  columns: [],
  // 接口中传过来的字段
  apiFilds: props.apiFilds,
  tableData: [] as columnType[]
})

// 表格中的数据：格式化接口中的字段
const tableColumns = props.apiFilds.map(filed => {
  return {
    filed: filed.filed,
    name: filed.name,
    filedValue: '',
    defaultValue: '',
    description: filed.description,
  }
})

// 默认数据
columnsInfo.tableData = reactive<columnType[]>(tableColumns)


// Tab切换点击事件
const handleTabClick = (_tab: TabsPaneContext, _event: Event) => {
  console.log(_tab.paneName);
}

const toPrviewData = () => {
  activeTab.value = 'dataPriview'
}
// 预览视图
const previewData = (sql: string) => {
  viewData(sql).then(({ tableData, tableColumns, filedList }: any) => {
    console.log('filedList', filedList);

    dataTable.data = tableData
    dataTable.columns = tableColumns
    columnsInfo.columns  = filedList
    toPrviewData()
  }).catch((err: any) => {
    console.log(err);
    dataTable.columns = []
    dataTable.data = []
  })
}

/**
 * 将数据按照字段映射规则进行转换
 * 根据提供的字段映射规则，将查询数据转换为符合指定接口的上传数据格式。
 * @template T 泛型参数，表示最终转换后的数据项类型
 * @param datas 查询数据数组
 * @param fileds 字段映射规则，包含源字段和目标字段的对应关系
 * @returns 转换后的符合指定接口格式的数据数组
 */
const findFiledValues = <T>(datas: Array<any>, fileds: columnType[]):T[] => {
  // 创建字段映射关系对象
  const mapping: Record<string, string> = {};
  for (const filedData of fileds) {
    mapping[filedData.filed] = filedData.filedValue
  }
  // 根据映射关系将数据转换为目标格式
  const result:T[] = datas.map((data: any) => {
    // 创建一个新对象，根据映射关系赋值
    const newItem: any = {};
    for (const key in mapping) {
      newItem[key] = data[mapping[key]]
    }
    return newItem as T
  })
  return result
}

const startUpload = () => {
  const storeInfos = findFiledValues<StoreInfos>(dataTable.data, columnsInfo.tableData)
  console.log(storeInfos);
}

// 获取之前配置的数据
getTableData(currentExtr.value.key).then(tableData => {
  columnsInfo.tableData = tableData
})

getSql(currentExtr.value.key).then((sql) => {
  sqlContent.value = sql
})

// 保存配置
const saveExtraction = () => {
  saveData({
    englishFlag: currentExtr.value.key,
    englishName: currentExtr.value.name,
    sqlContent: sqlContent.value,
    tableData: columnsInfo.tableData
  })
}
</script>

<template>
  <div class="page-buttons">
    <el-button type="success" @click="saveExtraction">保存</el-button>
    <el-button type="success" @click="startUpload">上传</el-button>
    <el-button type="info">取消</el-button>
  </div>
  <div class="page-content">
    <el-tabs v-model="activeTab" class="demo-tabs" @tab-click="handleTabClick">
      <el-tab-pane label="数据源设定" name="dataSource">
        <DataSource @previewData="previewData" v-model="sqlContent" />
      </el-tab-pane>
      <el-tab-pane label="数据预览" name="dataPriview">
        <DataPreview :dataTable="dataTable" />
      </el-tab-pane>
      <el-tab-pane label="接口对照" name="dataColumn">
        <DataColumn
          :columns="columnsInfo.columns"
          v-model="columnsInfo.tableData"
          @prviewData="toPrviewData"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.page-title {
  h2 {
    margin: 10px 0;
  }
}
.page-nav {
}
.page-buttons {
  position: absolute;
  right: 10px;
  top: 0px;
  z-index: 10;
}
.page-content {
}
</style>
