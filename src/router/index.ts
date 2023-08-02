import { createRouter, createWebHistory } from 'vue-router'
import type { Router } from 'vue-router'
import routes from './routes'
import { useStore } from '@/pinia/index'

// 创建路由
const router:Router = createRouter({
  history: createWebHistory(),
  routes: routes
})

// 路由前置拦截器
router.beforeEach((to, _from, next) => {
  const store = useStore()
  // 未登录 && 要跳转的不是登录页 就跳转到登录页
  if(!store.isLogin && to.path!='/login'){
    next('/login')
    return
  }
  // 正常跳转
  next()
})

export default router