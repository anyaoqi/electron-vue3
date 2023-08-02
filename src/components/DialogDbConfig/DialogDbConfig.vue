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
  dbType: 'mysql',
  username: '',
  password: '',
  host: '',
  port: 3360,
  dbName: '',
  ...config.value,
})
// 表单校验规则
const formRules = reactive<FormRules<iDatabaseConfig>>({
  dbType: [
    {  required: true, message: '请选择数据库类型', trigger: 'blur' },
  ],
  username: [
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
  dbName: [
    {  required: true, message: '请输入数据名称', trigger: 'blur' },
  ],
})
// 数据库类型
const dbTypeList = [
  {
    label: 'Mysql',
    value: 'mysql'
  }
]

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
    <el-dialog v-model="dialogVisable"
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
          <el-select v-model="form.dbType">
            <el-option 
              v-for="dbType in dbTypeList"
              :key="dbType.value"
              :label="dbType.label"
              :value="dbType.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
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
        <el-form-item label="数据库" prop="dbName">
          <el-input v-model="form.dbName"></el-input>
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