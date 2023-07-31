import type { RouteRecordRaw } from 'vue-router'

const routes:RouteRecordRaw[] = [
  // 主页
  {
    path: '/',
    name: 'layout',
    component: () => import('@/layout/index.vue'),
    redirect: '/dataExtraction',
    children: [
      // 数据抽取
      {
        path:'/dataExtraction',
        name:'dataExtraction',
        component: () => import('@/pages/dataExtraction/dataExtraction.vue')
      },
      // 数据对照
      {
        path:'/dataComparison',
        name:'dataComparison',
        component: () => import('@/pages/dataComparison/dataComparison.vue')
      },
      // 数据上报查询
      {
        path:'/dataReporting',
        name:'dataReporting',
        component: () => import('@/pages/dataReporting/dataReporting.vue')
      },
    ]
  },
  {
    path: '/:catchAll(.*)',
    name: '404',
    component: () => import('@/pages/404/404.vue')
  },
  // 登录页
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/login.vue'),
  },
]

export default routes