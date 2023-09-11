<script lang="ts" setup>
import { reactive, ref, toRaw, inject } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useHookDialog } from '@/hooks/index'
import type { iDatabase } from '@type/index'
import { useDbConfig } from '@/hooks'
import logger from '@/utils/logger'
// import { useUpload } from '@/hooks/uploadTimer'

const publicConfig:any = inject('config')
const { config, setConfig } = useDbConfig()
const { dialogVisable, setDialogVisable } = useHookDialog()
// const { startUpload, isOpenTimer } = useUpload()

const isConnection = ref(false)

// 表单Ref对象
const formRef = ref<FormInstance>()

// 表单
const form = reactive<iDatabase>(config.value)

if(import.meta.env.DEV || publicConfig.debug === true) {
  form.type = "mysql"
  form.host = "172.50.80.188"
  form.user = "root"
  form.password = "Hsrc@20230612"
  form.port = 3306
  form.database = "tobacco"
}
// 表单校验规则
const formRules = reactive<FormRules<iDatabase>>({
  type: [
    {  required: true, message: '请选择数据库类型', trigger: 'blur' },
  ],
  user: [
    {  required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  password: [
    {  required: true, message: '请输入密码', trigger: 'blur' },
  ],
  host: [
    {  required: true, message: '请输入主机或IP地址', trigger: 'blur' },
  ],
  port: [
    {  required: true, message: '请输入端口号', trigger: 'blur' },
  ],
  database: [
    {  required: true, message: '请输入数据名称', trigger: 'blur' },
  ],
})
// 支持的数据库列表
enum databaseList {
  mysql = "Mysql",
}

// 连接数据库
const connectDatabase = () => {
  // 这里传参需要通过toRaw转换为普通的js对象，reactive对象无法传参
  window.serverAPI.connectDatabase(toRaw(form)).then(() => {
    setConfig(form)
    logger.info('数据库连接成功：'+JSON.stringify(toRaw(form)))
    ElMessage.success('连接成功')
    setDialogVisable(false)
    // !isOpenTimer.value && startUpload()
  }).catch((err: any) => {
    isConnection.value = false
    logger.warn(`数据库连接失败：${err}, \n 数据库配置：${JSON.stringify(toRaw(form))}`)
    ElMessage.error('连接数据库失败:' + err)
  })
}

// 提交数据库配置 进行数据库连接
const handleConfirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, _fields) => {
    if (valid) {
      connectDatabase()
    }
  })
}

// 关闭弹框
const handleCancel = () => {
  setDialogVisable(false)
}

const onDialogOpen = () => {
  console.log('open');
  window.serverAPI.isConnection().then((boo: boolean) => {
    console.log(boo);
    isConnection.value = boo
  })
}
</script>

<template>
   <Teleport to="body">
    <el-dialog 
      v-model="dialogVisable"
      :close-on-click-modal="false"
      width="30%"
      @open="onDialogOpen"
    >
      <template  #header="{}">
        <h2>
          连接设置
          <el-tag v-if="isConnection" class="ml-2" type="success">已连接</el-tag>
          <el-tag v-else class="ml-2" type="info">未连接</el-tag>
        </h2>
      </template>
      <el-form 
        status-icon
        ref="formRef" 
        label-width="120px"
        :model="form" 
        :rules="formRules" 
        @submit.native.prevent="handleConfirm(formRef)"
        >
        <el-form-item label="数据提供者" prop="dbType">
          <el-select v-model="form.type">
            <el-option 
              v-for="(value, key) in databaseList"
              :key="key"
              :value="key"
              :label="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="user">
          <el-input v-model="form.user"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="主机或IP地址" prop="host">
          <el-input v-model="form.host"></el-input>
        </el-form-item>
        <el-form-item label="端口号" prop="port">
          <el-input v-model="form.port"></el-input>
        </el-form-item>
        <el-form-item label="数据库" prop="database">
          <el-input v-model="form.database"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleCancel">取消</el-button>
          <el-button 
            type="primary" 
            native-type="submit" 
            >
            连接
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </Teleport>
</template>

<style lang="scss" scoped>

</style>