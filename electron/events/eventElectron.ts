const { app }  = require('electron')
import { onAutoUpdater, updaterEventsName } from '../versionUpdate'
import { md5, getMac, requestSoap } from '../events/login'

export default {
  getUserPath: () => app.getPath('userData'),
  autoUpdater: (funcName: updaterEventsName) => {
    onAutoUpdater(funcName, {})
  },
  md5: (str: string) => md5(str),
  getMac: () => getMac(),
  requestSoap: (code: string, data: any) => {
    return requestSoap(code, data)
  },
}