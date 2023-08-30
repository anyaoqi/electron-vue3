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
import { useUpload, useDataSync } from '@/hooks/uploadTimer'

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(ElementPlus, {locale})

// 获取全局配置 通过provide提供到全局，使用的时候通过Inject注入
window.electronAPI.getConfig().then((config: any) => {
  // 提供全局config配置对象
  app.provide('config', config)
})
// 监听程序关闭
window.electronAPI.appClose((event:any) => {
  const { isOpenTimer, stopUpload } = useUpload()
   // 数据同步
   const { isSyncTimer, syncTimerStop } = useDataSync()
  // 停止数据抽取
  isOpenTimer.value && stopUpload()
  // 停止数据同步
  isSyncTimer.value && syncTimerStop()
  // 关闭程序
  event.sender.send('appClose')
})

// element-ui图标：注册全局组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})
