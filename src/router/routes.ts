import type { RouteRecordRaw } from 'vue-router'

const routes:RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/pages/home.vue'),
  },
]

export default routes