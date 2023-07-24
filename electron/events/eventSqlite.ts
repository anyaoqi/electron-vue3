import mysqlEvents from '../database/mysql/events'

export default {
  getUsers: () => mysqlEvents.getUsers(),
}

