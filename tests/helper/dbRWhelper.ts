import User, { UserAsJSON } from "../../models/User";

const usersInDB = async (): Promise<UserAsJSON> => {
  const users = await User.find({});
  return users.map((user) => user.toJSON()) as unknown as Promise<UserAsJSON>;
};

export default { usersInDB };
