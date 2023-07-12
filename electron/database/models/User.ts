import getDatabase from "../index"
const { DataTypes, Model } = require("sequelize")

class User extends Model {}
User.init(
  {
    email: {
      type: DataTypes.STRING,
    },
    nickName: {
      type: DataTypes.STRING,
    },
    avatar: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: getDatabase(),
    modelName: "User",
    tableName: "User",
  }
)

export default async () => {
  await  User.sync()
  return User
}