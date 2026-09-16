import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '@/views/HomeView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/addAlarm', component: () => import('@/views/AddAlarmView.vue')}
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router