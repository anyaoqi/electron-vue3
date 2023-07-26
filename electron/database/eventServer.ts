import mysqlEvents from './mysql/events'

const dbName = "mysql";
const dbs = {
  mysql: mysqlEvents,
}
const dbEvents = dbs[dbName]

export default {
  getUsers: () => dbEvents.getUsers(),
}

