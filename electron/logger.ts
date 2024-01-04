import { app } from 'electron'
import log from 'electron-log';
import { useNow, useDateFormat } from '@vueuse/core'
const path = require("path");
const fs = require("fs")

const nowDate = useDateFormat(useNow(), 'YYYY-MM-DD').value;
// 日志文件名
log.transports.file.fileName = nowDate+'.log';
// 位置
// on Windows C:\Users\%USERPROFILE%\AppData\Roaming\{app name}\logs\${date}.log
// 日志格式
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}';
// 日志大小 1048576（1M)
log.transports.file.maxSize = 1048576;
// 日志文件等级
log.transports.file.level = 'silly';
// 控制台日志等级
log.transports.console.level = 'warn';

/**
 * 删除历史日志
 */
export const deleteHistoryLog = () => {
  // 找到存储日志文件的文件夹。
  // 获取文件列表并筛选出你希望删除的旧日志文件。
  // 使用 fs.unlink 方法删除这些旧日志文件
  try {
    let DB_PATH = path.join(app.getPath("userData"), "/logs");
    const files = fs.readdirSync(DB_PATH);
    const logFiles: string[] = files.filter((file:any) => path.extname(file) === '.log');
    // 删除的日志时间范围(一个月之前的都删除，一个月之内的不删除)
    const historyDate = new Date()
    historyDate.setMonth(historyDate.getMonth() - 1)
    logFiles.forEach(fileName => {
      const fileDate = new Date(fileName.substring(0,10))
      if(fileDate < historyDate){
        const filePath = path.join(DB_PATH, fileName)
        fs.unlinkSync(filePath);
      }
    })
  } catch (err) {
    log.error('删除历史日志失败：'+err)
  }
}

// 有六个日志级别error, warn, info, verbose, debug, silly
export default {
  info (param: any) {
    log.info(param)
  },
  warn (param: any) {
    log.warn(param)
  },
  error (param: any) {
    log.error(param)
  },
  debug (param: any) {
    log.debug(param)
  },
  verbose (param: any) {
    log.verbose(param)
  },
  silly (param: any) {
    log.silly(param)
  }
}