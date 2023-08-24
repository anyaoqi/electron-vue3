import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron'
import path from 'node:path'
import { bindHandleEvents } from '@main/events'
import appConfig from '@main/config/app.config'
import { updateHandle } from '@main/versionUpdate'
import { initDatabase, closeDatabase } from '@main/database/index'
import logger from '@main/logger'
import { LoggerLevel } from './types'

process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

// 测试打包
// Object.defineProperty(app, 'isPackaged', {
//   get() {
//     return true;
//   }
// });

// 初始化数据库
initDatabase()

// 是否打开控制台
const openDevTools = import.meta.env.DEV ?  true : appConfig.debug;

let win: BrowserWindow | null
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
// 解决控制台警告
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// 创建主进程窗口
function createWindow() {
  win = new BrowserWindow({
    title: appConfig.title,
    width: 1920,
    height: 1080,
    icon: path.join(process.env.PUBLIC, 'electron-vite.svg'),
    frame: true,
    autoHideMenuBar: true, // 隐藏默认菜单
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
      webviewTag: true, //允许使用 webview
      webSecurity: false, //允许跨域
    },
  })
  // 窗口最大化
  win.maximize();
  win.setMenu(null)
  // 打开控制台
  openDevTools && win.webContents.openDevTools()
  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })
  // 软件升级监听绑定
  updateHandle('http://127.0.0.1:5500',(updateParams) => {
    win?.webContents.send('updateMessage', updateParams)
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }

  // 窗口关闭
  win.on('close', (e) => {
    e.preventDefault()
    // 窗口关闭提示弹框
    win && dialog.showMessageBox(win, {
      type: 'info',
      title: '提示',
      message: '确认退出？',
      buttons: ['确认', '取消'], //选择按钮，点击确认则下面的idx为0，取消为1
      cancelId: 1, //这个的值是如果直接把提示框×掉返回的值，这里设置成和“取消”按钮一样的值，下面的idx也会是1
    }).then((idx) => {
      if(idx.response != 1) {
        console.log('确认关闭程序');
        // 关闭所有数据库连接
        closeDatabase()
        // 停止数据抽取
        win && win.webContents.send('appClose')
        // app.exit()
      } // 取消关闭
    })
  })
}
// 禁用默认菜单
Menu.setApplicationMenu(null)

app.on('before-quit', () => {
})
// 当所有的窗口都被关闭时触发
app.on('window-all-closed', () => {
  win = null
})

ipcMain.handle('getConfig', () => appConfig)
ipcMain.handle('getLogger', (_event, level: LoggerLevel, content: string) => {
  logger[level](content)
})

// 当Electron 初始化完成
app.whenReady().then(() => {
  // 监听渲染进程的关闭消息
  ipcMain.on('appClose', (_event) => {
    app.exit()
  })
  // 创建主窗口
  createWindow()
  // 绑定进程间通信事件
  bindHandleEvents()
})
