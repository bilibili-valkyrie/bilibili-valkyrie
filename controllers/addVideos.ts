/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import Video from "../models/Video";
import { VlistType } from "../api/getUserSpace";

const addVideos = async (
  vlist: VlistType[],
  uper: Record<string, any>
): Promise<void> => {
  const videoToDBPAry = vlist.map(async (newVideo) => {
    return {
      ...newVideo,
      uper: uper._id,
      _id: newVideo.aid,
    };
  });
  const videoToDB = await Promise.all(videoToDBPAry);
  const savedVideos = await Video.insertMany(videoToDB);
  const savedVideosId = savedVideos.map((video) => video._id);
  const videosSet = new Set(uper.videos);
  savedVideosId.forEach((id) => {
    videosSet.add(id);
  });
  uper.videos = Array.from(videosSet);
};

export default addVideos;
