import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/DiaryList.vue'),
  },
  {
    path: '/diary/:id',
    name: 'DiaryDetail',
    component: () => import('../views/DiaryDetail.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
