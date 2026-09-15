import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import AddAlarmView from '@/views/AddAlarmView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/addAlarm', component: AddAlarmView}
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router