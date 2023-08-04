import { app } from 'electron'
import path from 'node:path'
import fs from 'fs'

let openConfig = {
  debug: false
}
// 获取生产环境配置
if(!import.meta.env.DEV){
  const appPath = path.dirname(app.getPath('exe'))
  const openConfigPath = path.join(appPath, '/config.json')
  const prodOpenConfig = fs.existsSync(openConfigPath) ? require(openConfigPath) : {}
  openConfig = prodOpenConfig
}

// 配置项
export default {
  title: "第三方零消数据抽取系统",
  ...openConfig,
}