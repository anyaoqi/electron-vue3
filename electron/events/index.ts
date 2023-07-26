
import { ipcRenderer, ipcMain  } from 'electron'
// import events, {  eventType } from './handleEvents';
import commonEvents from './eventElectron'
import databaseEvents from '../database/eventServer'
import sqliteEvents from '../database/sqlite3/events'

export interface eventType {
  [key: string]: (params: any) => any
}


// 获取预加载invoke方法
export function getInvokeEvents(eventObject: eventType) {
  const invokeEvents:eventType = {}
  let keys = Object.keys(eventObject)
  if(keys.length) {
    for (const eventName in eventObject) {
      invokeEvents[eventName] = (params: any) => ipcRenderer.invoke(eventName, params)
    }
  }
  return invokeEvents
}

// 绑定主进程handle方法
export function bindHandleEvents() {
  // 为了防止里面的事件命名冲突被替换，这里没有使用扩展运算符全部合并一个对象里，而是放进数组中单个循环。
  const eventArr:eventType[] = [commonEvents, databaseEvents, sqliteEvents]
  eventArr.forEach(events => {
    for (const eventName in events) {
      ipcMain.handle(eventName, (_event, params) => {
        const fn = events[eventName]
        if(fn && typeof fn==='function') {
          return events[eventName](params)
        } else {
          return '非函数，不可执行'
        }
      })
    }
  })
}