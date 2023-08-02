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

// 获取全局配置 通过provide注入到全局，使用的时候通过Inject引入
window.electronAPI.getConfig().then((config: object) => {
  console.log('注册全局配置', config);
  app.provide('config', config)
})
// element-ui图标：注册全局组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})
