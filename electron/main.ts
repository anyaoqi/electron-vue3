import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import initExpressApp from "./server/app.ts"

// 初始化express内置服务
initExpressApp()

process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
// 解决控制台警告
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

function getUserPath() {
  return app.getPath('userData')
}

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
    },
  })
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



app.on('window-all-closed', () => {
  win = null
})

app.whenReady().then(() => {
  ipcMain.handle('getUserPath', getUserPath)
  createWindow()
})
