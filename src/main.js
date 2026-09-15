import './assets/main.css'
import { initTheme } from './utils/savedTime'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/index'

initTheme()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
