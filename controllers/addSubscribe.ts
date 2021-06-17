import { getUnixTime } from "date-fns";
import { NextFunction, Response } from "express";
import getUperInfo from "../api/getUperInfo";
import getUserSpace from "../api/getUserSpace";
import Uper from "../models/Uper";
import addVideos from "./addVideos";

const addSubscribe = async (
  mid: string,
  res: Response<any, Record<string, any>>,
  next: NextFunction
): Promise<void> => {
  const uperInDB = await Uper.findOne({ mid });
  if (uperInDB !== null) {
    return next({ code: 409, message: `[409] Conflict ${mid}` });
  }
  const getUperInfoRes = await getUperInfo(mid);
  const fmtedRes1 = {
    ...getUperInfoRes.data,
    mid: getUperInfoRes.data.card.mid,
    lastUpdate: getUnixTime(Date.now()),
  };
  const newUper = new Uper(fmtedRes1);
  const getUserSpaceRes = await getUserSpace(mid);
  await newUper.save();
  const dbRes2 = await addVideos(getUserSpaceRes.list.vlist, newUper);
  res.json(dbRes2);
};

export default addSubscribe;
