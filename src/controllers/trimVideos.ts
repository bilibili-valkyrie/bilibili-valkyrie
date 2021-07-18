import { Document } from "mongoose";
import Uper from "../models/Uper";
import Video from "../models/Video";

const trimVideos = async (
  uper: Uper & Document<any, any, Uper>
): Promise<void> => {
  const updatedTime = uper.lastUpdate;
  await Video.deleteMany({ uper: uper._id, created: { $lt: updatedTime } });
};
export default trimVideos;
