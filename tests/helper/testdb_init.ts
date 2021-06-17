import lodash from "lodash";
import addVideos from "../../controllers/addVideos";
import Uper from "../../models/Uper";
import Video from "../../models/Video";
import uper from "./data/upers.json";
import videos from "./data/videos.json";

const initDB = async (): Promise<any> => {
  await Uper.deleteMany();
  await Video.deleteMany();
  const uperInDB = new Uper(uper);
  const fmtedVideos = videos.map((video) =>
    lodash.omit(video, "_id", "uper", "__v")
  );
  const savedUper = await addVideos(fmtedVideos, uperInDB);
  return savedUper;
};

export default initDB;
