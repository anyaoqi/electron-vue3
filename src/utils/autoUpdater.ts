import type {
  UpdaterEvents,
  ProgressInfo,
  UpdateInfo,
} from 'electron-updater'

export interface iMessageParams {
  cmd: UpdaterEvents,
  message?: UpdateInfo|ProgressInfo|Error
}

// 监听版本升级消息
export function onUpdateMessage(callback: (params:iMessageParams) => void) {
  window.electronAPI.onUpdateMessage((_event:any, updateParams: iMessageParams) => {
    callback(updateParams)
  })
}

// 移除监听版本升级消息
export function reUpdateMessage() {
  window.electronAPI.reUpdateMessage()
}

// 检查更新
export function checkUpdate() {
  // console.log(window.electronAPI.autoUpdater)
  window.electronAPI.autoUpdater('checkForUpdates');
}
// 下载更新
export function downloadUpdate() {
  window.electronAPI.autoUpdater('downloadUpdate');
}
// 退出并安装
export function quitAndInstall() {
  window.electronAPI.autoUpdater('quitAndInstall');
}
// 设置更新地址
export function setFeedURL() {
  window.electronAPI.autoUpdater('setFeedURL');
}
