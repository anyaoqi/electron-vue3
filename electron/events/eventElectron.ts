const { app }  = require('electron')

export default {
  getUserPath: () => app.getPath('userData'),
}