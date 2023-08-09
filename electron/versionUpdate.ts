import { autoUpdater, CancellationToken } from "electron-updater";
import type {
  UpdaterEvents,
  ProgressInfo,
  UpdateInfo,
} from 'electron-updater'

export interface iMessageParams {
  cmd: UpdaterEvents,
  message?: UpdateInfo|ProgressInfo|Error
}
export type handleUpdateType = (updateParams:iMessageParams) => void
export type updaterEventsName = "checkForUpdates"|"downloadUpdate"|"quitAndInstall"|"setFeedURL"

/**
 * 软件更新封装
 * @param {*} feedUrl 更新包的地址
 * @param {*} callback 回调函数
 */
export function updateHandle(feedUrl: string, callback: handleUpdateType) {
  function sendUpdateMessage(updateParams: iMessageParams) {
    callback && callback(updateParams)
  }
  // 设置更新包的地址
  autoUpdater.setFeedURL(feedUrl);
  // 存在新版本时，默认自动下载更新
  autoUpdater.autoDownload = false; // 若想通过渲染进程手动触发，需要设置autoDownload为false
  autoUpdater.disableWebInstaller = true;
  autoUpdater.forceDevUpdateConfig = import.meta.env.DEV
  // 监听升级失败事件
  autoUpdater.on("error", function (error: Error) {
    sendUpdateMessage({
      cmd: "error",
      message: error,
    });
  });
  // 监听开始检测更新事件
  autoUpdater.on("checking-for-update", function () {
    sendUpdateMessage({
      cmd: "checking-for-update",
    });
  });
  // 监听发现可用更新事件
  autoUpdater.on("update-available", function (message: UpdateInfo) {
    console.log('fn-update-available', message);
    
    sendUpdateMessage({
      cmd: "update-available",
      message: message,
    });
  });
  // 监听没有可用更新事件
  autoUpdater.on("update-not-available", function (message: UpdateInfo) {
    console.log('fn-update-not-available', message);
    sendUpdateMessage({
      cmd: "update-not-available",
      message: message,
    });
  });
  // 更新下载进度事件
  autoUpdater.on("download-progress", function (ProgressInfo: ProgressInfo) {
    console.log('fn-download-progress', ProgressInfo);
    
    sendUpdateMessage({
      cmd: "download-progress",
      message: ProgressInfo,
    });
  });
  // 监听下载完成事件
  autoUpdater.on(
    "update-downloaded",
    function () { 
      sendUpdateMessage({
        cmd: "update-downloaded",
      });
      // 退出并安装更新包
      autoUpdater.quitAndInstall(false, true);
    }
  );
}

/**
 * 接收渲染进程消息，执行对应方法，
 * @param funcName funcName 方法名，不传默认执行检查更新方法
 * @param params autoUpdater中对应的funcName方法参数
 */
export function onAutoUpdater(funcName: updaterEventsName, params: any) {
  if (funcName) {
    const updateFunc = autoUpdater[funcName];
    if (updateFunc && typeof updateFunc === "function") {
      if(funcName == 'downloadUpdate') {
        const cancellationToken = new CancellationToken()
        autoUpdater.downloadUpdate(cancellationToken)
      } else if (funcName == 'quitAndInstall') {
        autoUpdater.quitAndInstall(false, true)
      } else {
        autoUpdater[funcName](params);
      }
    }
  } else {
    autoUpdater.checkForUpdates();
  }
}