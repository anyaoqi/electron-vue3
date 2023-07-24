import commonEvents from './eventElectron'
import databaseEvents from './eventServer'
import sqliteEvents from './eventSqlite'

export interface handleEventType {
  [key: string]: (event: Electron.IpcMainInvokeEvent, params: any) => void;
}

// 主进程监听方法
const handleEvents: handleEventType  =  {
  ...commonEvents,
  ...databaseEvents,
  ...sqliteEvents,
}

export default handleEvents

