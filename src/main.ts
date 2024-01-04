import { createApp } from 'vue'
import App from './App.vue'
import router  from '@/router'
import pinia from '@/pinia'

// Element-plus
import ElementPlus from 'element-plus'
import locale from "element-plus/lib/locale/lang/zh-cn"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(ElementPlus, {locale})

// element-ui图标：注册全局组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})
