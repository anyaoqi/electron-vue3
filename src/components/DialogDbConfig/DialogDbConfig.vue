<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useHookDialog } from '@/hooks/index'
// 表单Ref对象
const formRef = ref<FormInstance>()
// 表单类型
interface formType  {
  dbType: string
  username: string
  password: string
  host: string
  port: number,
  dbName: string
}
// 表单
const form = reactive<formType>({
  dbType: 'mysql',
  username: '',
  password: '',
  host: '',
  port: 3360,
  dbName: ''
})
// 表单校验规则
const formRules = reactive<FormRules<formType>>({
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

const { dialogVisable, setDialogVisable } = useHookDialog()
// 连接数据库
const handleConfirm = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid, fields) => {
    if (valid) {
      ElMessage.success('连接成功')
      setDialogVisable(false)
    } else {
      console.log('error submit!', fields)
    }
  })
}
// 取消连接
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