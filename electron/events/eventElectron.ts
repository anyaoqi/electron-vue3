const { app }  = require('electron')
import { onAutoUpdater, updaterEventsName } from '../versionUpdate'
import { md5, getMac, requestSoap } from './login'
export default {
  getUserPath: () => app.getPath('userData'),
  autoUpdater: (funcName: updaterEventsName, params: any) => {
    console.log('1111', funcName, params);
    onAutoUpdater(funcName, {})
  },
  md5: (str: string) => md5(str),
  getMac: () => getMac(),
  requestSoap: (code: any, data: any) => {
    return requestSoap(code, data)
  },
}