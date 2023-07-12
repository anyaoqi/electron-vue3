import getUserModel from '../models/User';

export async function getUserData() {
  const UserModel = await getUserModel()
  const userdata = await UserModel.findAll()
  return userdata
}