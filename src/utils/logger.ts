export default {
  info (content: string) {
    window.electronAPI.getLogger('info', content)
  },
  warn (content: string) {
    window.electronAPI.getLogger('warn', content)
  },
  error (content: string) {
    window.electronAPI.getLogger('error', content)
  },
  debug (content: string) {
    window.electronAPI.getLogger('debug', content)
  },
  verbose (content: string) {
    window.electronAPI.getLogger('verbose', content)
  },
  silly (content: string) {
    window.electronAPI.getLogger('silly', content)
  }
}