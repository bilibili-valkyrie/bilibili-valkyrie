import User from "../../models/User";
import user from "./data/users.json";

const initUsers = async (): Promise<any> => {
  await User.deleteMany();
  const usersInDB = new User(user);
  await usersInDB.save();
  return usersInDB;
};

export default initUsers;
