import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import { bindHandleEvents } from './events'

process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
// 解决控制台警告
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// 创建主进程窗口
function createWindow() {
  win = new BrowserWindow({
    title:"商超数据系统",
    width: 1920,
    height: 1080,
    icon: path.join(process.env.PUBLIC, 'electron-vite.svg'),
    frame: true,
    autoHideMenuBar: true,
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
  // 打开控制台
  win.webContents.openDevTools()
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
}

// 当所有的窗口都被关闭时触发
app.on('window-all-closed', () => {
  win = null
})

// 当Electron 初始化完成
app.whenReady().then(() => {
  // 绑定进程间通信事件
  bindHandleEvents()
  // 创建主窗口
  createWindow()
})
