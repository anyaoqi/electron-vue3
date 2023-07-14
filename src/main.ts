import { createApp } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/styles/style.scss'
import '@/styles/common.scss'
import App from './App.vue'
import router  from '@/router/index'
import pinia from '@/store'



const app = createApp(App)
app.use(router)
app.use(pinia)

// element-ui图标：注册全局组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})
