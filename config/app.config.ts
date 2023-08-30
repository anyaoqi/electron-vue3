import { app } from 'electron'
import path from 'node:path'
import fs from 'fs'
import publicConfig from './public.config.json'

// App配置项
let config = {
  ...publicConfig,
  debug: import.meta.env.DEV
}

// 生产环境配置
if(import.meta.env.PROD){
  // 获取外部配置文件
  const appPath = path.dirname(app.getPath('exe'))
  const openConfigPath = path.join(appPath, '/config.json')
  const prodOpenConfig = fs.existsSync(openConfigPath) ? require(openConfigPath) : {}
  Object.assign(config, prodOpenConfig)
}

// 配置项
export default config