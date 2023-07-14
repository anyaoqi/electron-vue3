import { createRouter, createWebHistory } from 'vue-router'
import type { Router } from 'vue-router'
import routes from './routes'

// 创建路由
const router:Router = createRouter({
  history: createWebHistory(),
  routes: routes
})

// 路由前置拦截器
router.beforeEach((to, from, next) => {
  // const token = localStorage.getItem('token')
  // 如果token存在 && 当前不是登录页, 就跳转到登录页, 否则正常跳转
  // if(token && from.name!='login') {
  //   next()
  // }
  next()
})

export default router