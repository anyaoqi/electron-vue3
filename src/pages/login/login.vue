<script lang="ts" setup>
import { reactive, toRefs, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/pinia/index'

const config:any = inject('config')
const router = useRouter()
const store = useStore()
const loginForm = reactive({
  username: '',
  password: '',
})

const title:string = config.title

const onSubmit = () => {
  const { username, password } = toRefs(loginForm)
  if(username.value && password.value){
    ElMessage({
      message: '登录成功！',
      type: 'success'
    })
    store.setLogin(true)
    router.push('/')
  }
}
</script>

<template>
  <div class="page-login">
    <div class="login-form-wrapper">
      <h2 class="title">{{ title }}</h2>
      <p>appPath:{{ config.appPath }}</p>
      <p>openConfigPath:{{ config.openConfigPath }}</p>
      <p>{{ config.openDevTools }}</p>
      <el-form :loginForm="loginForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="login-button">
            <el-button type="primary" @click="onSubmit">登录</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-form-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  padding: 30px 30px 30px 15px;
  // background-color: #409eff;
  border: 1px solid #ccc;
  border-radius: 6px;
  .title {
    text-align: center;
  }
  .login-button {
    width: 100%;
    margin-left: 80px;
  }
}
</style>