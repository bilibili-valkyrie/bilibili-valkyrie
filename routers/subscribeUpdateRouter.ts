/* eslint-disable consistent-return */
import { getUnixTime } from "date-fns";
import express from "express";
import getUperInfo from "../api/getUperInfo";
import getUserSpace from "../api/getUserSpace";
import addVideos from "../controllers/addVideos";
import Uper from "../models/Uper";
import Video from "../models/Video";

const subscribeUpdateRouter = express.Router();

subscribeUpdateRouter.put("/markSubscribeRead/:id", async (req, res, next) => {
  const uperInDB = await Uper.findById(req.params.id);
  if (uperInDB === null) {
    return next({ code: 404, message: `[404] Not Found ${req.params.id}` });
  }
  uperInDB.lastUpdate = getUnixTime(Date.now());
  await uperInDB.save();
  res.json(uperInDB);
});

subscribeUpdateRouter.put(
  "/changeSubscribeReadTime/:id",
  async (req, res, next) => {
    const uperInDB = await Uper.findById(req.params.id);
    if (uperInDB === null) {
      return next({ code: 404, message: `[404] Not Found ${req.params.id}` });
    }
    uperInDB.lastUpdate = req.body.lastUpdateUnix
      ? req.body.lastUpdateUnix
      : getUnixTime(req.body.lastUpdateJS);
    await uperInDB.save();
    res.json(uperInDB);
  }
);

subscribeUpdateRouter.get("/getUpdate/:id", async (req, res, next) => {
  const uperInDB = await Uper.findById(req.params.id);
  if (uperInDB === null) {
    return next({ code: 404, message: `[404] Not Found ${req.params.id}` });
  }
  const newVideos = await Video.find()
    .where("uper", req.params.id)
    .gte("created", uperInDB.lastUpdate);
  res.json(newVideos);
});

subscribeUpdateRouter.get("/updateVideos/:id", async (req, res, next) => {
  const uperInDB = await Uper.findById(req.params.id);
  if (uperInDB === null) {
    return next({ code: 404, message: `[404] Not Found ${req.params.id}` });
  }
  const getUperInfoRes = await getUperInfo(uperInDB.mid);
  const getUperInfoResData = getUperInfoRes.data;
  if (getUperInfoResData.archive_count === uperInDB.archive_count) {
    const noUpdateRes = { id: uperInDB._id, updates: 0 };
    return res.json(noUpdateRes);
  }
  const updateCount = getUperInfoResData.archive_count - uperInDB.archive_count;
  const getUserSpaceRes = await getUserSpace(uperInDB.mid);
  uperInDB.archive_count = getUperInfoResData.archive_count;
  const savedUper = await addVideos(getUserSpaceRes.list.vlist, uperInDB);
  res.json({ newUper: savedUper, updates: updateCount });
});

export default subscribeUpdateRouter;
