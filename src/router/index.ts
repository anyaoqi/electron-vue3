import { createRouter, createWebHashHistory } from 'vue-router'
import type { Router } from 'vue-router'
import routes from './routes'

// 创建路由
const router:Router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})

// 路由前置拦截器
router.beforeEach((_to, _from, next) => {
  next()
})

export default router