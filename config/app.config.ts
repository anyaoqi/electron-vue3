import { app } from 'electron'
import path from 'node:path'
import fs from 'fs'
import defaultConfig from './config.json'

// App配置项
let config = {
  ...defaultConfig,
  debug: import.meta.env.DEV,
}

// 生产环境配置
if(import.meta.env.PROD){
  // 获取外部配置文件
  const appPath = path.dirname(app.getPath('exe'))
  const prodConfigPath = path.join(appPath, '/config.json')
  const fsExists = fs.existsSync(prodConfigPath)
  let prodConfig = {}
  try {
    prodConfig = fsExists ? require(prodConfigPath) : {}
  } catch (error) {
    prodConfig = {}
  }
  Object.assign(config, prodConfig, { debug: fsExists })
}

// 配置项
export default config