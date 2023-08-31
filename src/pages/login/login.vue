<script lang="ts" setup>
import { ref, reactive, inject, onMounted } from 'vue'
import { useLoading } from '@/hooks'
import { useLogin } from '@/hooks/login'
import { useDataSync } from '@/hooks/uploadTimer'
import type { FormInstance, FormRules } from 'element-plus'
import { iLoginForm } from '@type/index'
import { checkUpdate } from '@/utils/autoUpdater'
import logger from '@/utils/logger'

const ruleFormRef = ref<FormInstance>()

// hooks
const {  loading, setLoading } = useLoading()
const { syncStoreData, syncGoodsData } = useDataSync()
const { handleLogin, licenceLogin } = useLogin()

// 引入全局配置
const config:any = inject('config')
console.log('config', config);

// 登录表单
const loginForm = reactive<iLoginForm>({
  username: '',
  password: '',
})

const title:string = config.title

const rules = reactive<FormRules<iLoginForm>>({
  username: [
    {  required: true, trigger: 'blur',  message: '请输入烟草许可证号' },
  ],
  password: [
    { required: true, trigger: 'blur',  message: '请输入密码' },
    { min: 6, message: '密码不能少于6位', trigger: 'blur' },
  ],
})

if(import.meta.env.DEV) {
  loginForm.username = '431001105361'
  loginForm.password = '1357452o268yzas'
}

onMounted(() => {
  checkUpdate()
})

// 登录
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
 
  await formEl.validate(async (valid, _fields) => {
    if(!valid) return
    console.log('valid', valid);

    setLoading(true)

    try {
      const loginRes = await licenceLogin(loginForm)
      console.log('loginRes', loginRes);
      if(loginRes.success === true) {
        loading.value.setText('开始同步数据')

        // 同步门店数据
        await syncStoreData((index, total) => {
          loading.value.setText(`门店数据同步中 ${index}/${total}`)
        })
        // 同步商品数据
        await syncGoodsData((index, total) => {
          loading.value.setText(`商品数据同步中 ${index}/${total}`)
        })

        loading.value.setText('登录中...')
        // 登录操作
        handleLogin()
        ElMessage({
          message: '登录成功！',
          type: 'success'
        })
        logger.info('登录成功，用户：'+loginForm.username)
      } else {
        setLoading(false)
        ElMessage({
          message: '登录失败：'+loginRes.error,
          type: 'error'
        })
      }
    } catch (err) {
      setLoading(false)
      ElMessage({
        message: ''+err,
        type: 'warning'
      })
      logger.info('登录失败，用户：'+loginForm.username)
    }
  })
}
</script>

<template>
  <div class="page-login">
    <div class="login-form-wrapper">
      <h2 class="title">{{ title }}</h2>
      <el-form 
        ref="ruleFormRef"
        :model="loginForm"
        :rules="rules"
        label-width="80px"
        @submit.prevent.default="onSubmit(ruleFormRef)"
        >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入烟草许可证号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="login-button">
            <el-button class="button" type="primary" size="large" native-type="submit" >登 录</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-login {
  width: 100vw;
  height: 100vh;
  background-color: $color-primary;
}
.login-form-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  padding: 30px 30px 30px 15px;
  background-color: $color-white;;
  border: 1px solid #ccc;
  border-radius: 6px;
  .title {
    text-align: center;
  }
  .login-button {
    width: 100%;
    // margin-left: 80px;
    .button {
      width: 100%;
      font-size: 16px;
    }
  }
}
</style>