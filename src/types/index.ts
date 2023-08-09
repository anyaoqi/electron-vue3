// 登录表单
export interface iLoginForm  {
  username: string,
  password: string,
}

// 数据库配置项
export interface iDatabase {
  type: string
  user: string
  password: string
  host: string
  port: number,
  database: string
}

// 许可证信息
export interface iLicence {
  "sys_code": string,
  "corp_uuid": string,
  "county_uuid": string,
  "address": string,
  "status_code": string,
  "is_active": string,
  "manage_person_mobile": string,
  "cust_type_name": string,
  "corp_name": string,
  "county_name": string,
  "order_type_code": string,
  "cust_code": string,
  "state_cust_code": string,
  "is_nonsmoke": string,
  "cust_uuid": string,
  "cust_name": string,
  "manage_unit_uuid": string,
  "cust_manager_person_uuid": string,
  "license_code": string,
  "cust_manager_name": string,
  "cust_type_uuid": string,
  "cust_manager_mobile": string,
  "bank_code": string
}