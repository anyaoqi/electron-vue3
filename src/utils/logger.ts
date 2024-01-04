// 日志
export default {
  info (content: string) {
    window.electronAPI.logger('info', content)
  },
  warn (content: string) {
    window.electronAPI.logger('warn', content)
  },
  error (content: string) {
    window.electronAPI.logger('error', content)
  },
  debug (content: string) {
    window.electronAPI.logger('debug', content)
  },
  verbose (content: string) {
    window.electronAPI.logger('verbose', content)
  },
  silly (content: string) {
    window.electronAPI.logger('silly', content)
  }
}