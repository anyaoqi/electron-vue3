import mysqlEvents from './mysql/events'

// 数据库类型别名字面量
type databaseType = "mysql"
// 当前数据库类型
const dbType: databaseType = "mysql";
// 各个数据库执行对应方法
const dbs = {
  mysql: mysqlEvents,
}
// 当前数据库所有查询方法
const dbEvents = dbs[dbType]

export default {
  ...dbEvents,
}

