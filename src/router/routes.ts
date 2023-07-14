import type { RouteRecordRaw } from 'vue-router'

const routes:RouteRecordRaw[] = [
  // 主页
  {
    path: '/',
    name: 'layout',
    component: () => import('@/layout/index.vue'),
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
  {
    path: '*',
    name: '404',
    component: () => import('@/pages/404/404.vue'),
  },
]

export default routes