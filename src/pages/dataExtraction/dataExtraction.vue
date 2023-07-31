<script lang="ts" setup>
import { ref, reactive, toRefs } from 'vue'
import type { TabsPaneContext } from 'element-plus'

const activeTab = ref('one')
const actionBtn = ref('btn1')
const sqlContent = ref('')
const dataTable = reactive({
  columns: [
      {
          "key": "name",
          "dataKey": "name",
          "title": "名称",
          "width": 150
      },
      {
          "key": "age",
          "dataKey": "age",
          "title": "年龄",
          "width": 150
      },
  ],
  data: [
    {
        "id": "row-0",
        "parentId": null,
        "name": "高启强",
        "age": "32",
    }
  ]
})
const { columns, data } = toRefs(dataTable)

const handleTabClick = (tab: TabsPaneContext, event: Event) => {

}
const getBtnType = (name:string) => {
  return actionBtn.value === name ? 'primary' : ''
}
const handleBtnClick = (name: string) => {
  actionBtn.value = name
}



</script>

<template>
  <div class="page-title">
    <h2>数据抽取配置</h2>
  </div>
  <nav class="page-nav">
    <el-button-group>
      <el-button plain :type="getBtnType('btn1')" @click="handleBtnClick('btn1')">门店信息抽取</el-button>
      <el-button plain :type="getBtnType('btn2')" @click="handleBtnClick('btn2')">商品信息抽取</el-button>
      <el-button plain :type="getBtnType('btn3')" @click="handleBtnClick('btn3')">会员信息抽取</el-button>
      <el-button plain :type="getBtnType('btn4')" @click="handleBtnClick('btn4')">零售订单抽取</el-button>
      <el-button plain :type="getBtnType('btn5')" @click="handleBtnClick('btn5')">入库单据抽取</el-button>
      <el-button plain :type="getBtnType('btn6')" @click="handleBtnClick('btn6')">报损单据抽取</el-button>
      <el-button plain :type="getBtnType('btn7')" @click="handleBtnClick('btn7')">其他出入库单据抽取</el-button>
      <el-button plain :type="getBtnType('btn8')" @click="handleBtnClick('btn8')">日结进销存抽取</el-button>
    </el-button-group>
  </nav>
  <div class="page-buttons">
    <el-button type="success">保存</el-button>
    <el-button type="info">取消</el-button>
  </div>
  <div class="page-content">
    <el-tabs v-model="activeTab" class="demo-tabs" @tab-click="handleTabClick">
      <el-tab-pane label="数据源设定" name="one">
        <p class="desc">
          请编写查询脚本,编写完成后可通过
          <el-button type="primary" plain size="small">预览视图</el-button>
          测试脚本会否可用！
        </p>
        <el-input
          v-model="sqlContent"
          :rows="22"
          type="textarea"
          placeholder="Please input"
        />
      </el-tab-pane>
      <el-tab-pane label="数据预览" name="two">
        <el-table-v2
          :columns="columns"
          :data="data"
          :width="1300"
          :height="500"
          fixed
        />
      </el-tab-pane>
      <el-tab-pane label="接口对照" name="three">接口对照</el-tab-pane>
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
  margin-top: 10px;
}
.page-content {

}
</style>
