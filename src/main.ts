import { createApp } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue' // element-ui 字体图标组件
import "font-awesome/css/font-awesome.min.css"  // 字体图标库
import '@/styles/index.scss' // 公共样式和初始化样式
import App from './App.vue'
import router  from '@/router/index'
import pinia from '@/pinia'

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
