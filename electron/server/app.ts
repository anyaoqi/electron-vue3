import allowCrossDomain from "./utils/allowCrossDomain"
import userRouter from "./routes/user"
// import { initDatabase } from '../database/index'
import { initMysql } from '../database/mysql/index'
import type { Express } from "express"
export let expressApp: Express

const initApp = () => {
  // 内置接口
  const express = require("express")
  expressApp = express()

  // initDatabase()
  initMysql()
  
  // 跨域
  expressApp.use(allowCrossDomain)

  // 路由
  expressApp.use("/user", userRouter)

  expressApp.listen(5354)
}

export default initApp
