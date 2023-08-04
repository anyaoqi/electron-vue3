import { createApp } from 'vue'
import "font-awesome/css/font-awesome.min.css"  // 字体图标库
import '@/styles/index.scss' // 公共样式和初始化样式
import App from './App.vue'
import router  from '@/router/index'
import pinia from '@/pinia'
// Element-plus
import ElementPlus from 'element-plus'
import locale from "element-plus/lib/locale/lang/zh-cn"
import * as ElementPlusIconsVue from '@element-plus/icons-vue' // element-ui 字体图标组件
import 'element-plus/dist/index.css' // 这个路径跟官网给的不一样，根据实际安装路径填写

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(ElementPlus, {locale})

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
