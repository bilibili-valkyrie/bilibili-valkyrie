/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Uper from "../../models/Uper";
import User, { UserAsJSON } from "../../models/User";
import Video from "../../models/Video";

const usersInDB = async (): Promise<UserAsJSON[]> => {
  const users = await User.find({});
  return users.map((user) => user.toJSON()) as unknown as Promise<UserAsJSON[]>;
};

const upersInDB = async () => {
  const upers = await Uper.find();
  return upers.map((uper) => uper.toJSON());
};

const videosInDB = async () => {
  const videos = await Video.find();
  return videos.map((video) => video.toJSON());
};

export default { usersInDB, upersInDB, videosInDB };
