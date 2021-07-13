/* eslint-disable no-param-reassign */
import { Document } from "mongoose";
import getUperInfo from "../api/getUperInfo";
import getUperSpace from "../api/getUperSpace";
import Uper from "../models/Uper";
import addVideos from "./addVideos";

const updateSubscribe = async (
  uperInDB: Uper & Document<any, any, Uper>
): Promise<number> => {
  const getUperInfoRes = await getUperInfo(uperInDB.mid);
  const getUperInfoResData = getUperInfoRes.data;
  if (getUperInfoResData.archive_count === uperInDB.archive_count) {
    return 0;
  }
  const updateCount = getUperInfoResData.archive_count - uperInDB.archive_count;
  const getUperSpaceRes = await getUperSpace(uperInDB.mid);
  uperInDB.archive_count = getUperInfoResData.archive_count;
  await addVideos(getUperSpaceRes.list.vlist, uperInDB);
  return updateCount;
};
export default updateSubscribe;
