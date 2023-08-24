import log from 'electron-log';
import { useNow, useDateFormat } from '@vueuse/core'

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
log.transports.console.level = false;

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