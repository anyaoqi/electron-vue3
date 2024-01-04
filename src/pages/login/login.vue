<script lang="ts" setup>
import { ref, reactive, onMounted, toRaw } from 'vue'
import { useLoading } from '@/hooks'
import { useLogin } from '@/hooks/login'
// import { useDataSync } from '@/hooks/uploadTimer'
import type { FormInstance, FormRules } from 'element-plus'
import { iLoginForm, iLicence } from '@type/index'
import { useLicence } from '@/hooks/user'
// import { checkUpdate } from '@/utils/autoUpdater'
import logger from '@/utils/logger'
import { getConfig } from '@/utils'

const ruleFormRef = ref<FormInstance>()

// hooks
const {  loading, setLoading } = useLoading()
// const { syncStoreData, syncGoodsData, syncGoodsUnit } = useDataSync()
const { handleLogin } = useLogin()
const { setLicence } = useLicence()

// 引入全局配置
const config = getConfig()
// 登录表单
const loginForm = reactive<iLoginForm>({
  username: '',
  password: ''
})
// 记住密码
const remePassword = ref(false)

const title:string = config.title

const rules = reactive<FormRules<iLoginForm>>({
  username: [
    {  required: true, trigger: 'blur',  message: '请输入烟草许可证号' },
  ],
})

const accountStore = localStorage.getItem('rememberPassWord')
// 恢复之前记住的密码
if(accountStore) {
  let account:iLoginForm = JSON.parse(accountStore)
  loginForm.username = account.username
  remePassword.value = true
}

onMounted(() => {
  // checkUpdate()
})

// 登录
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  !remePassword.value && localStorage.removeItem('rememberPassWord')

  await formEl.validate(async (valid, _fields) => {
    if(!valid) return

    setLoading(true)

    try {
        setLicence({ license_code: loginForm.username } as iLicence)

        loading.value.setText('登录中...')
        // 判断是否记住密码
        if(remePassword.value) {
          const accountStr = JSON.stringify(toRaw(loginForm))
          localStorage.setItem('rememberPassWord', accountStr)
        }

        // 登录操作
        handleLogin()
        ElMessage({
          message: '登录成功！',
          type: 'success'
        })
        logger.info('登录成功，用户：'+loginForm.username)
    } catch (err) {
      setLoading(false)
      ElMessage({
        message: ''+err,
        type: 'warning'
      })
      logger.error('登录失败：'+err+' \n '+JSON.stringify(toRaw(loginForm)))
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
        <el-form-item label="许可证号" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入烟草许可证号"></el-input>
        </el-form-item>
        <!-- <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item> -->
        <el-form-item>
          <div>
            <el-checkbox label="记住许可证号" v-model="remePassword"/>
          </div>
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
  background: url('../../assets/images/background.jpg');
  background-size: 100% 100%;
}
.login-form-wrapper {
  position: absolute;
  top: 50%;
  left: 73%;
  transform: translate(-50%, -50%);
  width: 380px;
  padding: 30px 30px 30px 15px;
  background-color: $color-white;;
  border: 1px solid #ccc;
  border-radius: 6px;
  // box-shadow: 10px 10px 0px 0px #79bbff;
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