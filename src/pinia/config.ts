import { defineStore } from 'pinia'
import { configType } from '@config/type.config'
import defaultConfig from '@config/config.json'

interface iState {
  config: configType
}

export const useConfig = defineStore('config', {
  state:():iState => ({
     config: defaultConfig
  }),
  actions: {
    setConfig(config: configType) {
      this.config = config
    }
  }
})