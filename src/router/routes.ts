import type { RouteRecordRaw } from 'vue-router'

const routes:RouteRecordRaw[] = [
  // 主页
  {
    path: '/',
    name: 'layout',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    children: [
      {
        path:'/home',
        name:'home',
        component: () => import('@/pages/home/home.vue')
      }
    ]
  },
  // 登录页
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/login.vue'),
  },
]

export default routes