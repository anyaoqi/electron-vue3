import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import '@/styles/common.scss'
import router  from '@/router/index'
import pinia from './store'

const app = createApp(App)
app.use(router)
app.use(pinia)

app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})
