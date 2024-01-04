import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { initDatabase, closeDatabase } from './database/index'
import path from 'node:path'
import logger, { deleteHistoryLog } from './logger'
import $config from '../config/config.json'

process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

// 是否打开控制台
let openDevTools = import.meta.env.DEV;

let win: BrowserWindow | null
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
// 解决控制台警告
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// 创建主进程窗口
function createWindow() {
  win = new BrowserWindow({
    title: $config.title,
    width: 1920,
    height: 1080,
    frame: true,
    icon: path.join(process.env.PUBLIC, 'electron-vite.svg'),
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
      message: '请确认是否关闭？',
      buttons: ['确认', '取消'],
      cancelId: 1,
    }).then((idx) => {
      if(idx.response != 1) {
        // 关闭所有数据库连接
        closeDatabase()
        app.exit()
      }
    })
  })
}

// 当所有的窗口都被关闭时触发
app.on('window-all-closed', () => {
  win = null
})

// 主进程和渲染进程通信
// 日志记录
type LoggerLevel  = 'info'|'warn'|'error'|'debug'|'verbose'|'silly'
ipcMain.handle('logger', (_event, level: LoggerLevel, content: string) => {
  logger[level](content)
})

// 当Electron 初始化完成
app.whenReady().then(() => {
  // 初始化数据库
  initDatabase()
  // 删除历史日志
  deleteHistoryLog()
  // 创建主窗口
  createWindow()
})
