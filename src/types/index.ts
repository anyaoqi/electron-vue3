// 登录表单
export interface iLoginForm  {
  username: string,
  password: string,
}

// 数据库配置项
export interface iDatabaseConfig {
  type: string
  user: string
  password: string
  host: string
  port: number,
  database: string
}