
import { ipcRenderer, ipcMain  } from 'electron'
import events, { handleEventType } from './handleEvents';

export interface invokeEventType {
  [key: string]: (params: any) => void
}

// 获取预加载invoke方法
export function getInvokeEvents(eventObject: handleEventType) {
  const invokeEvents:invokeEventType = {}
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
  for (const eventName in events) {
    ipcMain.handle(eventName, events[eventName])
  }
}