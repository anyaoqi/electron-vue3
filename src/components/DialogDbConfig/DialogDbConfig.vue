<script lang="ts" setup>
import { reactive, ref, toRaw } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useHookDialog } from '@/hooks/index'
import type { iDatabaseConfig } from '@/types/databaseType'
import { useDbConfig } from '@/hooks'

const { config, setConfig } = useDbConfig()
const { dialogVisable, setDialogVisable } = useHookDialog()

// 表单Ref对象
const formRef = ref<FormInstance>()

// 表单
const form = reactive<iDatabaseConfig>({
  type: 'mysql',
  user: '',
  password: '',
  host: '',
  port: 3306,
  database: '',
  ...config.value,
})
if(import.meta.env.DEV) {
  form.type = "mysql"
  form.host = "172.50.80.188"
  form.user = "root"
  form.password = "Hsrc@20230612"
  form.port = 3306
  form.database = "tobacco"
}
// 表单校验规则
const formRules = reactive<FormRules<iDatabaseConfig>>({
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
    ElMessage.success('连接成功')
    setDialogVisable(false)
  }).catch((err: any) => {
    ElMessage.error('连接数据库失败:', err)
  })
}

// 提交数据库配置 进行数据库连接
const handleConfirm = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      connectDatabase()
    }
  })
}

// 关闭弹框
const handleCancel = () => {
  setDialogVisable(false)
}
</script>

<template>
   <Teleport to="body">
    <el-dialog 
      v-model="dialogVisable"
      :close-on-click-modal="false"
      title="连接设置"
      width="30%"
    >
      <el-form 
        status-icon
        ref="formRef" 
        label-width="120px"
        :model="form" 
        :rules="formRules" 
        @submit.native.prevent="handleConfirm"
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