/* eslint-disable no-param-reassign */
import lodash from "lodash";
import { Document } from "mongoose";
import Video from "../models/Video";
import { VlistType } from "../api/getUperSpace";
import Uper from "../models/Uper";
import trimVideos from "./trimVideos";

const addVideos = async (
  vlist: VlistType[],
  uper: Uper & Document<any, any, Uper>
): Promise<Uper & Document<any, any, Uper>> => {
  const videoToDBPAry = vlist.map(async (newVideo) => {
    const exist = await Video.exists({
      aid: newVideo.aid,
      uper: uper._id,
    });
    if (!exist && newVideo.created >= uper.lastUpdate) {
      return {
        ...newVideo,
        uper: uper._id,
        subscriber: uper.subscriber,
      };
    }
    return false;
  });
  const videoToDB = await Promise.all(videoToDBPAry);
  const videoToDBCompacted = lodash.compact(videoToDB);
  const savedVideos = await Video.insertMany(videoToDBCompacted, {
    ordered: false,
  });
  const savedVideosId = savedVideos.map((video) => video._id);
  const videosSet = new Set(uper.videos);
  savedVideosId.forEach((id) => {
    videosSet.add(id);
  });
  uper.videos = Array.from(videosSet);
  await trimVideos(uper);
  const savedUper = await uper.save();
  return savedUper;
};

export default addVideos;
