const { app }  = require('electron')
import { onAutoUpdater, updaterEventsName } from '../versionUpdate'

export default {
  getUserPath: () => app.getPath('userData'),
  autoUpdater: (funcName: updaterEventsName, params: any) => {
    console.log('1111', funcName, params);
    onAutoUpdater(funcName, {})
  },
}