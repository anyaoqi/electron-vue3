import { createRouter, createWebHashHistory } from 'vue-router'
import type { Router } from 'vue-router'
import routes from './routes'
// import { useLogin } from '@/hooks/login'

// 创建路由
const router:Router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})

// // 路由前置拦截器
router.beforeEach((to, _from, next) => {
  console.log(to);
  console.log(_from);
  // 正常跳转
  next()
})

export default router