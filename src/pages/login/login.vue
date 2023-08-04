<script lang="ts" setup>
import { ref, reactive, inject } from 'vue'
import { useLoading } from '@/hooks'
import { useLogin } from '@/hooks/login'
import type { FormInstance, FormRules } from 'element-plus'
import { iLoginForm } from '@/types'

const ruleFormRef = ref<FormInstance>()

const { setLoading } = useLoading()

// 引入全局配置
const config:any = inject('config')

// 登录表单
const loginForm = reactive<iLoginForm>({
  username: '',
  password: '',
})

if(import.meta.env.DEV) {
  loginForm.username = '431001105361'
  loginForm.password = '1357452o268yzas'
}

const title:string = config.title

const { handleLogin, licenceLogin } = useLogin()

const rules = reactive<FormRules<iLoginForm>>({
  username: [
    {  required: true, trigger: 'blur',  message: '请输入烟草许可证号' },
  ],
  password: [
    { required: true, trigger: 'blur',  message: '请输入密码' },
    { min: 6, message: '密码不能少于6位', trigger: 'blur' },
  ],
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
      handleLogin()

      ElMessage({
        message: '登录成功！',
        type: 'success'
      })
    } catch (err) {
      ElMessage({
        message: ''+err,
        type: 'warning'
      })
      setLoading(false)
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