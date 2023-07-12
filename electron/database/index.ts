import dayjs from 'dayjs'
import { join } from "path"
import { app } from "electron"
export let sequelize: any

/**
 * 初始化数据库实例，返回静态数据库实例
 * @param strict 是否强制初始化
 * @returns
 */
export const initDatabase = async (strict: boolean = false) => {
  const now: string = dayjs().format("YYYY-MM-DD HH:mm:ss")
  const dbPath = join(app.getPath("userData"), "databse.db")
  // const dbPath = "./database.db"
  if (sequelize === undefined || strict) {
    const { Sequelize } = require("sequelize")
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: dbPath,
    })
  }
  try {
    await sequelize.authenticate();
    console.log(`[${now}]success`)
  } catch (error) {
    console.log(`[${now}]error：${error}`)
  }
  console.log(`[${now}]path: ${dbPath}`)
  return sequelize
}

// 获取数据库
const getDatabase = () => {
  return initDatabase()
}

// 初始化
export default getDatabase